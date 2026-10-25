import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { AllCategoryLoader, SystemState, BusinessCTA, SEO } from "../../components";
import ErrorImg from "../../assets/error.png";
import NoDataImg from "../../assets/no_data.png";
import empty_thumb from "../../assets/empty_thumb.png";
import { useCategories } from "../../hooks/useAllCategories";
import { generateSlug } from "../../utils/slugify.js";

// Vibrant, curated pastel palette matching NeedMet design aesthetic
const CATEGORY_PALETTE = [
  { bg: "#f3edff", border: "#d8c7ff" },
  { bg: "#edf9f2", border: "#b8e5ca" },
  { bg: "#fff1f6", border: "#ffc6e0" },
  { bg: "#fff6e9", border: "#ffd7a3" },
  { bg: "#f0f7ff", border: "#c6dbff" },
  { bg: "#fffcec", border: "#ffe7a6" },
  { bg: "#e9fbfa", border: "#b5ece8" },
  { bg: "#f6f0ff", border: "#d8c6ff" },
  { bg: "#fff3f0", border: "#ffc9c0" },
  { bg: "#f2fff2", border: "#c7efc7" },
  { bg: "#eef4ff", border: "#c3d5ff" },
  { bg: "#fff5ef", border: "#ffd4bf" },
];

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
  const { data: categories = [], isLoading: loading, error } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const searchInputRef = useRef(null);

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
    <div className="min-h-screen bg-background font-primary">
      <SEO
        title="Browse All Business Categories | NeedMet"
        description="Explore all business and service categories on NeedMet. Find salons, repair services, retail stores, healthcare clinics, restaurants, and more."
      />

      {/* ── 1. Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-surface/50 via-primary-surface/15 to-transparent pt-8 sm:pt-12 pb-7 sm:pb-10 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-surface border border-primary/20 text-primary text-xs font-bold font-heading mb-3.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{categories.length} Verified Categories · {sectionNames.length} Sectors</span>
          </div>

          {/* Title */}
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-[2.6rem] text-text-accent tracking-tight m-0 leading-tight">
            Explore All Categories
          </h1>

          {/* Subtitle */}
          <p className="font-primary text-xs sm:text-sm md:text-base text-text-secondary max-w-xl mx-auto mt-2.5 mb-6 leading-relaxed">
            Find trusted local businesses, retail stores, healthcare providers, and essential neighborhood services with one click.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto relative bg-white border border-border shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 rounded-2xl p-1.5 flex items-center transition-all duration-200">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-primary">
              <i className="fa-solid fa-magnifying-glass text-sm" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories (e.g., Salon, Clinic, Electronics, Dining)..."
              className="w-full px-2 py-2 text-xs sm:text-sm text-text bg-transparent outline-none placeholder:text-gray-400 font-primary"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center text-xs transition-colors cursor-pointer mr-1.5"
                title="Clear search"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            )}

            <button
              type="button"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-primary transition-colors shrink-0 select-none shadow-xs"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. Sticky Category Filter Pills ── */}
      {!isSearching && (
        <div className="sticky top-[58px] sm:top-[68px] z-20 bg-white/95 backdrop-blur-md py-3 px-4 sm:px-8 lg:px-[70px]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0">
            <button
              type="button"
              onClick={() => setSelectedSection("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                selectedSection === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 hover:bg-gray-200 text-text border border-border/60"
              }`}
            >
              <i className="fa-solid fa-border-all text-[11px]" />
              <span>All Categories</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedSection === "all" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}`}>
                {categories.length}
              </span>
            </button>

            {sectionNames.map((section) => {
              const count = groupedCategories[section]?.length || 0;
              const isSelected = selectedSection === section;
              const icon = getSectionIcon(section);

              return (
                <button
                  key={section}
                  type="button"
                  onClick={() => setSelectedSection(section)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-100 hover:bg-gray-200 text-text border border-border/60"
                  }`}
                >
                  <i className={`${icon} text-[11px]`} />
                  <span>{section}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. Main Categories Content ── */}
      <main className="px-4 sm:px-8 lg:px-[70px] py-6 sm:py-10 max-w-[1440px] mx-auto">
        
        {/* ── Search Mode Active ── */}
        {isSearching && (
          <div>
            <div className="flex items-center justify-between mb-5 sm:mb-6 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-text m-0">
                  Search Results
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-surface text-primary border border-primary/20">
                  {searchResults.length} {searchResults.length === 1 ? "category" : "categories"} found
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>Clear filter</span>
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-16 text-center bg-gray-50/70 border border-border rounded-2xl p-6 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-full bg-primary-surface text-primary flex items-center justify-center mx-auto mb-3 text-xl">
                  <i className="fa-solid fa-magnifying-glass" />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-text mb-1">
                  No categories found
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary mb-4 leading-relaxed">
                  We couldn't find any category matching "{searchQuery}". Try searching for another keyword or browse all sections.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:bg-primary-dark transition-all cursor-pointer"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 sm:gap-4">
                {searchResults.map((category, index) => renderCategoryCard(category, index))}
              </div>
            )}
          </div>
        )}

        {/* ── Section Specific Mode Active ── */}
        {!isSearching && selectedSection !== "all" && (
          <div>
            <div className="flex items-center justify-between mb-5 sm:mb-6 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-surface text-primary flex items-center justify-center text-sm shrink-0 border border-primary/20">
                  <i className={getSectionIcon(selectedSection)} />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-text-accent m-0">
                    {selectedSection}
                  </h2>
                  <p className="text-xs text-text-secondary m-0">
                    {groupedCategories[selectedSection]?.length || 0} categories available
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSection("all")}
                className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>View all sectors</span>
                <i className="fa-solid fa-arrow-right text-[11px]" />
              </button>
            </div>

            <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 sm:gap-4">
              {groupedCategories[selectedSection]?.map((category, index) => renderCategoryCard(category, index))}
            </div>
          </div>
        )}

        {/* ── Default View: All Sections with Clean Dividers ── */}
        {!isSearching && selectedSection === "all" && (
          <div className="space-y-10 sm:space-y-12">
            {Object.entries(groupedCategories).map(([section, items], sectionIndex) => {
              const icon = getSectionIcon(section);

              return (
                <section key={section} className="scroll-mt-32">
                  
                  {/* Section Title Bar */}
                  <div className="flex items-center justify-between mb-4 sm:mb-5 pb-3 border-b border-border/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-surface text-primary flex items-center justify-center text-xs sm:text-sm shrink-0 border border-primary/20 shadow-xs">
                        <i className={icon} />
                      </div>
                      <div>
                        <h2 className="font-heading font-bold text-lg sm:text-xl lg:text-2xl text-text-accent m-0 tracking-tight">
                          {section}
                        </h2>
                      </div>
                      <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                        {items.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedSection(section)}
                      className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer hidden sm:inline-flex items-center gap-1"
                    >
                      <span>Focus section</span>
                      <i className="fa-solid fa-arrow-right text-[10px]" />
                    </button>
                  </div>

                  {/* Category Cards Grid */}
                  <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 sm:gap-4">
                    {items.map((category, index) =>
                      renderCategoryCard(category, sectionIndex * 10 + index)
                    )}
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

function renderCategoryCard(category, index) {
  const name = category.name || category.category;
  const image = category.imageUrl || empty_thumb;
  const palette = CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
  const id = category.id || index;

  return (
    <Link
      to={`/listings/category/${generateSlug(name)}`}
      key={id}
      style={{
        backgroundColor: palette.bg,
        borderColor: palette.border,
        borderWidth: "1.5px",
        borderStyle: "solid",
      }}
      className="category-card group flex max-sm:flex-col max-sm:justify-center max-sm:text-center items-center cursor-pointer transition-all duration-200 ease-out box-border no-underline rounded-[16px] sm:rounded-[18px] gap-2 p-[14px_10px] min-h-[105px] sm:gap-3 sm:p-[15px_16px] sm:min-h-[76px] lg:gap-3.5 lg:p-[16px_18px] lg:min-h-[80px] hover:-translate-y-1 hover:shadow-md active:scale-[0.98]"
    >
      <div className="category-icon flex items-center justify-center shrink-0 bg-white/85 shadow-2xs rounded-[12px] w-[44px] h-[44px] sm:rounded-[14px] sm:w-12 sm:h-12 lg:w-[50px] lg:h-[50px] transition-transform duration-200 group-hover:scale-105">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="object-contain block w-6 h-6 sm:w-[28px] sm:h-[28px] lg:w-[32px] lg:h-[32px]"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="category-name font-primary font-semibold text-text break-words text-[12px] leading-[1.25] text-center line-clamp-2 sm:text-[14px] sm:leading-[1.3] sm:text-left sm:line-clamp-none lg:text-[14.5px] m-0 group-hover:text-primary transition-colors">
          {name}
        </p>
      </div>

      <i className="fa-solid fa-chevron-right text-[11px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block shrink-0" />
    </Link>
  );
}