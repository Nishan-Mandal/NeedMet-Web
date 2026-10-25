import React, { useEffect } from "react";
import { useSearch } from "../context/SearchContext";

export default function MobileFilterDrawer() {
  const {
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    availableCategories,
    selectedCategories,
    toggleCategory,
    availableLocalities,
    selectedLocalities,
    toggleLocality,
    availableTags,
    selectedTags,
    toggleTag,
    minRating,
    setMinRating,
    ratingCounts,
    openNowOnly,
    setOpenNowOnly,
    verifiedOnly,
    setVerifiedOnly,
    claimedOnly,
    setClaimedOnly,
    statusCounts,
    hasActiveFilters,
    handleResetFilters,
  } = useSearch();

  // Prevent background scroll when filter drawer is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  if (!isMobileFilterOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
        onClick={() => setIsMobileFilterOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[340px] bg-white h-full shadow-2xl flex flex-col z-10 animate-[slideLeft_0.25s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0f5c3e] text-[20px]">
              tune
            </span>
            <h3 className="font-heading text-[16px] text-gray-900 font-bold m-0">
              Filters
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="font-primary text-[12px] font-semibold text-[#0f5c3e] hover:underline border-0 bg-transparent cursor-pointer p-0"
              >
                Reset all
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 border-0 bg-transparent cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Filter Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 [scrollbar-width:thin]">
          {/* 1. Dynamic Categories from Backend */}
          {availableCategories.length > 0 && (
            <div className="space-y-2.5">
              <label className="font-primary text-[11px] text-gray-500 font-bold uppercase tracking-wider block">
                Categories
              </label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 [scrollbar-width:thin]">
                {availableCategories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.name);
                  return (
                    <label
                      key={cat.name}
                      className="flex items-center justify-between cursor-pointer group select-none text-[13px] py-1 px-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat.name)}
                          className="w-4 h-4 rounded text-[#0f5c3e] focus:ring-0 accent-[#0f5c3e] cursor-pointer"
                        />
                        <span
                          className={`truncate transition-colors ${
                            isChecked
                              ? "font-bold text-[#0f5c3e]"
                              : "text-gray-700 group-hover:text-gray-900"
                          }`}
                        >
                          {cat.name}
                        </span>
                      </div>
                      {cat.count > 0 && (
                        <span className="font-primary text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium shrink-0 ml-1">
                          {cat.count}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Dynamic Localities / Areas from Backend */}
          {availableLocalities.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-gray-100">
              <label className="font-primary text-[11px] text-gray-500 font-bold uppercase tracking-wider block">
                Areas &amp; Localities
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 [scrollbar-width:thin]">
                {availableLocalities.map((loc) => {
                  const isChecked = selectedLocalities.includes(loc.name);
                  return (
                    <label
                      key={loc.name}
                      className="flex items-center justify-between cursor-pointer group select-none text-[13px] py-1 px-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleLocality(loc.name)}
                          className="w-4 h-4 rounded text-[#0f5c3e] focus:ring-0 accent-[#0f5c3e] cursor-pointer"
                        />
                        <span
                          className={`truncate transition-colors ${
                            isChecked
                              ? "font-bold text-[#0f5c3e]"
                              : "text-gray-700 group-hover:text-gray-900"
                          }`}
                        >
                          {loc.name}
                        </span>
                      </div>
                      <span className="font-primary text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium shrink-0 ml-1">
                        {loc.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Dynamic Tags / Features from Backend */}
          {availableTags.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-gray-100">
              <label className="font-primary text-[11px] text-gray-500 font-bold uppercase tracking-wider block">
                Features &amp; Specialties
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isChecked = selectedTags.includes(tag.name);
                  return (
                    <button
                      key={tag.name}
                      type="button"
                      onClick={() => toggleTag(tag.name)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border ${
                        isChecked
                          ? "bg-[#0f5c3e] text-white border-[#0f5c3e]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <span>{tag.name}</span>
                      <span className="ml-1 opacity-70">({tag.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Customer Rating */}
          <div className="space-y-2.5 pt-3 border-t border-gray-100">
            <label className="font-primary text-[11px] text-gray-500 font-bold uppercase tracking-wider block">
              Customer Rating
            </label>
            <div className="space-y-1.5 text-[13px]">
              <label className="flex items-center justify-between cursor-pointer select-none py-1 px-1.5 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rating_filter_mobile"
                    checked={minRating === 4.5}
                    onChange={() => setMinRating(4.5)}
                    className="w-4 h-4 text-[#0f5c3e] accent-[#0f5c3e] cursor-pointer"
                  />
                  <span className="text-gray-800 font-medium">4.5 ★ &amp; above</span>
                </div>
                {ratingCounts.r45 > 0 && (
                  <span className="text-[11px] text-gray-400 font-medium">
                    ({ratingCounts.r45})
                  </span>
                )}
              </label>
              <label className="flex items-center justify-between cursor-pointer select-none py-1 px-1.5 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rating_filter_mobile"
                    checked={minRating === 4.0}
                    onChange={() => setMinRating(4.0)}
                    className="w-4 h-4 text-[#0f5c3e] accent-[#0f5c3e] cursor-pointer"
                  />
                  <span className="text-gray-800 font-medium">4.0 ★ &amp; above</span>
                </div>
                {ratingCounts.r40 > 0 && (
                  <span className="text-[11px] text-gray-400 font-medium">
                    ({ratingCounts.r40})
                  </span>
                )}
              </label>
              <label className="flex items-center justify-between cursor-pointer select-none py-1 px-1.5 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rating_filter_mobile"
                    checked={minRating === 3.5}
                    onChange={() => setMinRating(3.5)}
                    className="w-4 h-4 text-[#0f5c3e] accent-[#0f5c3e] cursor-pointer"
                  />
                  <span className="text-gray-800 font-medium">3.5 ★ &amp; above</span>
                </div>
                {ratingCounts.r35 > 0 && (
                  <span className="text-[11px] text-gray-400 font-medium">
                    ({ratingCounts.r35})
                  </span>
                )}
              </label>
              <label className="flex items-center justify-between cursor-pointer select-none py-1 px-1.5 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rating_filter_mobile"
                    checked={minRating === 0}
                    onChange={() => setMinRating(0)}
                    className="w-4 h-4 text-[#0f5c3e] accent-[#0f5c3e] cursor-pointer"
                  />
                  <span className="text-gray-800 font-medium">Any rating</span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  ({ratingCounts.total})
                </span>
              </label>
            </div>
          </div>

          {/* 5. Operational Status */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <label className="font-primary text-[11px] text-gray-500 font-bold uppercase tracking-wider block">
              Operational Status
            </label>
            <div className="space-y-2 text-[13px]">
              <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-gray-50">
                <span className="text-gray-800 font-medium">Open Now Only</span>
                <div className="flex items-center gap-1.5">
                  {statusCounts.openCount > 0 && (
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      {statusCounts.openCount}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    checked={openNowOnly}
                    onChange={(e) => setOpenNowOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0f5c3e] focus:ring-0 accent-[#0f5c3e] cursor-pointer"
                  />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-gray-50">
                <span className="text-gray-800 font-medium">Verified Only</span>
                <div className="flex items-center gap-1.5">
                  {statusCounts.verifiedCount > 0 && (
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      {statusCounts.verifiedCount}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0f5c3e] focus:ring-0 accent-[#0f5c3e] cursor-pointer"
                  />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-gray-50">
                <span className="text-gray-800 font-medium">Claimed / Official</span>
                <div className="flex items-center gap-1.5">
                  {statusCounts.claimedCount > 0 && (
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      {statusCounts.claimedCount}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    checked={claimedOnly}
                    onChange={(e) => setClaimedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0f5c3e] focus:ring-0 accent-[#0f5c3e] cursor-pointer"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 flex gap-2 shrink-0 bg-white pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => {
              handleResetFilters();
              setIsMobileFilterOpen(false);
            }}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-primary font-semibold text-[13px] hover:bg-gray-200 transition-colors border-0 cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(false)}
            className="flex-1 py-2.5 rounded-xl bg-[#0f5c3e] text-white font-primary font-bold text-[13px] hover:bg-[#0b462f] transition-colors border-0 cursor-pointer shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
