import React from "react";
import { useSearch } from "../context/SearchContext";

export default function ActiveFiltersBar() {
  const {
    hasActiveFilters,
    selectedCategories,
    toggleCategory,
    selectedLocalities,
    toggleLocality,
    selectedTags,
    toggleTag,
    openNowOnly,
    setOpenNowOnly,
    verifiedOnly,
    setVerifiedOnly,
    claimedOnly,
    setClaimedOnly,
    minRating,
    setMinRating,
    handleResetFilters,
  } = useSearch();

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="font-primary text-[12px] text-gray-500 font-bold mr-1">
        Active:
      </span>

      {/* Category chips */}
      {selectedCategories.map((cat) => (
        <span
          key={cat}
          className="inline-flex items-center gap-1 bg-white text-gray-800 border border-gray-200 px-2.5 py-1 rounded-full font-primary text-[12px] font-medium shadow-xs"
        >
          <span>{cat}</span>
          <button
            type="button"
            onClick={() => toggleCategory(cat)}
            className="hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer p-0 flex items-center text-gray-400"
            aria-label={`Remove filter ${cat}`}
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </span>
      ))}

      {/* Locality chips */}
      {selectedLocalities.map((loc) => (
        <span
          key={loc}
          className="inline-flex items-center gap-1 bg-white text-gray-800 border border-gray-200 px-2.5 py-1 rounded-full font-primary text-[12px] font-medium shadow-xs"
        >
          <span>{loc}</span>
          <button
            type="button"
            onClick={() => toggleLocality(loc)}
            className="hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer p-0 flex items-center text-gray-400"
            aria-label={`Remove filter ${loc}`}
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </span>
      ))}

      {/* Tag chips */}
      {selectedTags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-white text-gray-800 border border-gray-200 px-2.5 py-1 rounded-full font-primary text-[12px] font-medium shadow-xs"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => toggleTag(tag)}
            className="hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer p-0 flex items-center text-gray-400"
            aria-label={`Remove tag ${tag}`}
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </span>
      ))}

      {/* Open now chip */}
      {openNowOnly && (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-primary text-[12px] font-medium">
          <span>Open Now</span>
          <button
            type="button"
            onClick={() => setOpenNowOnly(false)}
            className="hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer p-0 flex items-center text-emerald-600"
            aria-label="Remove Open Now filter"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </span>
      )}

      {/* Verified chip */}
      {verifiedOnly && (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-primary text-[12px] font-medium">
          <span>Verified Only</span>
          <button
            type="button"
            onClick={() => setVerifiedOnly(false)}
            className="hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer p-0 flex items-center text-emerald-600"
            aria-label="Remove Verified filter"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </span>
      )}

      {/* Claimed chip */}
      {claimedOnly && (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-primary text-[12px] font-medium">
          <span>Official / Claimed</span>
          <button
            type="button"
            onClick={() => setClaimedOnly(false)}
            className="hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer p-0 flex items-center text-emerald-600"
            aria-label="Remove Claimed filter"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </span>
      )}

      {/* Rating chip */}
      {minRating > 0 && (
        <span className="inline-flex items-center gap-1 bg-white text-gray-800 border border-gray-200 px-2.5 py-1 rounded-full font-primary text-[12px] font-medium shadow-xs">
          <span>Rating {minRating}+ ★</span>
          <button
            type="button"
            onClick={() => setMinRating(0)}
            className="hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer p-0 flex items-center text-gray-400"
            aria-label="Remove rating filter"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </span>
      )}

      {/* Clear all */}
      <button
        type="button"
        onClick={handleResetFilters}
        className="font-primary text-[12px] text-[#0f5c3e] hover:underline font-semibold ml-1 cursor-pointer border-0 bg-transparent p-0"
      >
        Clear all
      </button>
    </div>
  );
}
