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
          <span key={index} className="text-[#0d7049] font-bold bg-[#2ecc71]/15 rounded px-0.5">
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
  // 320ms debounce: optimal balance between instantaneous perception and minimal Algolia request cost
  const debouncedQuery = useDebounce(trimmedQuery, 320);

  // 1. OPTIMIZATION: Filter Categories in-memory (0 Algolia requests!)
  const matchedCategories = useMemo(() => {
    if (!categories?.length) return [];
    if (!trimmedQuery) {
      // Show top categories immediately on click/focus
      return categories.slice(0, 4);
    }
    const normalized = trimmedQuery.toLowerCase();

    return categories
      .filter((cat) => {
        const nameMatch = cat.name?.toLowerCase().includes(normalized);
        const tagMatch = cat.tags?.some((tag) =>
          tag?.toLowerCase().includes(normalized)
        );
        return nameMatch || tagMatch;
      })
      .slice(0, 3);
  }, [trimmedQuery, categories]);

  // 2. Filter Recent Searches matching query, or show recent history on empty query
  const matchedRecent = useMemo(() => {
    if (!recentSearches?.length) return [];
    if (!trimmedQuery) {
      return recentSearches.slice(0, 4);
    }
    const normalized = trimmedQuery.toLowerCase();
    return recentSearches
      .filter(
        (item) =>
          item.toLowerCase().includes(normalized) &&
          item.toLowerCase() !== normalized
      )
      .slice(0, 3);
  }, [trimmedQuery, recentSearches]);

  // 3. OPTIMIZATION: Query Algolia ONLY for Listings with min 3 chars + cache
  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setListingHits([]);
      setIsLoadingListings(false);
      return;
    }

    let active = true;
    setIsLoadingListings(true);

    AlgoliaService.getSuggestions(debouncedQuery, { hitsPerPage: 4 })
      .then((hits) => {
        if (active) {
          setListingHits(hits);
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

  // Combine items for keyboard navigation index
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

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [trimmedQuery, listingHits]);

  // Handle item selection
  const handleItemSelect = (item) => {
    if (!item) return;

    if (item.type === "recent" || item.type === "query") {
      if (onSelectQuery) {
        onSelectQuery(item.value);
      } else {
        navigate(`/search?q=${encodeURIComponent(item.value)}`);
      }
    } else if (item.type === "category") {
      if (onSelectCategory) {
        onSelectCategory(item.value);
      } else {
        navigate(`/search?q=${encodeURIComponent(item.value.name || "")}`);
      }
    } else if (item.type === "listing") {
      if (onSelectListing) {
        onSelectListing(item.value);
      } else {
        const id = item.value.objectID || item.value.listingId;
        if (id) {
          navigate(`/listing/${id}`);
        }
      }
    }

    if (onClose) onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
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
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && activeIndex < flattenedItems.length) {
          e.preventDefault();
          handleItemSelect(flattenedItems[activeIndex]);
        }
      } else if (e.key === "Escape") {
        if (onClose) onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, flattenedItems, onClose]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        (!wrapperRef?.current || !wrapperRef.current.contains(e.target))
      ) {
        if (onClose) onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose, wrapperRef]);

  if (!isOpen) {
    return null;
  }

  const hasAnyMatches =
    matchedRecent.length > 0 ||
    matchedCategories.length > 0 ||
    listingHits.length > 0;

  if (!hasAnyMatches && !trimmedQuery) {
    return null;
  }

  let currentItemCounter = 0;

  return (
    <div ref={containerRef} className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl sm:rounded-[20px] border border-primary/15 shadow-[0_12px_36px_rgba(15,92,62,0.12),0_4px_12px_rgba(0,0,0,0.05)] max-h-[480px] overflow-y-auto text-left z-[1000]">
      {/* Loading indicator bar */}
      {isLoadingListings && <div className="h-0.5 w-full bg-gradient-to-r from-primary via-emerald-400 to-primary animate-pulse" />}

      {/* 1. Matching Recent Searches */}
      {matchedRecent.length > 0 && (
        <div className="py-2.5 border-b border-black/5 last:border-b-0">
          <div className="flex items-center justify-between text-[0.72rem] font-bold tracking-[0.06em] uppercase py-1 px-[18px] max-[600px]:px-3.5 pb-2 text-[#7b8e84]">
            <div className="flex items-center gap-1.5 text-primary">
              <i className="fa-regular fa-clock"></i>
              <span>Recent Searches</span>
            </div>
            {onClearAllRecentSearches && (
              <button
                type="button"
                className="text-[0.7rem] font-medium normal-case text-[#7b8e84] hover:text-red-500 hover:underline bg-transparent border-none cursor-pointer p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearAllRecentSearches();
                }}
              >
                Clear all
              </button>
            )}
          </div>
          {matchedRecent.map((term) => {
            const itemIndex = currentItemCounter++;
            const isActive = activeIndex === itemIndex;
            return (
              <div
                key={`recent-${term}`}
                className={`flex items-center justify-between py-2.5 px-[18px] max-[600px]:px-3.5 cursor-pointer select-none transition-colors ${isActive ? "bg-primary-surface" : "hover:bg-primary-surface"}`}
                onClick={() =>
                  handleItemSelect({ type: "recent", value: term })
                }
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden text-[0.9rem]">
                    <i className="fa-regular fa-clock"></i>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[0.92rem] font-semibold text-gray-900 truncate">
                      <HighlightMatch text={term} query={trimmedQuery} />
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2.5">
                  <span className="text-[0.72rem] font-semibold py-0.5 px-2 rounded-xl bg-primary/10 text-primary">History</span>
                  <button
                    type="button"
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[#7b8e84] hover:text-red-500 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer"
                    title={`Remove "${term}"`}
                    aria-label={`Remove "${term}" from recent searches`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRemoveRecentSearch) {
                        onRemoveRecentSearch(term);
                      }
                    }}
                  >
                    <i className="fa-solid fa-xmark text-[11px]"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Instant Categories (From local cache, 0 Algolia request cost) */}
      {matchedCategories.length > 0 && (
        <div className="py-2.5 border-b border-black/5 last:border-b-0">
          <div className="flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.06em] uppercase py-1 px-[18px] max-[600px]:px-3.5 pb-2 text-[#7b8e84]">
            <i className="fa-solid fa-shapes text-primary"></i>
            <span>{!trimmedQuery ? "Popular Categories" : "Categories"}</span>
          </div>
          {matchedCategories.map((cat) => {
            const itemIndex = currentItemCounter++;
            const isActive = activeIndex === itemIndex;
            return (
              <div
                key={`cat-${cat.categoryId || cat.id || cat.name}`}
                className={`flex items-center justify-between py-2.5 px-[18px] max-[600px]:px-3.5 cursor-pointer select-none transition-colors ${isActive ? "bg-primary-surface" : "hover:bg-primary-surface"}`}
                onClick={() =>
                  handleItemSelect({ type: "category", value: cat })
                }
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden text-[0.9rem]">
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <i className="fa-solid fa-tag"></i>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[0.92rem] font-semibold text-gray-900 truncate">
                      <HighlightMatch text={cat.name} query={trimmedQuery} />
                    </span>
                    {cat.description && (
                      <span className="text-[0.78rem] text-text-secondary truncate">
                        {cat.description}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[0.72rem] font-semibold py-0.5 px-2 rounded-xl bg-primary/10 text-primary shrink-0 ml-2.5">Explore</span>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Matching Listings (From Algolia Listings index with 320ms debounce) */}
      {listingHits.length > 0 && (
        <div className="py-2.5 border-b border-black/5 last:border-b-0">
          <div className="flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.06em] uppercase py-1 px-[18px] max-[600px]:px-3.5 pb-2 text-[#7b8e84]">
            <i className="fa-solid fa-store text-primary"></i>
            <span>Businesses & Services</span>
          </div>
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
                key={`listing-${listing.objectID}`}
                className={`flex items-center justify-between py-2.5 px-[18px] max-[600px]:px-3.5 cursor-pointer select-none transition-colors ${isActive ? "bg-primary-surface" : "hover:bg-primary-surface"}`}
                onClick={() =>
                  handleItemSelect({ type: "listing", value: listing })
                }
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden text-[0.9rem]">
                    <i className="fa-solid fa-briefcase"></i>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[0.92rem] font-semibold text-gray-900 truncate">
                      <HighlightMatch
                        text={listingTitle}
                        query={trimmedQuery}
                      />
                    </span>
                    {locationText && (
                      <span className="text-[0.78rem] text-text-secondary truncate mt-px">
                        <i
                          className="fa-solid fa-location-dot mr-1 text-[0.7rem]"
                        ></i>
                        {locationText}
                      </span>
                    )}
                  </div>
                </div>
                {listing.category && (
                  <span className="text-[0.72rem] font-semibold py-0.5 px-2 rounded-xl bg-primary/10 text-primary shrink-0 ml-2.5">
                    {listing.category}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Default Search Option */}
      {trimmedQuery && (
        <div className="py-2.5 border-b border-black/5 last:border-b-0">
          {(() => {
            const itemIndex = currentItemCounter++;
            const isActive = activeIndex === itemIndex;
            return (
              <div
                className={`flex items-center justify-between py-2.5 px-[18px] max-[600px]:px-3.5 cursor-pointer select-none transition-colors ${isActive ? "bg-primary-surface" : "hover:bg-primary-surface"}`}
                onClick={() =>
                  handleItemSelect({ type: "query", value: trimmedQuery })
                }
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden text-[0.9rem]">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[0.92rem] font-semibold text-gray-900 truncate">
                      Search for &ldquo;<strong>{trimmedQuery}</strong>&rdquo;
                    </span>
                  </div>
                </div>
                <span className="text-[0.72rem] font-semibold py-0.5 px-2 rounded-xl bg-primary/10 text-primary shrink-0 ml-2.5">Press Enter</span>
              </div>
            );
          })()}
        </div>
      )}

      {/* Empty State when no results found */}
      {!hasAnyMatches && !isLoadingListings && trimmedQuery.length >= 3 && (
        <div className="py-6 px-[18px] max-[600px]:px-3.5 text-center text-[0.88rem] text-[#7a8e84]">
          <i className="fa-solid fa-magnifying-glass block text-2xl mb-2 text-[#b0c2b9]"></i>
          <p>
            No quick suggestions found for &ldquo;{trimmedQuery}&rdquo;.<br />
            Press <strong>Enter</strong> to search all listings.
          </p>
        </div>
      )}

    </div>
  );
}
