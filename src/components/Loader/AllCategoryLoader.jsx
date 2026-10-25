import React from "react";

function AllCategoryLoader({ sections = 4, itemsPerSection = 8 }) {
  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-20 py-5 flex flex-col gap-8 md:gap-10 animate-fadeIn">
      {Array.from({ length: sections }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="flex flex-col gap-5">
          {/* Section Title */}
          <div className="w-36 sm:w-44 md:w-56 h-5 md:h-[22px] skeleton-shimmer rounded-md"></div>

          {/* Items */}
          <div className="grid grid-cols-4 sm:grid-cols-[repeat(auto-fill,minmax(90px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 sm:gap-2.5">
            {Array.from({ length: itemsPerSection }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                {/* Icon */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl skeleton-shimmer"></div>

                {/* Text */}
                <div className="w-12 sm:w-16 h-2.5 sm:h-3 rounded skeleton-shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllCategoryLoader;