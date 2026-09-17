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
import "../style/SearchPage.css";


export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(activeQuery);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
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

  const isLoading = listingsLoading;

  return (
    <div className="search-page">
      <SEO 
        title={activeQuery.trim() ? `Search results for "${activeQuery}" | NeedMet` : "Search Local Businesses & Services | NeedMet"}
        description={activeQuery.trim() ? `Check search results for "${activeQuery}" on NeedMet. Explore local shops, reviews, timing schedules, and contact details.` : "Search for service providers and shops near you. Read ratings, find directions, and contact local sellers."}
        canonicalUrl="https://needmet.in/search"
      />

      {/* Search Header */}
      <div className="search-header">
        <div className="search-input-row">
          <button
            type="button"
            className="search-back-btn"
            onClick={handleGoBack}
            aria-label="Go back"
            title="Go back"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          <div className="search-input-container" ref={inputContainerRef}>
            <div className="search-input-wrapper">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
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
              />
              {query && (
                <i 
                  onClick={() => {
                    setQuery("");
                    setSearchParams({}, { replace: true });
                    setIsAutocompleteOpen(false);
                  }} 
                  className="fa-solid fa-xmark search-cancel"
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
              wrapperRef={inputContainerRef}
            />
          </div>
        </div>
      </div>

      {/* Recent Searches */}
      {
        recentSearches.length > 0 &&
        !activeQuery.trim() && (
          <>
            <div className="recent-search-wrapper">
              <div className="recent-search-section">
                <div className="recent-search-container">
                  <div className="recent-search-header">
                    <div className="recent-search-title-group">
                      <span className="recent-search-tag">
                        CONTINUE EXPLORING
                      </span>
                      <h3>Recent Searches</h3>
                    </div>
                    <button
                      className="clear-btn"
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem("recentSearches");
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="recent-search-list">
                    {recentSearches.map((item) => (
                      <button
                        key={item}
                        className="recent-search-pill"
                        onClick={() => {
                          commitSearch(item);
                        }}
                      >
                        <div className="recent-pill-left">
                          <div className="recent-clock-icon">
                            <i className="fa-regular fa-clock"></i>
                          </div>

                          <span className="recent-pill-text">
                            {item}
                          </span>
                        </div>

                        <span
                          className="recent-pill-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(item);
                          }}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }

      {
        !activeQuery.trim() && (
          <TrendingSearches />
        )
      }

      {/* Loading */}
      {
        isLoading && (
          <div className="search-loading">
            <SearchPageLoader />
          </div>
        )
      }

      {/* Empty State */}
      {
        !isLoading &&
        !activeQuery.trim() && (
          <div className="search-empty-state">
            <img src={searchImg} alt="search_img" loading="lazy" />
            <h2>Search Listings & Services</h2>

            <p>
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
          <div className="search-results">
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