import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlgoliaService } from "../services/algolia/searchService";
import useDebounce from "../hooks/useDebounce";
import "../style/SearchAutocomplete.css";

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
          <span key={index} className="autocomplete-highlight">
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
    <div ref={containerRef} className="search-autocomplete-container">
      {/* Loading indicator bar */}
      {isLoadingListings && <div className="autocomplete-loader-bar" />}

      {/* 1. Matching Recent Searches */}
      {matchedRecent.length > 0 && (
        <div className="autocomplete-section">
          <div className="autocomplete-section-title">
            <i className="fa-regular fa-clock"></i>
            <span>Recent Searches</span>
          </div>
          {matchedRecent.map((term) => {
            const itemIndex = currentItemCounter++;
            const isActive = activeIndex === itemIndex;
            return (
              <div
                key={`recent-${term}`}
                className={`autocomplete-item ${isActive ? "active" : ""}`}
                onClick={() =>
                  handleItemSelect({ type: "recent", value: term })
                }
              >
                <div className="autocomplete-item-left">
                  <div className="autocomplete-item-icon">
                    <i className="fa-regular fa-clock"></i>
                  </div>
                  <div className="autocomplete-item-info">
                    <span className="autocomplete-item-title">
                      <HighlightMatch text={term} query={trimmedQuery} />
                    </span>
                  </div>
                </div>
                <span className="autocomplete-item-badge">History</span>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Instant Categories (From local cache, 0 Algolia request cost) */}
      {matchedCategories.length > 0 && (
        <div className="autocomplete-section">
          <div className="autocomplete-section-title">
            <i className="fa-solid fa-shapes"></i>
            <span>{!trimmedQuery ? "Popular Categories" : "Categories"}</span>
          </div>
          {matchedCategories.map((cat) => {
            const itemIndex = currentItemCounter++;
            const isActive = activeIndex === itemIndex;
            return (
              <div
                key={`cat-${cat.categoryId || cat.id || cat.name}`}
                className={`autocomplete-item ${isActive ? "active" : ""}`}
                onClick={() =>
                  handleItemSelect({ type: "category", value: cat })
                }
              >
                <div className="autocomplete-item-left">
                  <div className="autocomplete-item-icon">
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} loading="lazy" />
                    ) : (
                      <i className="fa-solid fa-tag"></i>
                    )}
                  </div>
                  <div className="autocomplete-item-info">
                    <span className="autocomplete-item-title">
                      <HighlightMatch text={cat.name} query={trimmedQuery} />
                    </span>
                    {cat.description && (
                      <span className="autocomplete-item-sub">
                        {cat.description}
                      </span>
                    )}
                  </div>
                </div>
                <span className="autocomplete-item-badge">Explore</span>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Matching Listings (From Algolia Listings index with 320ms debounce) */}
      {listingHits.length > 0 && (
        <div className="autocomplete-section">
          <div className="autocomplete-section-title">
            <i className="fa-solid fa-store"></i>
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
                className={`autocomplete-item ${isActive ? "active" : ""}`}
                onClick={() =>
                  handleItemSelect({ type: "listing", value: listing })
                }
              >
                <div className="autocomplete-item-left">
                  <div className="autocomplete-item-icon">
                    <i className="fa-solid fa-briefcase"></i>
                  </div>
                  <div className="autocomplete-item-info">
                    <span className="autocomplete-item-title">
                      <HighlightMatch
                        text={listingTitle}
                        query={trimmedQuery}
                      />
                    </span>
                    {locationText && (
                      <span className="autocomplete-item-sub">
                        <i
                          className="fa-solid fa-location-dot"
                          style={{ marginRight: "4px", fontSize: "0.7rem" }}
                        ></i>
                        {locationText}
                      </span>
                    )}
                  </div>
                </div>
                {listing.category && (
                  <span className="autocomplete-item-badge">
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
        <div className="autocomplete-section">
          {(() => {
            const itemIndex = currentItemCounter++;
            const isActive = activeIndex === itemIndex;
            return (
              <div
                className={`autocomplete-item ${isActive ? "active" : ""}`}
                onClick={() =>
                  handleItemSelect({ type: "query", value: trimmedQuery })
                }
              >
                <div className="autocomplete-item-left">
                  <div className="autocomplete-item-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <div className="autocomplete-item-info">
                    <span className="autocomplete-item-title">
                      Search for &ldquo;<strong>{trimmedQuery}</strong>&rdquo;
                    </span>
                  </div>
                </div>
                <span className="autocomplete-item-badge">Press Enter</span>
              </div>
            );
          })()}
        </div>
      )}


      {/* Empty State when no results found */}
      {!hasAnyMatches && !isLoadingListings && trimmedQuery.length >= 3 && (
        <div className="autocomplete-empty">
          <i className="fa-solid fa-magnifying-glass"></i>
          <p>
            No quick suggestions found for &ldquo;{trimmedQuery}&rdquo;.<br />
            Press <strong>Enter</strong> to search all listings.
          </p>
        </div>
      )}

    </div>
  );
}
