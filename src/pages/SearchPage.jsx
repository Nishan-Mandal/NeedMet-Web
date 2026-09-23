import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getListingByIds } from "../services/firebase/firestore/listingService";
import { AlgoliaService } from "../services/algolia/searchService";
import { useCategories } from "../hooks/useAllCategories";
import {
  BusinessCTA,
  CategorySection,
  ListingSection,
  SearchPageLoader,
  TrendingSearches,
  SEO,
  SearchAutocomplete,
} from "../components";
import searchImg from "../assets/search.png";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(activeQuery);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(!activeQuery.trim());
  const inputContainerRef = useRef(null);

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // Sync input text when URL query changes (e.g. from Hero redirect or browser back/forward)
  useEffect(() => {
    setQuery(activeQuery);
  }, [activeQuery]);

  const [recentSearches, setRecentSearches] = useState([]);

  // Load Recent Searches on mount
  useEffect(() => {
    try {
      const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
      setRecentSearches(searches);
    } catch {
      setRecentSearches([]);
    }
  }, []);

  // Fetch cached categories (0 Algolia requests!)
  const { data: allCategories = [] } = useCategories();

  // Save to recent searches ONLY on explicitly committed search
  const saveToRecentSearches = (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== clean.toLowerCase()
      );
      const updated = [clean, ...filtered].slice(0, 10);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  // Explicitly commit a search (Enter key, selecting suggestion, clicking pill)
  const commitSearch = (searchTerm) => {
    const term = (typeof searchTerm === "string" ? searchTerm : query).trim();
    setIsAutocompleteOpen(false);

    if (!term) {
      setSearchParams({}, { replace: true });
      return;
    }

    setSearchParams({ q: term });
    setQuery(term);
    saveToRecentSearches(term);
  };

  // Record into recent searches if navigated with a committed ?q=... in URL
  useEffect(() => {
    if (activeQuery.trim()) {
      saveToRecentSearches(activeQuery);
    }
  }, [activeQuery]);

  // Listings Query (Algolia + Firebase) - only runs for COMMITTED activeQuery!
  const {
    data: listingResults = [],
    isLoading: listingsLoading,
  } = useQuery({
    queryKey: ["searchListings", activeQuery],
    queryFn: async () => {
      // Step 1: Search Algolia
      const listingHits = await AlgoliaService.searchListings(activeQuery);

      // Extract IDs
      const ids = listingHits
        .map((item) => item.objectID?.toString())
        .filter(Boolean);

      // Step 2: Fetch Full Firebase Listings
      const fetchedListings = await getListingByIds(ids);

      // Step 3: Maintain Algolia Order
      const listingMap = {};

      fetchedListings.forEach((listing) => {
        listingMap[listing.listingId] = listing;
      });

      const orderedListings = ids
        .map((id) => listingMap[id])
        .filter(Boolean);

      return orderedListings;
    },
    enabled: !!activeQuery.trim(),
  });

  // Filter Categories in-memory for COMMITTED activeQuery (0 Algolia requests!)
  const categoryResults = useMemo(() => {
    if (!activeQuery.trim() || !allCategories?.length) return [];
    const normalized = activeQuery.trim().toLowerCase();
    return allCategories.filter((cat) => {
      const nameMatch = cat.name?.toLowerCase().includes(normalized);
      const tagMatch = cat.tags?.some((tag) =>
        tag?.toLowerCase().includes(normalized)
      );
      return nameMatch || tagMatch;
    });
  }, [activeQuery, allCategories]);

  const removeRecentSearch = (term) => {
    const updated = recentSearches.filter(
      (item) => item !== term
    );

    setRecentSearches(updated);

    localStorage.setItem(
      "recentSearches",
      JSON.stringify(updated)
    );
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const isLoading = listingsLoading;

  return (
    <div className="min-h-screen w-full bg-white box-border animate-[fadeIn_0.25s_ease-out]">
      <SEO 
        title={activeQuery.trim() ? `Search results for "${activeQuery}" | NeedMet` : "Search Local Businesses & Services | NeedMet"}
        description={activeQuery.trim() ? `Check search results for "${activeQuery}" on NeedMet. Explore local shops, reviews, timing schedules, and contact details.` : "Search for service providers and shops near you. Read ratings, find directions, and contact local sellers."}
        canonicalUrl="https://needmet.in/search"
      />

      {/* Search Header */}
      <div className="w-full px-[35px] max-[1024px]:px-3 max-[676px]:px-2.5 pt-5 max-[1024px]:pt-[26px] max-[676px]:pt-5 mb-4 max-[676px]:mb-[18px]">
        <div className="w-full max-w-[780px] mx-auto flex items-center gap-3.5 max-[676px]:gap-0">
          <button
            type="button"
            className="flex max-[676px]:hidden w-12 h-12 rounded-full bg-white border-[1.5px] border-primary/12 shadow-[0_4px_14px_rgba(15,92,62,0.06),0_1px_2px_rgba(0,0,0,0.03)] text-primary items-center justify-center text-[1.1rem] cursor-pointer shrink-0 transition-all hover:bg-[#f0f7f4] hover:border-primary hover:text-primary hover:-translate-x-0.5 hover:shadow-[0_6px_18px_rgba(15,92,62,0.14)] active:scale-95"
            onClick={handleGoBack}
            aria-label="Go back"
            title="Go back"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          <div className="relative flex-1 min-w-0" ref={inputContainerRef}>
            <div className="w-full max-w-[720px] mx-auto flex items-center gap-3 max-[676px]:gap-2.5 py-[15px] px-5 max-[1024px]:py-[13px] max-[1024px]:px-4 max-[676px]:py-3 max-[676px]:px-3.5 bg-gradient-to-b from-white to-[#f8fbf9] border-[1.5px] border-primary/12 rounded-[22px] max-[1024px]:rounded-[18px] max-[676px]:rounded-[16px] shadow-[0_4px_18px_rgba(15,92,62,0.05),0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:border-primary/25 hover:shadow-[0_8px_24px_rgba(15,92,62,0.08)] focus-within:bg-white focus-within:border-primary focus-within:-translate-y-px">
              <i className="fa-solid fa-magnifying-glass text-primary text-base max-[676px]:text-[0.95rem] flex items-center justify-center shrink-0"></i>
              <input
                type="text"
                autoFocus
                placeholder="What service do you need?"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsAutocompleteOpen(true);
                }}
                onFocus={() => setIsAutocompleteOpen(true)}
                onClick={() => setIsAutocompleteOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    commitSearch(query);
                  }
                }}
                className="flex-1 bg-transparent border-none outline-none text-[15px] max-[1024px]:text-[14px] font-medium text-text placeholder:text-[#8b9b93]"
              />
              {query && (
                <i 
                  onClick={() => {
                    setQuery("");
                    setSearchParams({}, { replace: true });
                    setIsAutocompleteOpen(false);
                  }} 
                  className="fa-solid fa-xmark w-[30px] h-[30px] max-[676px]:w-[26px] max-[676px]:h-[26px] rounded-full flex items-center justify-center cursor-pointer text-sm max-[676px]:text-xs text-[#7f9188] hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all"
                  title="Clear search"
                ></i>
              )}
            </div>

            <SearchAutocomplete
              query={query}
              categories={allCategories}
              recentSearches={recentSearches}
              isOpen={isAutocompleteOpen}
              onClose={() => setIsAutocompleteOpen(false)}
              onSelectQuery={(term) => {
                commitSearch(term);
              }}
              onSelectCategory={(cat) => {
                commitSearch(cat.name || "");
              }}
              onRemoveRecentSearch={removeRecentSearch}
              onClearAllRecentSearches={clearAllRecentSearches}
              wrapperRef={inputContainerRef}
            />
          </div>
        </div>
      </div>

      {
        !activeQuery.trim() && (
          <TrendingSearches />
        )
      }

      {/* Loading */}
      {
        isLoading && (
          <div className="w-full">
            <SearchPageLoader />
          </div>
        )
      }

      {/* Empty State */}
      {
        !isLoading &&
        !activeQuery.trim() && (
          <div className="w-full min-h-[300px] p-8 flex flex-col justify-center items-center text-center">
            <img src={searchImg} alt="search_img" loading="lazy" className="w-[220px] sm:w-[300px] mb-3" />
            <h2 className="font-heading font-bold text-2xl sm:text-[32px] mb-3 text-text">Search Listings &amp; Services</h2>

            <p className="text-[#666] text-sm sm:text-base">
              Find rooms, salons, PGs,
              services and more instantly.
            </p>
          </div>
        )
      }

      {/* Results */}
      {
        !isLoading &&
        activeQuery.trim() !== "" && (
          <div className="flex flex-col">
            <CategorySection
              title="Searched Categories"
              subTitle="DISCOVER RELEVANT SERVICES"
              categories={categoryResults}
              showSeeAll={false}
              style={{backgroundColor: 'var(--background-secondary)'}}
            />
            <ListingSection
              title="Searched Listings"
              subTitle="EXPLORE LOCAL LISTINGS"
              listings={listingResults}
              showSeeAll={false}
            />
          <BusinessCTA />
          </div>
        )
      }
    </div>
  );
}