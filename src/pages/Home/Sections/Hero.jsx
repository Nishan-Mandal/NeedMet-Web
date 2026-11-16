import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchAutocomplete from "../../../components/SearchAutocomplete";
import heroD from "../../../assets/HeroD.jpg";
import heroM from "../../../assets/HeroM.jpg";
import heroT from "../../../assets/HeroT.jpg";

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
  { value: "2k+", label: "Verified Businesses", isHighlight: true },
  { value: "150+", label: "Service Categories", hasDivider: true },
  { value: "4.8", label: "Customer Satisfaction", hasStar: true, hasDivider: true },
  { value: "100%", label: "Free to Search" },
];

export default function Hero({ data }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const searchWrapperRef = useRef(null);

  // Responsive background image according to screen size:
  // Mobile (<640px) -> heroM, Tablet (640px-1023px) -> heroT, Desktop (>=1024px) -> heroD
  const getResponsiveHeroBg = () => {
    if (typeof window === "undefined") return heroD;
    const width = window.innerWidth;
    if (width >= 1024) return heroD;
    if (width >= 640) return heroT;
    return heroM;
  };

  const [heroBg, setHeroBg] = useState(getResponsiveHeroBg);

  useEffect(() => {
    const handleResize = () => {
      setHeroBg(getResponsiveHeroBg());
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      const updated = [
        cleanTerm,
        ...prev.filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase()),
      ].slice(0, 5);
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
    "Search businesses, services or products",
    "Search restaurants, cafes & dining...",
    "Search salons, parlours & spas...",
    "Search car & bike mechanics...",
    "Search doctors, pharmacies & health...",
    "Search home cleaning & electricians...",
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
        }, 1800);
      }
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % placeholders.length;
      }
    };

    const interval = setInterval(type, 80);
    return () => clearInterval(interval);
  }, []);

  const categories = data?.listings || data?.categories || [];

  return (
    <section
      id="hero-section"
      className="relative z-20 w-full overflow-hidden font-primary flex flex-col justify-center items-center py-10 sm:py-14 md:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 min-h-[580px] sm:min-h-[560px] md:min-h-[600px] lg:min-h-[680px]"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundPosition: "center top",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* CSS Media Query for instant responsive background resolution */}
      <style>{`
        @media (max-width: 639px) {
          #hero-section {
            background-image: url('${heroM}') !important;
            min-height: 580px;
          }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          #hero-section {
            background-image: url('${heroT}') !important;
          }
        }
        @media (min-width: 1024px) {
          #hero-section {
            background-image: url('${heroD}') !important;
          }
        }
      `}</style>
      {/* Sky Dotted Arc & Floating Service Category Badges (as in mockup) */}
      <div className="absolute inset-0 pointer-events-none select-none hidden lg:block overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 700"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left arc connecting woman -> store -> wrench -> heading */}
          <path
            d="M 180 340 L 200 280 Q 250 200 340 180 Q 420 150 510 190"
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="2.5"
            strokeDasharray="4 8"
            strokeLinecap="round"
          />
          {/* Right arc connecting shop -> users -> cart -> heading */}
          <path
            d="M 930 190 Q 1020 150 1100 180 Q 1190 200 1240 280 L 1260 340"
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="2.5"
            strokeDasharray="4 8"
            strokeLinecap="round"
          />
        </svg>

        {/* Badge 1: Store (Left low) */}
        <div className="absolute left-[13%] top-[40%] xl:left-[14%] xl:top-[38%] -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 xl:w-11 xl:h-11 rounded-full bg-white shadow-[0_6px_18px_rgba(0,0,0,0.12)] border border-white flex items-center justify-center text-[#1b5e3a] transition-transform duration-300 hover:scale-110">
            <span className="material-symbols-outlined text-[20px] xl:text-[22px]">storefront</span>
          </div>
        </div>

        {/* Badge 2: Wrench (Left high) */}
        <div className="absolute left-[24%] top-[26%] xl:left-[24%] xl:top-[25%] -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 xl:w-11 xl:h-11 rounded-full bg-white shadow-[0_6px_18px_rgba(0,0,0,0.12)] border border-white flex items-center justify-center text-[#1b5e3a] transition-transform duration-300 hover:scale-110">
            <span className="material-symbols-outlined text-[20px] xl:text-[22px]">build</span>
          </div>
        </div>

        {/* Badge 3: Shopping Cart (Right high) */}
        <div className="absolute right-[24%] top-[26%] xl:right-[24%] xl:top-[25%] translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 xl:w-11 xl:h-11 rounded-full bg-white shadow-[0_6px_18px_rgba(0,0,0,0.12)] border border-white flex items-center justify-center text-[#1b5e3a] transition-transform duration-300 hover:scale-110">
            <span className="material-symbols-outlined text-[20px] xl:text-[22px]">shopping_cart</span>
          </div>
        </div>

        {/* Badge 4: Users / Community (Right low) */}
        <div className="absolute right-[14%] top-[38%] xl:right-[15%] xl:top-[36%] translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 xl:w-11 xl:h-11 rounded-full bg-white shadow-[0_6px_18px_rgba(0,0,0,0.12)] border border-white flex items-center justify-center text-[#1b5e3a] transition-transform duration-300 hover:scale-110">
            <span className="material-symbols-outlined text-[20px] xl:text-[22px]">groups</span>
          </div>
        </div>
      </div>

      {/* Main Center Content Container - Vertically Centered */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center my-auto w-full">
        {/* Tagline Pill Badge: Verified Local Discovery */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-white/80 shadow-xs mb-2.5 sm:mb-4">
          <span className="w-4 h-4 rounded-full bg-[#16a34a] flex items-center justify-center text-white text-[10px] font-bold">
            ✓
          </span>
          <span className="font-primary text-[11px] sm:text-[13px] text-[#1b4332] font-bold tracking-tight">
            Verified Local Discovery
          </span>
        </div>

        {/* Hero Headline with curved green underline */}
        <h1 className="font-heading font-extrabold text-[1.85rem] xs:text-[2.1rem] sm:text-[2.8rem] md:text-[3.4rem] lg:text-[3.9rem] text-[#14261c] tracking-tight leading-[1.18] sm:leading-[1.12] max-w-3xl m-0 px-2 sm:px-0">
          Find what you need,{" "}
          <span className="relative inline-block whitespace-nowrap">
            right around you.
            <svg
              className="absolute -bottom-1 sm:-bottom-2.5 left-0 w-full h-2.5 sm:h-3.5 text-[#168a48] pointer-events-none"
              viewBox="0 0 260 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 9.5C65 2.5 195 2.5 258 9.5"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Search Component Container with Functional Autocomplete */}
        <div ref={searchWrapperRef} className="w-full max-w-2xl sm:max-w-[620px] mt-4 sm:mt-7 relative z-30 px-1 sm:px-0">
          <div className="relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
              className="bg-white rounded-full shadow-[0_8px_26px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03)] p-1 sm:p-2 flex items-center gap-1 sm:gap-2 border border-slate-100/90 focus-within:ring-3 focus-within:ring-emerald-500/20 transition-all duration-300 text-left relative z-20"
            >
              {/* Search Input Side */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pl-3 sm:pl-4 py-1">
                <span className="material-symbols-outlined text-[#64748b] text-[20px] sm:text-[24px] shrink-0">
                  search
                </span>
                <input
                  id="heroSearchInput"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder={animatedPlaceholder || "Search businesses, services or products"}
                  className="w-full bg-transparent text-[#111827] font-primary text-[13px] sm:text-[14.5px] focus:outline-none placeholder:text-[#94a3b8] truncate"
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
                className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#0f4a2f] hover:bg-[#093521] active:scale-95 text-white font-semibold text-xs sm:text-[13px] tracking-wide transition-all shadow-sm shrink-0 cursor-pointer"
              >
                <span>Search</span>
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">arrow_forward</span>
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
                  const slug = (listingTitle || "service")
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
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

          {/* Quick Popular Search Tags - Wrapped & centered on all screens */}
          <div className="mt-3 sm:mt-4 w-full max-w-xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-1 px-1">
              <span className="text-[11px] sm:text-[12.5px] font-semibold text-[#1e3a2b] shrink-0 mr-0.5">
                Popular:
              </span>
              {POPULAR_SEARCHES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSearchSubmit(item)}
                  className="px-2.5 sm:px-3.5 py-1 rounded-full bg-white/90 hover:bg-white active:scale-95 text-[#1e293b] hover:text-[#0f4a2f] border border-slate-200/80 shadow-xs hover:shadow-sm transition-all text-[11px] sm:text-[12px] font-medium cursor-pointer backdrop-blur-xs whitespace-nowrap"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Stats Counter Bar */}
        <div className="mt-6 sm:mt-10 md:mt-12 w-full max-w-3xl mx-auto px-2 sm:px-0">
          <div className="w-full bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-1.5 xs:p-2 sm:p-3 md:p-3.5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)] grid grid-cols-4 gap-1 sm:gap-2 md:gap-3 items-stretch">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col items-center justify-center text-center py-2 sm:py-3 px-1 xs:px-1.5 sm:px-3 md:px-4 transition-colors ${
                  stat.isHighlight
                    ? "bg-emerald-50/70 border border-emerald-100/90 rounded-lg sm:rounded-xl md:rounded-2xl"
                    : "rounded-lg sm:rounded-xl hover:bg-slate-50/80"
                }`}
              >
                <div className="flex items-center justify-center gap-0.5 sm:gap-1 leading-none">
                  <span className="font-heading text-[15px] xs:text-[17px] sm:text-2xl md:text-3xl font-extrabold text-[#0f4a2f] tracking-tight">
                    {stat.value}
                  </span>
                  {stat.hasStar && (
                    <svg
                      className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400 fill-amber-400 shrink-0 inline-block -mt-0.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  )}
                </div>
                <span className="font-primary text-[9px] xs:text-[10px] sm:text-[11.5px] md:text-[13px] text-slate-600 font-medium mt-1 sm:mt-1.5 leading-tight">
                  {stat.label}
                </span>

                {/* Subtle vertical divider between items */}
                {stat.hasDivider && (
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-6 sm:h-8 md:h-10 w-[1px] bg-slate-200/90 rounded-full pointer-events-none"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
