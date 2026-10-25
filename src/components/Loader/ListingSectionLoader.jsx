import React from "react";

function ListingSectionLoader({ count = 8, showSeeAll = true }) {
  return (
    <div className="px-4 md:px-8 lg:px-20 py-5 animate-fadeIn">
      {/* Header */}
      <div className={`flex items-center mb-3 sm:mb-4 ${showSeeAll ? "justify-between" : "justify-start"}`}>
        <div className="w-28 sm:w-40 md:w-56 h-6 md:h-[30px] skeleton-shimmer rounded-lg"></div>
        {showSeeAll && <div className="w-14 sm:w-16 h-4 md:h-[18px] skeleton-shimmer-subtle rounded-lg"></div>}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-full rounded-2xl bg-white border border-border/80 overflow-hidden shadow-2xs flex flex-col">
            <div className="w-full h-44 skeleton-shimmer"></div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="w-3/5 h-4 skeleton-shimmer rounded"></div>
                  <div className="w-14 h-4 skeleton-shimmer-subtle rounded-full"></div>
                </div>
                <div className="w-4/5 h-3 skeleton-shimmer-subtle rounded"></div>
                <div className="w-1/2 h-3 skeleton-shimmer-subtle rounded"></div>
                <div className="flex gap-1.5 pt-1">
                  <div className="w-14 h-4 skeleton-shimmer-subtle rounded"></div>
                  <div className="w-16 h-4 skeleton-shimmer-subtle rounded"></div>
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                <div className="flex-1 h-8 skeleton-shimmer-subtle rounded-lg"></div>
                <div className="flex-1 h-8 skeleton-shimmer rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListingSectionLoader;