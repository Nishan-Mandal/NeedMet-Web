import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchAutocomplete } from "../../../components";
import { useCategories } from "../../../hooks/useAllCategories";
import { generateSlug } from "../../../utils/slugify";
import companyLogo from "../../../assets/companyLogo.png";
export default function SearchHeader() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(activeQuery);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(!activeQuery.trim());
  const inputContainerRef = useRef(null);

  // Sync query when activeQuery in URL changes
  useEffect(() => {
    setQuery(activeQuery);
  }, [activeQuery]);

  // Categories data for autocomplete
  const { data: allCategories = [] } = useCategories();

  // Recent Searches
  const RECENT_SEARCHES_KEY = "needmet_recent_searches";
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY) || localStorage.getItem("recentSearches");
      const searches = stored ? JSON.parse(stored) : [];
      setRecentSearches(searches);
    } catch {
      setRecentSearches([]);
    }
  }, []);

  const saveToRecentSearches = (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== clean.toLowerCase()
      );
      const updated = [clean, ...filtered].slice(0, 10);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  useEffect(() => {
    if (activeQuery.trim()) {
      saveToRecentSearches(activeQuery);
    }
  }, [activeQuery]);

  const commitSearch = (searchTerm) => {
    const raw =
      typeof searchTerm === "string"
        ? searchTerm
        : searchTerm?.name || searchTerm?.category || searchTerm?.title || query;
    const term = (raw || "").trim();
    setIsAutocompleteOpen(false);

    if (!term) {
      setSearchParams({}, { replace: true });
      navigate("/search");
      return;
    }

    setQuery(term);
    saveToRecentSearches(term);
    setSearchParams({ q: term });
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleGoBack = () => {
    if (isAutocompleteOpen && activeQuery.trim()) {
      setIsAutocompleteOpen(false);
      return;
    }
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <section className="sticky top-0 z-40 w-full max-w-full bg-white sm:bg-transparent border-b border-gray-100 sm:border-0 transition-all">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2 sm:py-3.5 flex flex-col gap-2 sm:gap-3">
        {/* Main Search Row */}
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          {/* Mobile Back Button (Flipkart/Swiggy style) */}
          <button
            type="button"
            onClick={handleGoBack}
            className="sm:hidden w-9 h-9 rounded-full text-gray-700 hover:text-[#0f5c3e] hover:bg-[#f0f7f3] active:scale-90 flex items-center justify-center shrink-0 border-0 bg-transparent cursor-pointer transition-all"
            title="Go back"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>

          {/* Desktop 3D Back Button with Green Shadow */}
          <button
            type="button"
            onClick={handleGoBack}
            className="hidden sm:flex w-12 h-12 rounded-full bg-white text-[#0f5c3e] items-center justify-center shrink-0 transition-all duration-200 border border-[#0f5c3e]/20 shadow-[0_6px_16px_-2px_rgba(15,92,62,0.28),0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:shadow-[0_8px_24px_-1px_rgba(15,92,62,0.40)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_6px_rgba(15,92,62,0.25)] cursor-pointer"
            title="Go back"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-[22px] font-semibold">arrow_back</span>
          </button>

          {/* Live Search Bar */}
          <div className="flex-1 relative min-w-0" ref={inputContainerRef}>
            <div className="h-10 sm:h-12 flex items-center rounded-full pl-3 pr-2 sm:px-4 bg-[#f4f8f5] sm:bg-white border border-[#0f5c3e]/20 sm:border-2 sm:border-[#0f5c3e]/30 hover:border-[#0f5c3e] focus-within:border-[#0f5c3e] focus-within:bg-white shadow-xs sm:shadow-[0_8px_24px_-3px_rgba(15,92,62,0.22),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_12px_32px_-2px_rgba(15,92,62,0.32)] focus-within:shadow-[0_12px_36px_-2px_rgba(15,92,62,0.36),0_0_0_3px_rgba(15,92,62,0.12)] hover:-translate-y-0.5 focus-within:-translate-y-0.5 transition-all duration-200 gap-2 sm:gap-2.5">
              <span className="material-symbols-outlined text-[#0f5c3e] text-[20px] sm:text-[22px] shrink-0">
                search
              </span>
              <input
                id="searchInput"
                type="text"
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
                placeholder="What service do you need?"
                className="h-full bg-transparent text-gray-900 font-primary text-[13.5px] sm:text-[15px] w-full focus:outline-none placeholder:text-gray-400 font-medium"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setIsAutocompleteOpen(false);
                    commitSearch("");
                  }}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-center shrink-0"
                  title="Clear search"
                >
                  <span className="material-symbols-outlined text-[17px] sm:text-[18px]">cancel</span>
                </button>
              )}
            </div>

            {/* Autocomplete Popup (Full-screen on mobile, floating 3D on desktop) */}
            <SearchAutocomplete
              query={query}
              categories={allCategories}
              recentSearches={recentSearches}
              isOpen={isAutocompleteOpen}
              fullScreenOnMobile={true}
              onClose={() => setIsAutocompleteOpen(false)}
              onSelectQuery={(term) => commitSearch(term)}
              onSelectCategory={(catName, catObj) => {
                const term =
                  typeof catName === "string" && catName.trim()
                    ? catName.trim()
                    : (catObj?.name || catObj?.category || catObj?.title || "").trim();
                commitSearch(term);
              }}
              onSelectListing={(listing) => {
                setIsAutocompleteOpen(false);
                const listingId = listing.objectID || listing.listingId || listing.id;
                const listingTitle = listing.title || listing.name || listing.businessName || "";
                if (listingTitle) {
                  saveToRecentSearches(listingTitle);
                }
                if (listingId) {
                  navigate(
                    `/listing/${listingId}/${generateSlug(listingTitle || "service")}`,
                    { state: { listing } }
                  );
                } else if (listingTitle) {
                  commitSearch(listingTitle);
                }
              }}
              onRemoveRecentSearch={(term) => {
                setRecentSearches((prev) => {
                  const upd = prev.filter((t) => t !== term);
                  try {
                    localStorage.setItem("recentSearches", JSON.stringify(upd));
                  } catch {}
                  return upd;
                });
              }}
              onClearAllRecentSearches={() => {
                setRecentSearches([]);
                try {
                  localStorage.removeItem("recentSearches");
                } catch {}
              }}
            wrapperRef={inputContainerRef}
          />
        </div>
      </div>
    </div>

    </section>
  );
}
