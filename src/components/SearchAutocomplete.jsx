import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlgoliaService } from "../services/algolia/searchService";
import useDebounce from "../hooks/useDebounce";

/**
 * Helper to highlight matching substrings in suggestion items
 */
function HighlightMatch({ text, query }) {
  if (!text) return null;
  if (!query || !query.trim()) return <span>{text}</span>;

  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="text-[#0f5c3e] font-bold bg-[#e8f5ef] rounded px-0.5">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}

export default function SearchAutocomplete({
  query = "",
  categories = [],
  recentSearches = [],
  isOpen = false,
  isCompact = false,
  fullScreenOnMobile = !isCompact,
  onClose,
  onSelectQuery,
  onSelectCategory,
  onSelectListing,
  onRemoveRecentSearch,
  onClearAllRecentSearches,
  wrapperRef,
}) {
  const navigate = useNavigate();
  const [listingHits, setListingHits] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  const trimmedQuery = query.trim();
  const debouncedQuery = useDebounce(trimmedQuery, 320);

  // 1. Filter Categories in-memory
  const matchedCategories = useMemo(() => {
    if (!categories?.length) return [];
    if (!trimmedQuery) {
      // Show more categories on mobile full-screen so user has great discovery choices
      const limit = fullScreenOnMobile ? 8 : (isCompact ? 3 : 5);
      return categories.slice(0, limit);
    }
    const normalized = trimmedQuery.toLowerCase();

    return categories
      .filter((cat) => {
        const catName =
          typeof cat === "string"
            ? cat
            : cat?.name || cat?.category || cat?.title || "";
        const nameMatch = catName.toLowerCase().includes(normalized);
        const tagMatch =
          Array.isArray(cat?.tags) &&
          cat.tags.some((tag) =>
            typeof tag === "string" && tag.toLowerCase().includes(normalized)
          );
        return nameMatch || tagMatch;
      })
      .slice(0, 5);
  }, [trimmedQuery, categories, isCompact, fullScreenOnMobile]);

  // 2. Filter Recent Searches
  const matchedRecent = useMemo(() => {
    if (!recentSearches?.length) return [];
    if (!trimmedQuery) {
      return recentSearches.slice(0, fullScreenOnMobile ? 6 : 4);
    }
    const normalized = trimmedQuery.toLowerCase();
    return recentSearches
      .filter(
        (item) =>
          typeof item === "string" &&
          item.toLowerCase().includes(normalized) &&
          item.toLowerCase() !== normalized
      )
      .slice(0, 4);
  }, [trimmedQuery, recentSearches, fullScreenOnMobile]);

  // 3. Algolia listings search
  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setListingHits([]);
      setIsLoadingListings(false);
      return;
    }

    let active = true;
    setIsLoadingListings(true);

    AlgoliaService.getSuggestions(debouncedQuery, { hitsPerPage: 3 })
      .then((hits) => {
        if (active) {
          setListingHits(hits || []);
        }
      })
      .catch((err) => {
        console.error("Autocomplete fetch error:", err);
      })
      .finally(() => {
        if (active) {
          setIsLoadingListings(false);
        }
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // Flattened items for keyboard navigation
  const flattenedItems = useMemo(() => {
    const items = [];

    matchedRecent.forEach((term) => {
      items.push({ type: "recent", value: term });
    });

    matchedCategories.forEach((cat) => {
      items.push({ type: "category", value: cat });
    });

    listingHits.forEach((listing) => {
      items.push({ type: "listing", value: listing });
    });

    if (trimmedQuery.length >= 2) {
      items.push({ type: "query", value: trimmedQuery });
    }

    return items;
  }, [matchedRecent, matchedCategories, listingHits, trimmedQuery]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [trimmedQuery, listingHits]);

  const handleItemSelect = (item) => {
    if (!item) return;

    if (item.type === "recent" || item.type === "query") {
      const term = typeof item.value === "string" ? item.value : String(item.value || "");
      if (onSelectQuery) {
        onSelectQuery(term);
      } else {
        navigate(`/search?q=${encodeURIComponent(term)}`);
      }
    } else if (item.type === "category") {
      const catName =
        typeof item.value === "string"
          ? item.value
          : item.value?.name || item.value?.category || item.value?.title || "";
      if (onSelectCategory) {
        onSelectCategory(catName, item.value);
      } else {
        navigate(`/search?q=${encodeURIComponent(catName)}`);
      }
    } else if (item.type === "listing") {
      if (onSelectListing) {
        onSelectListing(item.value);
      } else {
        const id = item.value.objectID || item.value.listingId || item.value.id;
        const name = item.value.title || item.value.name || item.value.businessName || "";
        if (id) {
          navigate(`/listing/${id}`);
        } else if (name) {
          navigate(`/search?q=${encodeURIComponent(name)}`);
        }
      }
    }

    if (onClose) onClose();
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        (!wrapperRef?.current || !wrapperRef.current.contains(e.target))
      ) {
        if (onClose) onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, wrapperRef]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < flattenedItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : flattenedItems.length - 1
        );
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        handleItemSelect(flattenedItems[activeIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (onClose) onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, activeIndex, flattenedItems]);

  if (!isOpen) return null;

  const hasAnyMatches =
    matchedRecent.length > 0 ||
    matchedCategories.length > 0 ||
    listingHits.length > 0;

  if (!hasAnyMatches && !trimmedQuery) return null;

  let currentItemCounter = 0;

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => {
        // Prevent dropdown from losing focus prematurely
        e.stopPropagation();
      }}
      className={`${
        fullScreenOnMobile
          ? "max-sm:fixed max-sm:inset-x-0 max-sm:top-[57px] max-sm:bottom-[68px] max-sm:rounded-none max-sm:border-0 max-sm:shadow-none max-sm:z-40 max-sm:bg-white"
          : "absolute left-0 right-0"
      } sm:absolute sm:left-0 sm:right-0 ${
        isCompact
          ? "sm:top-[calc(100%+6px)] sm:rounded-2xl sm:border sm:border-[#0f5c3e]/15 sm:shadow-[0_16px_36px_-4px_rgba(15,92,62,0.18),0_4px_14px_rgba(15,92,62,0.08)]"
          : "sm:top-[calc(100%+10px)] sm:rounded-[24px] sm:border sm:border-[#0f5c3e]/20 sm:shadow-[0_20px_50px_-5px_rgba(15,92,62,0.22),0_6px_20px_rgba(15,92,62,0.10)]"
      } bg-white text-left z-[1000] overflow-hidden`}
    >
      <div
        className={`${
          fullScreenOnMobile
            ? "max-sm:h-full max-sm:max-h-none max-sm:p-4 max-sm:pb-8"
            : ""
        } ${
          isCompact
            ? "max-h-[290px] sm:max-h-[320px] p-2.5 sm:p-3"
            : "max-h-[440px] p-4 sm:p-5"
        } overflow-y-auto [scrollbar-width:thin] [scrollbar-color:theme(colors.gray.200)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300`}
      >
      {/* Loading progress bar */}
      {isLoadingListings && (
        <div className={`h-0.5 w-full bg-[#0f5c3e] rounded-full ${isCompact ? "mb-2" : "mb-3"} animate-pulse opacity-70`} />
      )}

      {/* 1. Recent Searches (if available) */}
      {matchedRecent.length > 0 && (
        <div className={isCompact ? "mb-2.5" : "mb-4"}>
          <div className={`flex items-center justify-between ${isCompact ? "mb-1 px-1.5 text-[11px]" : "mb-2 px-2 text-[12px]"} text-[#466a59] font-bold uppercase tracking-wider`}>
            <div className="flex items-center gap-1.5">
              <span className={`material-symbols-outlined ${isCompact ? "text-[15px]" : "text-[16px]"} text-[#0f5c3e]`}>history</span>
              <span>Recent Searches</span>
            </div>
            {onClearAllRecentSearches && (
              <button
                type="button"
                className={`${isCompact ? "text-[10.5px]" : "text-[11px]"} font-medium text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer`}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onClearAllRecentSearches();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClearAllRecentSearches();
                }}
              >
                Clear all
              </button>
            )}
          </div>

          <div className={isCompact ? "space-y-0.5" : "space-y-1"}>
            {matchedRecent.map((term) => {
              const itemIndex = currentItemCounter++;
              const isActive = activeIndex === itemIndex;
              return (
                <div
                  key={`recent-${term}`}
                  className={`${
                    isCompact ? "px-2.5 py-1.5 rounded-xl gap-2.5" : "px-3 py-2 rounded-2xl gap-3"
                  } cursor-pointer select-none flex items-center justify-between transition-colors ${
                    isActive ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleItemSelect({ type: "recent", value: term });
                  }}
                  onClick={() => handleItemSelect({ type: "recent", value: term })}
                >
                  <div className={`flex items-center ${isCompact ? "gap-2.5" : "gap-3.5"} min-w-0 flex-1`}>
                    <div className={`${isCompact ? "w-7 h-7 rounded-lg" : "w-10 h-10 rounded-xl"} bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 text-gray-500`}>
                      <span className={`material-symbols-outlined ${isCompact ? "text-[15px]" : "text-[18px]"}`}>history</span>
                    </div>
                    <span className={`font-heading font-semibold ${isCompact ? "text-[13.5px]" : "text-[14px]"} text-gray-900 truncate`}>
                      <HighlightMatch text={term} query={trimmedQuery} />
                    </span>
                  </div>

                  <button
                    type="button"
                    className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-200/50 transition-colors border-0 bg-transparent cursor-pointer"
                    title={`Remove "${term}"`}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (onRemoveRecentSearch) onRemoveRecentSearch(term);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRemoveRecentSearch) onRemoveRecentSearch(term);
                    }}
                  >
                    <span className={`material-symbols-outlined ${isCompact ? "text-[15px]" : "text-[16px]"}`}>close</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Popular Categories */}
      {matchedCategories.length > 0 && (
        <div>
          <div className={`flex items-center gap-1.5 ${isCompact ? "mb-1.5 px-1.5 text-[11px]" : "mb-2.5 px-2 text-[12px]"} text-[#466a59] font-bold uppercase tracking-wider`}>
            <span className={`material-symbols-outlined ${isCompact ? "text-[16px]" : "text-[18px]"} text-[#0f5c3e]`}>category</span>
            <span>{!trimmedQuery ? "Popular Categories" : "Categories"}</span>
          </div>

          <div className={isCompact ? "space-y-1" : "space-y-1.5"}>
            {matchedCategories.map((cat, index) => {
              const itemIndex = currentItemCounter++;
              const isActive = activeIndex === itemIndex;
              const catName =
                typeof cat === "string"
                  ? cat
                  : cat?.name || cat?.category || cat?.title || "Category";

              return (
                <div
                  key={`cat-${cat.categoryId || cat.id || catName || index}`}
                  className={`${
                    isCompact ? "px-2.5 py-1.5 rounded-xl gap-2.5" : "px-3 py-2.5 rounded-2xl gap-3"
                  } cursor-pointer select-none flex items-center justify-between transition-colors ${
                    isActive ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleItemSelect({ type: "category", value: cat });
                  }}
                  onClick={() => handleItemSelect({ type: "category", value: cat })}
                >
                  <div className={`flex items-center ${isCompact ? "gap-2.5" : "gap-3.5"} min-w-0 flex-1`}>
                    <div className={`${isCompact ? "w-8 h-8 rounded-lg" : "w-10 h-10 rounded-xl"} bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100`}>
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={catName}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className={`material-symbols-outlined ${isCompact ? "text-[17px]" : "text-[20px]"} text-[#0f5c3e]`}>
                          storefront
                        </span>
                      )}
                    </div>
                    <span className={`font-heading font-bold ${isCompact ? "text-[13.5px]" : "text-[15px]"} text-gray-900 truncate`}>
                      <HighlightMatch text={catName} query={trimmedQuery} />
                    </span>
                  </div>

                  <button
                    type="button"
                    tabIndex={-1}
                    className={`pointer-events-none ${
                      isCompact ? "px-3 py-1 text-[11px]" : "px-4 py-1.5 text-[12px]"
                    } rounded-full bg-[#f0f7f3] text-[#0f5c3e] group-hover:bg-[#0f5c3e] group-hover:text-white font-primary font-bold transition-all duration-200 border border-[#0f5c3e]/20 shadow-[0_1px_4px_rgba(15,92,62,0.12)] shrink-0`}
                  >
                    Explore
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Matching Businesses & Listings */}
      {listingHits.length > 0 && (
        <div className={isCompact ? "mt-2.5 pt-2 border-t border-gray-100" : "mt-4 pt-3 border-t border-gray-100"}>
          <div className={`flex items-center gap-1.5 ${isCompact ? "mb-1.5 px-1.5 text-[11px]" : "mb-2 px-2 text-[12px]"} text-[#466a59] font-bold uppercase tracking-wider`}>
            <span className={`material-symbols-outlined ${isCompact ? "text-[16px]" : "text-[18px]"} text-[#0f5c3e]`}>storefront</span>
            <span>Businesses &amp; Services</span>
          </div>

          <div className={isCompact ? "space-y-1" : "space-y-1.5"}>
            {listingHits.map((listing) => {
              const itemIndex = currentItemCounter++;
              const isActive = activeIndex === itemIndex;
              const listingTitle =
                listing.title || listing.name || listing.businessName || "Listing";
              const locationText = [listing.address, listing.city]
                .filter(Boolean)
                .join(", ");

              return (
                <div
                  key={`listing-${listing.objectID || listing.listingId || listing.id}`}
                  className={`${
                    isCompact ? "px-2.5 py-1.5 rounded-xl gap-2.5" : "px-3 py-2.5 rounded-2xl gap-3"
                  } cursor-pointer select-none flex items-center justify-between transition-colors ${
                    isActive ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleItemSelect({ type: "listing", value: listing });
                  }}
                  onClick={() => handleItemSelect({ type: "listing", value: listing })}
                >
                  <div className={`flex items-center ${isCompact ? "gap-2.5" : "gap-3.5"} min-w-0 flex-1`}>
                    <div className={`${isCompact ? "w-8 h-8 rounded-lg" : "w-10 h-10 rounded-xl"} bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 text-[#0f5c3e]`}>
                      <span className={`material-symbols-outlined ${isCompact ? "text-[17px]" : "text-[20px]"}`}>store</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-heading font-bold ${isCompact ? "text-[13.5px]" : "text-[14px]"} text-gray-900 m-0 truncate`}>
                        <HighlightMatch text={listingTitle} query={trimmedQuery} />
                      </h4>
                      {locationText && (
                        <p className={`font-primary ${isCompact ? "text-[11px]" : "text-[12px]"} text-gray-500 m-0 truncate`}>
                          {locationText}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    tabIndex={-1}
                    className={`pointer-events-none ${
                      isCompact ? "px-3 py-1 text-[11px]" : "px-4 py-1.5 text-[12px]"
                    } rounded-full bg-[#f0f7f3] text-[#0f5c3e] font-primary font-bold transition-all duration-200 border border-[#0f5c3e]/20 shadow-[0_1px_4px_rgba(15,92,62,0.12)] shrink-0`}
                  >
                    Explore
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Fallback search trigger */}
      {trimmedQuery && (
        <div className={isCompact ? "mt-2 pt-1.5 border-t border-gray-100" : "mt-3 pt-2 border-t border-gray-100"}>
          {(() => {
            const itemIndex = currentItemCounter++;
            const isActive = activeIndex === itemIndex;
            return (
              <div
                className={`${
                  isCompact ? "px-2.5 py-1.5 rounded-xl gap-2.5" : "px-3 py-2 rounded-2xl gap-3"
                } cursor-pointer select-none flex items-center justify-between transition-colors ${
                  isActive ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleItemSelect({ type: "query", value: trimmedQuery });
                }}
                onClick={() => handleItemSelect({ type: "query", value: trimmedQuery })}
              >
                <div className={`flex items-center ${isCompact ? "gap-2.5" : "gap-3.5"} min-w-0 flex-1`}>
                  <div className={`${isCompact ? "w-8 h-8 rounded-lg" : "w-10 h-10 rounded-xl"} bg-[#f0f7f3] text-[#0f5c3e] flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined ${isCompact ? "text-[17px]" : "text-[20px]"}`}>search</span>
                  </div>
                  <span className={`font-heading font-semibold ${isCompact ? "text-[13px]" : "text-[14px]"} text-gray-900 truncate`}>
                    Search all for &ldquo;<strong className="text-[#0f5c3e]">{trimmedQuery}</strong>&rdquo;
                  </span>
                </div>
                <span className={`material-symbols-outlined text-gray-400 ${isCompact ? "text-[16px]" : "text-[18px]"}`}>
                  arrow_forward
                </span>
              </div>
            );
          })()}
        </div>
      )}

      {/* 5. Zero matches */}
      {!hasAnyMatches && !isLoadingListings && trimmedQuery.length >= 3 && (
        <div className="py-6 px-4 text-center text-gray-500">
          <span className="material-symbols-outlined text-3xl mb-1 text-gray-400">search_off</span>
          <p className="text-sm font-medium m-0">
            No suggestions found for &ldquo;{trimmedQuery}&rdquo;.
          </p>
        </div>
      )}
      </div>
    </div>
  );
}
