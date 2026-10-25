import React from "react";
import { useSearch } from "../context/SearchContext";

export default function SearchZeroResults() {
  const { activeQuery, handleResetFilters } = useSearch();

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-[0_8px_32px_rgba(15,92,62,0.10),0_2px_8px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center gap-6">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-surface text-primary flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[36px] sm:text-[42px]">
          search_off
        </span>
      </div>
      <div className="space-y-2 text-center md:text-left flex-1">
        <div className="inline-flex items-center gap-1.5 bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-full font-primary text-[11px] font-semibold border border-outline-variant/40">
          <span className="material-symbols-outlined text-[14px] text-secondary">info</span>
          <span>No Exact Matches Found</span>
        </div>
        <h3 className="font-heading text-lg sm:text-xl text-on-surface font-bold m-0">
          No businesses found for &ldquo;{activeQuery}&rdquo;
        </h3>
        <p className="font-primary text-[14px] text-on-surface-variant leading-relaxed m-0">
          We couldn’t find matches with your active filters. Try these quick adjustments:
        </p>
        <ul className="space-y-1.5 pt-1 text-left font-primary text-[13px] text-on-surface-variant list-none p-0 m-0">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
            <span>Reset distance radius or category filters</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
            <span>Search for broader keywords like “Salon”, “Doctor”, or “Repair”</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
            <span>Check spelling or explore popular categories below</span>
          </li>
        </ul>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetFilters}
            className="bg-primary-container hover:bg-primary text-on-primary font-primary font-bold text-[13px] px-5 py-2.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 border-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
