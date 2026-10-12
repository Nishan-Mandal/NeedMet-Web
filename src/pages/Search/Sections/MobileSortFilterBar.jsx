import React from "react";
import { useSearch } from "../context/SearchContext";

export default function MobileSortFilterBar() {
  const {
    setIsMobileSortOpen,
    setIsMobileFilterOpen,
    selectedCategories = [],
    selectedLocalities = [],
    selectedTags = [],
    minRating = 0,
    openNowOnly = false,
    verifiedOnly = false,
    claimedOnly = false,
  } = useSearch();

  const activeFiltersCount =
    (selectedCategories?.length || 0) +
    (selectedLocalities?.length || 0) +
    (selectedTags?.length || 0) +
    (minRating > 0 ? 1 : 0) +
    (openNowOnly ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (claimedOnly ? 1 : 0);

  return (
    <div className="lg:hidden w-full bg-white border-y border-gray-200 shadow-2xs">
      <div className="grid grid-cols-2 divide-x divide-gray-200">
        {/* Sort Button */}
        <button
          type="button"
          onClick={() => setIsMobileSortOpen(true)}
          className="flex items-center justify-center gap-2 py-3 px-3 text-gray-800 font-primary font-medium text-[14px] hover:bg-gray-50 active:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer select-none"
        >
          <span className="material-symbols-outlined text-[20px] text-gray-700">
            sort
          </span>
          <span>Sort</span>
        </button>

        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center justify-center gap-2 py-3 px-3 text-gray-800 font-primary font-medium text-[14px] hover:bg-gray-50 active:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer select-none"
        >
          <span className="material-symbols-outlined text-[19px] text-gray-700">
            tune
          </span>
          <span>Filter</span>
          {activeFiltersCount > 0 && (
            <span className="min-w-4 h-4 px-1 rounded-full bg-[#0f5c3e] text-white text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
