import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchAutocomplete from "../../../components/SearchAutocomplete";

const POPULAR_SEARCHES = [
  "Restaurants",
  "Salons",
  "Mechanics",
  "PG & Hostels",
  "Pharmacies",
  "Home Cleaning",
];

const RECENT_SEARCHES_KEY = "needmet_recent_searches";

const STATS = [
  { value: "500+", label: "Verified Businesses" },
  { value: "50+", label: "Service Categories" },
  { value: "4.8", label: "Customer Satisfaction", hasStar: true },
  { value: "100%", label: "Free to Search" },
];

export default function Hero({ data }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const searchWrapperRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const saveRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const cleanTerm = term.trim();
    setRecentSearches((prev) => {
      const updated = [cleanTerm, ...prev.filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const handleRemoveRecentSearch = (termToRemove) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== termToRemove);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const handleClearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const handleSearchSubmit = (searchTerm) => {
    const finalQuery = typeof searchTerm === "string" ? searchTerm.trim() : query.trim();
    setIsFocused(false);
    if (finalQuery) {
      saveRecentSearch(finalQuery);
      navigate(`/search?q=${encodeURIComponent(finalQuery)}`);
    } else {
      navigate("/search");
    }
  };

  // Typewriter placeholders for empty search bar
  const placeholders = [
    "Search businesses, services, or categories...",
    "Search salons, parlors & spas in Haldia...",
    "Search restaurants, cafes & dining...",
    "Search car & bike mechanics...",
    "Search electricians, plumbers & cleaning...",
  ];

  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentWord = placeholders[wordIndex];
      if (isDeleting) {
        setAnimatedPlaceholder(currentWord.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setAnimatedPlaceholder(currentWord.substring(0, charIndex + 1));
        charIndex++;
      }
      if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => {
          isDeleting = true;
        }, 1600);
      }
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % placeholders.length;
      }
    };

    const interval = setInterval(type, 85);
    return () => clearInterval(interval);
  }, []);

  const categories = data?.listings || data?.categories || [];

  return (
    <section
      id="hero-section"
      className="bg-primary relative z-20 w-full pt-[76px] pb-16 sm:pt-[88px] sm:pb-20 md:pt-[125px] md:pb-24 px-[18px] sm:px-8 lg:px-[70px] overflow-visible font-primary"
    >
      {/* Ambient Lighting & Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-72 h-72 bg-emerald-300/10 rounded-full blur-2xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-accent-emerald/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Tagline Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-xs">
          <span className="w-2 h-2 rounded-full bg-accent-emerald shadow-[0_0_8px_#4ade80] animate-pulse" />
          <span className="font-primary text-[12px] sm:text-[13px] text-emerald-100 font-semibold tracking-wide">
            Verified Local Discovery
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="mt-5 font-heading text-[2.2rem] sm:text-[3rem] md:text-[3.6rem] lg:text-[4rem] text-white tracking-tight font-extrabold leading-[1.12] max-w-4xl m-0">
          Find what you need,{" "}
          <span className="text-secondary-container relative inline-block">
            right around you
            <svg
              className="absolute -bottom-2 left-0 w-full text-secondary-container/80"
              fill="none"
              height="8"
              viewBox="0 0 200 8"
            >
              <path
                d="M1 5.5C50 2 150 2 199 5.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
          </span>
          .
        </h1>

        {/* Supporting Subtitle */}
        <p className="mt-4 font-primary text-[15px] sm:text-[17px] text-emerald-50/85 max-w-2xl leading-relaxed">
          Discover trusted local businesses, services, and shops near you. Fast, verified, and community-recommended.
        </p>

        {/* Search Component Container with Functional Autocomplete */}
        <div ref={searchWrapperRef} className="w-full max-w-3xl mt-8 sm:mt-10 relative z-30">
          {/* Floating Input Container with directly attached Autocomplete */}
          <div className="relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
              className="bg-white rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.25),0_4px_16px_rgba(0,0,0,0.1)] p-2 sm:p-2.5 flex items-center gap-2 border border-white/30 focus-within:ring-4 focus-within:ring-white/20 transition-all duration-300 text-left relative z-20"
            >
              {/* Search Input Side */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-1 w-full pl-3 sm:pl-4 py-1">
                <span className="material-symbols-outlined text-primary text-[24px] sm:text-[26px] shrink-0">
                  search
                </span>
                <input
                  id="heroSearchInput"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder={animatedPlaceholder || "Search businesses, services, or categories..."}
                  className="w-full bg-transparent text-[#111827] font-primary text-[14px] sm:text-[15px] focus:outline-none placeholder:text-gray-400"
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors shrink-0 border-0 bg-transparent cursor-pointer"
                    title="Clear input"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-primary hover:bg-primary-light active:scale-95 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md shrink-0 cursor-pointer"
              >
                <span>Search</span>
                <span className="material-symbols-outlined text-[18px] hidden sm:inline-block">arrow_forward</span>
              </button>
            </form>

            {/* Real Search Autocomplete Dropdown anchored directly to input */}
            <SearchAutocomplete
              query={query}
              categories={categories}
              recentSearches={recentSearches}
              isOpen={isFocused}
              isCompact={true}
              onClose={() => setIsFocused(false)}
              onSelectQuery={(selectedQuery) => {
                setQuery(selectedQuery);
                handleSearchSubmit(selectedQuery);
              }}
              onSelectCategory={(catName, catObj) => {
                setIsFocused(false);
                const name =
                  typeof catName === "string" && catName.trim()
                    ? catName.trim()
                    : (catObj?.name || catObj?.category || catObj?.title || "").trim();
                if (name) {
                  saveRecentSearch(name);
                  navigate(`/search?q=${encodeURIComponent(name)}`);
                }
              }}
              onSelectListing={(listing) => {
                setIsFocused(false);
                const listingId = listing.objectID || listing.listingId || listing.id;
                const listingTitle = listing.title || listing.name || listing.businessName || "";
                if (listingTitle) {
                  saveRecentSearch(listingTitle);
                }
                if (listingId) {
                  const slug = (listingTitle || "service").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                  navigate(`/listing/${listingId}/${slug}`, {
                    state: { listing },
                  });
                } else if (listingTitle) {
                  navigate(`/search?q=${encodeURIComponent(listingTitle)}`);
                }
              }}
              onRemoveRecentSearch={handleRemoveRecentSearch}
              onClearAllRecentSearches={handleClearAllRecentSearches}
              wrapperRef={searchWrapperRef}
            />
          </div>

          {/* Quick Popular Search Tags */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-[12px] font-medium text-emerald-100/70 mr-0.5">Popular:</span>
            {POPULAR_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSearchSubmit(item)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 hover:text-white border border-white/15 transition-all text-[12px] font-medium cursor-pointer backdrop-blur-xs"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Subtle Stats Bar */}
        <div className="mt-10 sm:mt-12 w-full max-w-3xl bg-white/[0.08] backdrop-blur-md rounded-2xl shadow-lg p-3 sm:p-4 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 border border-white/15 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-2 sm:p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-center gap-1">
                <span className="font-heading text-2xl sm:text-3xl text-white font-extrabold tracking-tight">
                  {stat.value}
                </span>
                {stat.hasStar && (
                  <span
                    className="material-symbols-outlined text-amber-400 text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                )}
              </div>
              <span className="font-primary text-[12px] text-emerald-100/80 font-medium mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div> 
      </div>
    </section>
  );
}