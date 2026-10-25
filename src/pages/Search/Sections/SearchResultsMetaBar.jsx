import React from "react";
import { useSearch } from "../context/SearchContext";

export default function SearchResultsMetaBar() {
  const {
    filteredListings,
    activeQuery,
    sortBy,
    setSortBy,
    setCurrentPage,
    currentPage,
    itemsPerPage,
  } = useSearch();

  const totalResults = filteredListings.length;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalResults);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="font-heading text-[14px] sm:text-[16px] text-on-surface font-bold m-0">
          {totalResults > itemsPerPage ? (
            <>
              Showing{" "}
              <span className="text-secondary font-extrabold">
                {startItem}–{endItem}
              </span>{" "}
              of{" "}
              <span className="text-secondary font-extrabold">
                {totalResults} listings
              </span>
            </>
          ) : (
            <>
              Showing{" "}
              <span className="text-secondary font-extrabold">
                {totalResults} {totalResults === 1 ? "listing" : "listings"}
              </span>
            </>
          )}{" "}
          for &ldquo;{activeQuery}&rdquo;
        </h2>
      </div>

      {/* Desktop Sort Dropdown */}
      <div className="hidden lg:flex items-center gap-2 sm:gap-3 shrink-0">

        {/* Desktop Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="appearance-none bg-surface-container-low text-on-surface font-primary text-[13px] font-semibold py-2 pl-3 pr-8 rounded-xl shadow-[0_2px_8px_rgba(15,92,62,0.08)] cursor-pointer focus:outline-none focus:shadow-[0_4px_14px_rgba(15,92,62,0.16)]"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="rating">Popularity</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="reviews">Most Reviewed</option>
            <option value="newest">Newly Added</option>
          </select>
          <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
            expand_more
          </span>
        </div>
      </div>
    </div>
  );
}
