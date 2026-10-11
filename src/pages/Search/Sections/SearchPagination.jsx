import React from "react";
import { useSearch } from "../context/SearchContext";

export default function SearchPagination() {
  const {
    currentPage,
    setCurrentPage,
    goToPage,
    totalPages,
    filteredListings,
    itemsPerPage,
    setItemsPerPage,
    refetchListings,
    listingsFetching,
  } = useSearch();

  const totalResults = filteredListings.length;

  if (totalResults === 0) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      if (goToPage) {
        goToPage(currentPage - 1);
      } else {
        setCurrentPage(currentPage - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      if (goToPage) {
        goToPage(currentPage + 1);
      } else {
        setCurrentPage(currentPage + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleRefresh = () => {
    if (refetchListings) {
      refetchListings();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(15,92,62,0.06),0_1px_4px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 font-primary">
      {/* ── LEFT SECTION: Showing Page [ 1 ] | Show: [ 10 ⌄ ] ── */}
      <div className="flex flex-wrap items-center gap-3 text-[13px] text-gray-700 font-medium select-none">
        {/* Page Badge with Direct Jump Selector when multiple pages exist */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">Showing Page</span>
          {totalPages > 1 ? (
            <div className="relative inline-flex items-center">
              <select
                value={currentPage}
                onChange={(e) => {
                  const target = Number(e.target.value);
                  if (goToPage) goToPage(target);
                  else setCurrentPage(target);
                }}
                aria-label="Select page"
                className="appearance-none bg-surface-container-low text-primary font-bold text-[12px] pl-2.5 pr-6 h-7 rounded-full border border-primary/25 hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all shadow-2xs"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] text-primary/70 pointer-events-none">
                expand_more
              </span>
            </div>
          ) : (
            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2.5 rounded-full bg-surface-container-low text-primary font-bold text-[12px] border border-primary/20 shadow-2xs">
              {currentPage}
            </span>
          )}
          {totalPages > 1 && (
            <span className="text-gray-400 text-[12px] font-normal">of {totalPages}</span>
          )}
        </div>

        {/* Separator */}
        <span className="text-gray-300 font-light select-none hidden sm:inline" aria-hidden="true">
          |
        </span>

        {/* Per-page Select Pill */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600 font-medium">Show:</span>
          <div className="relative inline-flex items-center">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage && setItemsPerPage(Number(e.target.value))}
              aria-label="Items per page"
              className="appearance-none bg-surface-container-low text-gray-900 font-bold text-[12px] pl-3 pr-7 py-1 rounded-full border border-primary/25 hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all shadow-2xs"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-gray-500 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT SECTION: [ 🔄 Refresh ] [ ‹ Previous ] [ Next › ] ── */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center sm:justify-end">
        {/* Refresh Button */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={listingsFetching}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-surface-container-low hover:text-primary hover:border-primary/30 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Refresh results"
          title="Refresh listings"
        >
          <span
            className={`material-symbols-outlined text-[16px] text-primary ${
              listingsFetching ? "animate-spin" : ""
            }`}
          >
            refresh
          </span>
          <span>Refresh</span>
        </button>

        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-surface-container-low hover:text-primary hover:border-primary/30 transition-all cursor-pointer shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200 active:scale-95"
          aria-label="Previous page"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          <span>Previous</span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-surface-container-low hover:text-primary hover:border-primary/30 transition-all cursor-pointer shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200 active:scale-95"
          aria-label="Next page"
        >
          <span>Next</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
