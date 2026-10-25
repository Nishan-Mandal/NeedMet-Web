import React from "react";

export default function SearchPageLoader() {
  return (
    <div className="px-4 md:px-8 lg:px-20 py-5 flex flex-col gap-7 bg-surface animate-fadeIn">
      {/* 🔹 Categories Loader */}
      <div className="flex flex-col gap-4">
        <div className="w-32 sm:w-40 md:w-48 h-6 sm:h-7 rounded-xl skeleton-shimmer"></div>

        <div className="grid grid-cols-4 sm:grid-cols-[repeat(auto-fill,minmax(80px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(85px,1fr))] gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-2xl skeleton-shimmer mb-2"></div>
              <div className="w-12 sm:w-15 h-2.5 sm:h-3 rounded-md skeleton-shimmer"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Listings Loader */}
      <div className="flex flex-col gap-4">
        <div className="w-32 sm:w-40 md:w-48 h-6 sm:h-7 rounded-xl skeleton-shimmer"></div>

        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5 sm:gap-3 md:gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-surface rounded-xl overflow-hidden p-2 sm:p-2.5 border border-border/60 shadow-2xs">
              <div className="w-full aspect-4/3 sm:aspect-video rounded-xl skeleton-shimmer mb-2.5"></div>

              <div className="flex flex-col gap-2">
                <div className="w-2/5 h-2.5 sm:h-3 rounded-md skeleton-shimmer"></div>
                <div className="w-full h-2.5 sm:h-3 rounded-md skeleton-shimmer"></div>
                <div className="w-3/4 h-2.5 sm:h-3 rounded-md skeleton-shimmer"></div>
                <div className="w-1/2 h-2.5 sm:h-3 rounded-md skeleton-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}