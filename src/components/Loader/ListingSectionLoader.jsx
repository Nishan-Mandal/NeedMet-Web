import React from "react";

function ListingSectionLoader({ count = 8, showSeeAll = true }) {
  return (
    <div className="px-4 md:px-8 lg:px-20 py-5">
      {/* Header */}
      <div className={`flex items-center mb-3 sm:mb-4 ${showSeeAll ? "justify-between" : "justify-start"}`}>
        <div className="w-28 sm:w-40 md:w-56 h-6 md:h-[30px] bg-gray-200 rounded-lg animate-pulse"></div>
        {showSeeAll && <div className="w-14 sm:w-16 h-4 md:h-[18px] bg-gray-200 rounded-lg animate-pulse"></div>}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5 sm:gap-3 md:gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-full p-2 sm:p-2.5 rounded-xl bg-surface border border-border/60">
            <div className="w-full aspect-4/3 sm:aspect-video rounded-xl bg-gray-200 animate-pulse mb-2.5"></div>

            <div className="flex flex-col gap-2">
              <div className="w-16 sm:w-20 h-3 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-24 sm:w-32 h-3.5 sm:h-4 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-11/12 h-3 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-14 h-3 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListingSectionLoader;