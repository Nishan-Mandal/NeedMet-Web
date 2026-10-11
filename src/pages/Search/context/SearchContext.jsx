import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getListingByIds } from "../../../services/firebase/firestore/listingService";
import { AlgoliaService } from "../../../services/algolia/searchService";
import { useCategories } from "../../../hooks/useAllCategories";

const SearchContext = createContext(null);

export const isListingOpenNow = (item) => {
  if (!item?.businessHours || typeof item.businessHours !== "object") return false;
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const now = new Date();
  const currentDay = days[now.getDay()];
  const todaySchedule = item.businessHours[currentDay];
  if (!todaySchedule || todaySchedule.isClosed) return false;
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const slots = todaySchedule.slots || [];
  return slots.some((slot) => {
    if (!slot.open || !slot.close) return false;
    const [oh, om] = slot.open.split(":").map(Number);
    const [ch, cm] = slot.close.split(":").map(Number);
    return currentMin >= oh * 60 + om && currentMin < ch * 60 + cm;
  });
};

export function SearchProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeQuery = searchParams.get("q") || "";

  // View Mode: 'grid' | 'list'
  const [viewMode, setViewMode] = useState("grid");

  // Mobile Filter & Sort Drawer State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  // Dynamic Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocalities, setSelectedLocalities] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [minRating, setMinRating] = useState(0); // 0 = any, 3.5, 4.0, 4.5
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [claimedOnly, setClaimedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended"); // 'recommended', 'rating', 'price_asc', 'price_desc', 'newest'

  // Pagination: configurable with default 10 per page with URL sync
  const urlLimit = parseInt(searchParams.get("size") || searchParams.get("limit"), 10);
  const initialLimit = [10, 20, 50].includes(urlLimit) ? urlLimit : 10;
  const [itemsPerPage, setItemsPerPageState] = useState(initialLimit);

  const urlPage = parseInt(searchParams.get("page"), 10);
  const initialPage = !isNaN(urlPage) && urlPage > 0 ? urlPage : 1;
  const [currentPage, setCurrentPageInternal] = useState(initialPage);

  // Sync internal currentPage and itemsPerPage when URL parameter changes (e.g. browser Back / Forward)
  useEffect(() => {
    const p = parseInt(searchParams.get("page"), 10);
    const valid = !isNaN(p) && p > 0 ? p : 1;
    setCurrentPageInternal(valid);

    const l = parseInt(searchParams.get("size") || searchParams.get("limit"), 10);
    if ([10, 20, 50].includes(l)) {
      setItemsPerPageState(l);
    }
  }, [searchParams]);

  // Reset page and filters when activeQuery changes
  useEffect(() => {
    setCurrentPageInternal(1);
    setSelectedCategories([]);
    setSelectedLocalities([]);
    setSelectedTags([]);
    setMinRating(0);
    setOpenNowOnly(false);
    setVerifiedOnly(false);
    setClaimedOnly(false);
  }, [activeQuery]);

  // Categories data fallback
  const { data: allCategories = [] } = useCategories();

  // Fetch listings from Algolia + Firestore using TanStack Query with caching & keepPreviousData
  const {
    data: rawListings = [],
    isLoading: listingsLoading,
    isFetching: listingsFetching,
    refetch: refetchListings,
  } = useQuery({
    queryKey: ["searchListings", activeQuery],
    queryFn: async () => {
      const listingHits = await AlgoliaService.searchListings(activeQuery, { hitsPerPage: 100 });
      const ids = listingHits
        .map((item) => item.objectID?.toString())
        .filter(Boolean);

      if (!ids.length) return [];

      const fetchedListings = await getListingByIds(ids);
      const listingMap = {};
      fetchedListings.forEach((listing) => {
        listingMap[listing.listingId] = listing;
      });

      return ids.map((id) => listingMap[id]).filter(Boolean);
    },
    enabled: !!activeQuery.trim(),
    staleTime: 5 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // 1. DYNAMIC CATEGORIES: Computed directly from fetched backend listings
  const availableCategories = useMemo(() => {
    const counts = {};
    rawListings.forEach((l) => {
      const cat = l.category?.trim();
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
      if (Array.isArray(l.categories)) {
        l.categories.forEach((c) => {
          const itemCat = typeof c === "string" ? c.trim() : c?.name?.trim();
          if (itemCat && itemCat !== cat) {
            counts[itemCat] = (counts[itemCat] || 0) + 1;
          }
        });
      }
    });

    if (Object.keys(counts).length > 0) {
      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    }

    return allCategories.slice(0, 8).map((c) => ({
      name: c.name,
      count: c.listingCount || 0,
    }));
  }, [rawListings, allCategories]);

  // 2. DYNAMIC LOCALITIES / AREAS: Auto-extracted from backend listings
  const availableLocalities = useMemo(() => {
    const counts = {};
    const knownAreas = [
      "Durgachak",
      "City Centre",
      "Haldia Township",
      "Basudevpur",
      "Sutahata",
      "Brajarafchak",
      "Ranichak",
      "Chiranjibpur",
      "Bhabanipur",
      "Debhog",
      "Khanjanchak",
      "Barghasipur",
      "Manjushree"
    ];

    rawListings.forEach((l) => {
      const addr = (l.address || "").toLowerCase();
      const city = (l.city || "").toLowerCase();

      // Check if explicit locality field exists
      if (l.locality && typeof l.locality === "string") {
        const loc = l.locality.trim();
        counts[loc] = (counts[loc] || 0) + 1;
        return;
      }

      // Match known areas from Haldia address
      let matched = false;
      for (const area of knownAreas) {
        if (addr.includes(area.toLowerCase()) || city.includes(area.toLowerCase())) {
          counts[area] = (counts[area] || 0) + 1;
          matched = true;
          break;
        }
      }

      if (!matched && l.city && l.city.toLowerCase() !== "haldia") {
        const cleanCity = l.city.trim();
        counts[cleanCity] = (counts[cleanCity] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [rawListings]);

  // 3. DYNAMIC TAGS / FEATURES: Auto-extracted from backend listings
  const availableTags = useMemo(() => {
    const counts = {};
    rawListings.forEach((l) => {
      if (Array.isArray(l.tags)) {
        l.tags.forEach((tag) => {
          if (typeof tag === "string") {
            const clean = tag.trim();
            if (clean && clean.length > 2) {
              counts[clean] = (counts[clean] || 0) + 1;
            }
          }
        });
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [rawListings]);

  // 4. DYNAMIC RATING COUNTS
  const ratingCounts = useMemo(() => {
    let r45 = 0;
    let r40 = 0;
    let r35 = 0;

    rawListings.forEach((l) => {
      const r = Number(l.rating) || 0;
      if (r >= 4.5) r45++;
      if (r >= 4.0) r40++;
      if (r >= 3.5) r35++;
    });

    return { r45, r40, r35, total: rawListings.length };
  }, [rawListings]);

  // 5. DYNAMIC STATUS COUNTS (Open Now, Verified, Claimed)
  const statusCounts = useMemo(() => {
    let openCount = 0;
    let verifiedCount = 0;
    let claimedCount = 0;

    rawListings.forEach((l) => {
      if (isListingOpenNow(l)) openCount++;
      if (Boolean(l.verifiedBy || l.isVerified || l.verified)) verifiedCount++;
      if (Boolean(l.isClaimed)) claimedCount++;
    });

    return { openCount, verifiedCount, claimedCount };
  }, [rawListings]);

  // Dynamic filter application
  const filteredListings = useMemo(() => {
    let list = [...rawListings];

    // Category Filter
    if (selectedCategories.length > 0) {
      list = list.filter((item) =>
        selectedCategories.some((cat) => {
          const c = cat.toLowerCase();
          return (
            item.category?.toLowerCase() === c ||
            item.categories?.some((catItem) =>
              (typeof catItem === "string" ? catItem : catItem?.name)?.toLowerCase() === c
            )
          );
        })
      );
    }

    // Locality Filter
    if (selectedLocalities.length > 0) {
      list = list.filter((item) => {
        const fullAddr = `${item.address || ""} ${item.city || ""} ${item.locality || ""}`.toLowerCase();
        return selectedLocalities.some((loc) => fullAddr.includes(loc.toLowerCase()));
      });
    }

    // Tags Filter
    if (selectedTags.length > 0) {
      list = list.filter((item) =>
        Array.isArray(item.tags) &&
        selectedTags.some((tag) =>
          item.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        )
      );
    }

    // Rating Filter
    if (minRating > 0) {
      list = list.filter((item) => (Number(item.rating) || 0) >= minRating);
    }

    // Verified Filter
    if (verifiedOnly) {
      list = list.filter((item) => Boolean(item.verifiedBy || item.isVerified || item.verified));
    }

    // Open Now Filter
    if (openNowOnly) {
      list = list.filter((item) => isListingOpenNow(item));
    }

    // Claimed Filter
    if (claimedOnly) {
      list = list.filter((item) => Boolean(item.isClaimed));
    }

    // Sort By
    if (sortBy === "rating") {
      list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === "reviews") {
      list.sort((a, b) => (Number(b.reviews || b.ratingCount) || 0) - (Number(a.reviews || a.ratingCount) || 0));
    } else if (sortBy === "price_asc") {
      list.sort((a, b) => {
        const pA = Number(a.price || a.minPrice || a.pricing?.min || 0);
        const pB = Number(b.price || b.minPrice || b.pricing?.min || 0);
        return pA - pB;
      });
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => {
        const pA = Number(a.price || a.minPrice || a.pricing?.min || 0);
        const pB = Number(b.price || b.minPrice || b.pricing?.min || 0);
        return pB - pA;
      });
    } else if (sortBy === "distance") {
      list.sort((a, b) => parseFloat(a.distance || 0) - parseFloat(b.distance || 0));
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }

    return list;
  }, [
    rawListings,
    selectedCategories,
    selectedLocalities,
    selectedTags,
    minRating,
    verifiedOnly,
    openNowOnly,
    claimedOnly,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage) || 1;
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredListings.slice(start, start + itemsPerPage);
  }, [filteredListings, currentPage, itemsPerPage]);

  const setCurrentPage = (pageOrFn, { scroll = false } = {}) => {
    setCurrentPageInternal((prev) => {
      const target = typeof pageOrFn === "function" ? pageOrFn(prev) : pageOrFn;
      const targetPage = Math.max(1, Math.min(target, totalPages || 1));
      setSearchParams(
        (searchPrev) => {
          const next = new URLSearchParams(searchPrev);
          if (targetPage === 1) {
            next.delete("page");
          } else {
            next.set("page", targetPage.toString());
          }
          return next;
        },
        { replace: false }
      );
      if (scroll) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return targetPage;
    });
  };

  const setItemsPerPage = (size) => {
    const validSize = Number(size) || 10;
    setItemsPerPageState(validSize);
    setCurrentPageInternal(1);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("page");
        if (validSize === 10) {
          next.delete("size");
          next.delete("limit");
        } else {
          next.set("size", validSize.toString());
        }
        return next;
      },
      { replace: false }
    );
  };

  const goToPage = (page) => {
    setCurrentPage(page, { scroll: true });
  };

  // Auto-clamp currentPage if filtered listings decrease and page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedLocalities([]);
    setSelectedTags([]);
    setMinRating(0);
    setOpenNowOnly(false);
    setVerifiedOnly(false);
    setClaimedOnly(false);
    setSortBy("recommended");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedLocalities.length > 0 ||
    selectedTags.length > 0 ||
    minRating > 0 ||
    openNowOnly ||
    verifiedOnly ||
    claimedOnly;

  // Filter and Sort setters that reset page to 1
  const toggleCategory = (catName) => {
    setSelectedCategories((prev) =>
      prev.includes(catName)
        ? prev.filter((c) => c !== catName)
        : [...prev, catName]
    );
    setCurrentPage(1);
  };

  const toggleLocality = (locality) => {
    setSelectedLocalities((prev) =>
      prev.includes(locality)
        ? prev.filter((l) => l !== locality)
        : [...prev, locality]
    );
    setCurrentPage(1);
  };

  const toggleTag = (tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
    setCurrentPage(1);
  };

  const handleSetMinRating = (rating) => {
    setMinRating(rating);
    setCurrentPage(1);
  };

  const handleSetOpenNowOnly = (valOrFn) => {
    setOpenNowOnly(valOrFn);
    setCurrentPage(1);
  };

  const handleSetVerifiedOnly = (valOrFn) => {
    setVerifiedOnly(valOrFn);
    setCurrentPage(1);
  };

  const handleSetClaimedOnly = (valOrFn) => {
    setClaimedOnly(valOrFn);
    setCurrentPage(1);
  };

  const handleSetSortBy = (sortVal) => {
    setSortBy(sortVal);
    setCurrentPage(1);
  };

  const activeFiltersCount =
    (selectedCategories?.length || 0) +
    (selectedLocalities?.length || 0) +
    (selectedTags?.length || 0) +
    (minRating > 0 ? 1 : 0) +
    (openNowOnly ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (claimedOnly ? 1 : 0);

  const value = {
    activeQuery,
    rawListings,
    listingsLoading,
    listingsFetching,
    refetchListings,
    availableCategories,
    availableLocalities,
    availableTags,
    ratingCounts,
    statusCounts,
    filteredListings,
    paginatedListings,
    totalPages,
    currentPage,
    setCurrentPage,
    goToPage,
    itemsPerPage,
    setItemsPerPage,
    hasActiveFilters,
    activeFiltersCount,
    handleResetFilters,
    selectedCategories,
    toggleCategory,
    selectedLocalities,
    toggleLocality,
    selectedTags,
    toggleTag,
    minRating,
    setMinRating: handleSetMinRating,
    openNowOnly,
    setOpenNowOnly: handleSetOpenNowOnly,
    verifiedOnly,
    setVerifiedOnly: handleSetVerifiedOnly,
    claimedOnly,
    setClaimedOnly: handleSetClaimedOnly,
    sortBy,
    setSortBy: handleSetSortBy,
    viewMode,
    setViewMode,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    isMobileSortOpen,
    setIsMobileSortOpen,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
