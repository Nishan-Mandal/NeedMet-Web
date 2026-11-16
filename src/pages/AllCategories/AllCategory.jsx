import React, { useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Store,
  Layers,
  Utensils,
  HeartPulse,
  Wrench,
  ShoppingBag,
  Car,
  GraduationCap,
  Briefcase,
  Shapes,
} from "lucide-react";
import { AllCategoryLoader, SystemState, BusinessCTA, SEO, CategoryCard, SearchAutocomplete } from "../../components";
import ErrorImg from "../../assets/error.png";
import NoDataImg from "../../assets/no_data.png";
import { useCategories } from "../../hooks/useAllCategories";
import { generateSlug } from "../../utils/slugify.js";

const RECENT_SEARCHES_KEY = "recentSearches";

const loadRecentSearches = () => {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Helper to assign a relevant section icon
function getSectionIcon(section = "") {
  const s = section.toLowerCase();
  if (s.includes("food") || s.includes("dining") || s.includes("restaurant") || s.includes("cafe")) return "fa-solid fa-utensils";
  if (s.includes("health") || s.includes("medical") || s.includes("wellness") || s.includes("doctor")) return "fa-solid fa-heart-pulse";
  if (s.includes("home") || s.includes("repair") || s.includes("service")) return "fa-solid fa-wrench";
  if (s.includes("daily") || s.includes("essential") || s.includes("grocery")) return "fa-solid fa-basket-shopping";
  if (s.includes("retail") || s.includes("shopping") || s.includes("store")) return "fa-solid fa-bag-shopping";
  if (s.includes("auto") || s.includes("car") || s.includes("vehicle")) return "fa-solid fa-car";
  if (s.includes("education") || s.includes("coaching") || s.includes("school")) return "fa-solid fa-graduation-cap";
  if (s.includes("beauty") || s.includes("salon") || s.includes("spa")) return "fa-solid fa-spa";
  if (s.includes("professional") || s.includes("business") || s.includes("legal")) return "fa-solid fa-briefcase";
  return "fa-solid fa-shapes";
}

export default function AllCategory() {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: loading, error } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const searchInputRef = useRef(null);
  const inputContainerRef = useRef(null);

  const saveRecentSearch = (term) => {
    if (!term || typeof term !== "string") return;
    const cleanTerm = term.trim();
    if (!cleanTerm) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase());
      const updated = [cleanTerm, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRemoveRecentSearch = (termToRemove) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== termToRemove);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  };

  const handleSearchSubmit = (searchTerm) => {
    const finalQuery = typeof searchTerm === "string" ? searchTerm.trim() : searchQuery.trim();
    setIsAutocompleteOpen(false);
    if (finalQuery) {
      saveRecentSearch(finalQuery);
      navigate(`/search?q=${encodeURIComponent(finalQuery)}`);
    } else {
      navigate("/search");
    }
  };

  // Group categories by section
  const groupedCategories = useMemo(() => {
    return categories.reduce((acc, cat) => {
      const sec = cat.section || "General";
      if (!acc[sec]) {
        acc[sec] = [];
      }
      acc[sec].push(cat);
      return acc;
    }, {});
  }, [categories]);

  const sectionNames = useMemo(() => Object.keys(groupedCategories), [groupedCategories]);

  // Filtered categories based on search input
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return categories.filter((cat) => {
      const name = (cat.name || cat.category || "").toLowerCase();
      const section = (cat.section || "").toLowerCase();
      return name.includes(query) || section.includes(query);
    });
  }, [categories, searchQuery]);

  if (loading) return <AllCategoryLoader />;

  if (error) {
    return (
      <SystemState
        imageSrc={ErrorImg}
        title="OOPS! Something Went"
        highlight="Wrong"
        message="We couldn't load the categories right now. Please check your connection and try again."
        actionType="refresh"
        actionLabel="Try Again"
      />
    );
  }

  if (categories.length === 0) {
    return (
      <SystemState
        imageSrc={NoDataImg}
        title="No Categories"
        highlight="Found"
        message="Currently, there are no categories available. Be the first to contribute by adding a new store or service!"
        actionType="redirect"
        actionLabel="+ Add Business"
        actionTo="/contribute/listing"
      />
    );
  }

  const isSearching = Boolean(searchQuery.trim());

  return (
    <div className="min-h-screen bg-[#fafdfb] font-primary text-slate-900">
      <SEO
        title="Browse All Business Categories | NeedMet"
        description="Explore all business and service categories on NeedMet. Find salons, repair services, retail stores, healthcare clinics, restaurants, and more."
        canonicalUrl="https://needmet.in/all_categories"
      />

      {/* ── 1. Search Bar Styled Identically to Search Page ── */}
      <section className="pt-5 sm:pt-7 pb-4 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          {/* Mobile Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="sm:hidden w-9 h-9 rounded-full text-gray-700 hover:text-[#0f5c3e] hover:bg-[#f0f7f3] active:scale-90 flex items-center justify-center shrink-0 border-0 bg-transparent cursor-pointer transition-all"
            title="Go back"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>

          {/* Desktop 3D Back Button with Green Shadow */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="hidden sm:flex w-12 h-12 rounded-full bg-white text-[#0f5c3e] items-center justify-center shrink-0 transition-all duration-200 border border-[#0f5c3e]/20 shadow-[0_6px_16px_-2px_rgba(15,92,62,0.28),0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:shadow-[0_8px_24px_-1px_rgba(15,92,62,0.40)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_6px_rgba(15,92,62,0.25)] cursor-pointer"
            title="Go back"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-[22px] font-semibold">arrow_back</span>
          </button>

          {/* Live Search Bar Input Container */}
          <div className="flex-1 relative min-w-0" ref={inputContainerRef}>
            <div className="h-10 sm:h-12 flex items-center rounded-full pl-3 pr-2 sm:px-4 bg-[#f4f8f5] sm:bg-white border border-[#0f5c3e]/20 sm:border-2 sm:border-[#0f5c3e]/30 hover:border-[#0f5c3e] focus-within:border-[#0f5c3e] focus-within:bg-white shadow-xs sm:shadow-[0_8px_24px_-3px_rgba(15,92,62,0.22),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_12px_32px_-2px_rgba(15,92,62,0.32)] focus-within:shadow-[0_12px_36px_-2px_rgba(15,92,62,0.36),0_0_0_3px_rgba(15,92,62,0.12)] hover:-translate-y-0.5 focus-within:-translate-y-0.5 transition-all duration-200 gap-2 sm:gap-2.5">
              <span className="material-symbols-outlined text-[#0f5c3e] text-[20px] sm:text-[22px] shrink-0">
                search
              </span>
              <input
                ref={searchInputRef}
                id="allCategorySearchInput"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsAutocompleteOpen(true);
                }}
                onFocus={() => setIsAutocompleteOpen(true)}
                onClick={() => setIsAutocompleteOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit(searchQuery);
                  }
                }}
                placeholder="What service do you need?"
                className="h-full bg-transparent text-gray-900 font-primary text-[13.5px] sm:text-[15px] w-full focus:outline-none placeholder:text-gray-400 font-medium"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsAutocompleteOpen(false);
                  }}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-center shrink-0"
                  title="Clear search"
                >
                  <span className="material-symbols-outlined text-[17px] sm:text-[18px]">cancel</span>
                </button>
              )}
            </div>

            {/* Search Autocomplete & Suggestions Dropdown */}
            <SearchAutocomplete
              query={searchQuery}
              categories={categories}
              recentSearches={recentSearches}
              isOpen={isAutocompleteOpen}
              fullScreenOnMobile={true}
              onClose={() => setIsAutocompleteOpen(false)}
              onSelectQuery={(selectedQuery) => {
                setSearchQuery(selectedQuery);
                handleSearchSubmit(selectedQuery);
              }}
              onSelectCategory={(catName, catObj) => {
                setIsAutocompleteOpen(false);
                const name =
                  typeof catName === "string" && catName.trim()
                    ? catName.trim()
                    : (catObj?.name || catObj?.category || catObj?.title || "").trim();
                if (name) {
                  saveRecentSearch(name);
                  const slug = catObj?.slug || generateSlug(name);
                  navigate(`/listings/category/${slug}`);
                }
              }}
              onSelectListing={(listing) => {
                setIsAutocompleteOpen(false);
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
              wrapperRef={inputContainerRef}
            />
          </div>
        </div>
      </section>

      {/* ── 2. Main Category Sections ── */}
      <main className="px-4 sm:px-8 lg:px-[70px] py-6 sm:py-10 max-w-[1440px] mx-auto">
        
        {/* ── A. Search Results Mode ── */}
        {isSearching && (
          <div>
            <div className="flex items-center justify-between mb-5 sm:mb-6 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-800 m-0">
                  Search Results
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0f5c3e] border border-emerald-200">
                  {searchResults.length} {searchResults.length === 1 ? "category" : "categories"} found
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-[#0f5c3e] hover:text-[#1a8a5a] transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>Clear search</span>
                <X size={13} />
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-6 max-w-lg mx-auto shadow-2xs">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#0f5c3e] flex items-center justify-center mx-auto mb-3 text-xl">
                  <Search size={22} />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-800 mb-1">
                  No categories found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed">
                  We couldn't find any category matching "{searchQuery}". Try searching for another keyword or browse all sections.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-[#0f5c3e] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:bg-[#1a8a5a] transition-all cursor-pointer"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 min-[360px]:grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2.5 sm:gap-4 md:gap-3">
                {searchResults.map((category, index) => (
                  <CategoryCard key={category.id || index} category={category} index={index} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── B. All Category Sections (Continuous Browsing) ── */}
        {!isSearching && (
          <div className="space-y-10 sm:space-y-12">
            {Object.entries(groupedCategories).map(([section, items], sectionIndex) => {
              const icon = getSectionIcon(section);
              const sectionSlug = generateSlug(section);

              return (
                <section
                  key={section}
                  id={`section-${sectionSlug}`}
                  className="scroll-mt-36"
                >
                  {/* Section Title Bar */}
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 pb-3 border-b border-slate-200/80">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-[#0f5c3e] border border-emerald-200/60 flex items-center justify-center text-xs sm:text-sm shrink-0 shadow-2xs">
                      <i className={icon} />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-lg sm:text-xl lg:text-2xl text-slate-900 m-0 tracking-tight">
                        {section}
                      </h2>
                    </div>
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {items.length}
                    </span>
                  </div>

                  {/* Subcategories Grid */}
                  <div className="grid grid-cols-3 min-[360px]:grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2.5 sm:gap-4 md:gap-3">
                    {items.map((category, index) => (
                      <CategoryCard
                        key={category.id || index}
                        category={category}
                        index={sectionIndex * 10 + index}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* ── 4. Merchant CTA Banner ── */}
      <BusinessCTA bgColor="var(--background-secondary)" />
    </div>
  );
}