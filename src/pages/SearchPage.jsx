import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getListingByIds } from "../services/firebase/firestore/listingService";
import { AlgoliaService } from "../services/algolia/searchService";
import { CategorySection, ListingSection, SearchPageLoader, TrendingSearches } from "../components";
import searchImg from "../assets/search.png";
import useDebounce from "../hooks/useDebounce";
import "../style/SearchPage.css";


export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const [recentSearches, setRecentSearches] = useState([]);

  const debouncedQuery = useDebounce(query, 700);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setSearchParams(
        { q: debouncedQuery },
        { replace: true }
      );
    } else {
      setSearchParams(
        {},
        { replace: true }
      );
    }
  }, [debouncedQuery, setSearchParams]);

  // Load Recent Searches
  useEffect(() => {
    const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(searches);
  }, []);

  // Listings Query
  const {
    data: listingResults = [],
    isLoading: listingsLoading,
  } = useQuery({
    queryKey: ["searchListings", debouncedQuery],
    queryFn: async () => {

      // Step 1: Search Algolia
      const listingHits = await AlgoliaService.searchListings(debouncedQuery);

      // Extract IDs
      const ids = listingHits
        .map((item) => item.objectID?.toString())
        .filter(Boolean);

      // Step 3: Fetch Full Firebase Listings
      const fetchedListings = await getListingByIds(ids);

      // Step 4: Maintain Algolia Order
      const listingMap = {};

      fetchedListings.forEach((listing) => {
        listingMap[listing.listingId] = listing;
      });

      const orderedListings = ids
        .map((id) => listingMap[id])
        .filter(Boolean);

      return orderedListings;
    },
    enabled: !!debouncedQuery.trim(),
  });

  // Categories Query
  const {
    data: categoryResults = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["searchCategories", debouncedQuery],
    queryFn: () => AlgoliaService.searchCategories(debouncedQuery),
    enabled: !!debouncedQuery.trim(),
  });

  // Save Recent Searches
  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    let updated = [...recentSearches];

    if (!updated.includes(debouncedQuery)) {
      updated.unshift(debouncedQuery);

      if (updated.length > 10) {
        updated.pop();
      }

      setRecentSearches(updated);

      localStorage.setItem(
        "recentSearches",
        JSON.stringify(updated)
      );
    }
  }, [debouncedQuery]);

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

  const isDebouncing =
    query.trim() !== debouncedQuery.trim();

  const isLoading = isDebouncing || listingsLoading || categoriesLoading;

  return (
    <div className="search-page">

      {/* Search Header */}
      <div className="search-header">
        <div className="search-input-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="What service do you need?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <i 
            onClick={() => {
              setQuery("");
              setSearchParams({});
            }} 
            className="fa-solid fa-xmark search-cancel"
          ></i>
        </div>
      </div>

      {/* Recent Searches */}
      {
        recentSearches.length > 0 &&
        query === "" && (
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
                        className="recent-search-item"
                        onClick={() => {
                          setQuery(item);
                          setSearchParams({q: item});
                        }}
                      >
                        <span>{item}</span>
                        <span
                          className="remove-icon"
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
        query === "" && (
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
        query === "" && (
          <div className="search-empty-state">
            <img src={searchImg} alt="search_img" />
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
        query !== "" && (
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
          </div>
        )
      }
    </div>
  );
}