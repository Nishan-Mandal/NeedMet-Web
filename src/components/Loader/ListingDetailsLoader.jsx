import React from "react";

function ListingDetailsLoader() {
  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-20 py-5 flex flex-col gap-6 md:gap-8">
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* LEFT - IMAGE */}
        <div className="flex flex-col">
          <div className="w-full h-52 sm:h-56 md:h-64 rounded-2xl bg-gray-200 animate-pulse"></div>

          <div className="flex flex-row-reverse gap-2.5 mt-2.5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="w-24 sm:w-32 md:w-44 h-11 sm:h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* RIGHT - INFO */}
        <div className="flex flex-col gap-2.5">
          <div className="w-28 h-3 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-40 sm:w-52 h-5 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-36 h-3.5 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-4/5 h-3 bg-gray-200 rounded-md animate-pulse"></div>

          <div className="flex gap-2.5 my-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[30px] h-[30px] rounded-full bg-gray-200 animate-pulse"></div>
            ))}
          </div>

          <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-44 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Ratings */}
        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="w-36 h-4 bg-gray-200 rounded-md animate-pulse mb-2.5"></div>
          <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Opening Hours */}
        <div className="p-4 rounded-xl bg-surface border border-border/60">
          <div className="w-36 h-4 bg-gray-200 rounded-md animate-pulse mb-2.5"></div>
          <div className="w-full h-28 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="p-4 rounded-xl bg-surface border border-border/60">
        <div className="w-36 h-4 bg-gray-200 rounded-md animate-pulse mb-2.5"></div>
        <div className="w-full h-16 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* SIMILAR LISTINGS */}
      <div className="flex flex-col gap-4">
        <div className="w-36 sm:w-52 h-[18px] bg-gray-200 rounded-lg animate-pulse"></div>

        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5 sm:gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-surface border border-border/60">
              <div className="w-full aspect-video rounded-lg bg-gray-200 animate-pulse mb-2"></div>
              <div className="w-28 h-3.5 rounded bg-gray-200 animate-pulse mb-1.5"></div>
              <div className="w-20 h-3 rounded bg-gray-200 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* RECOMMENDED */}
      <div className="flex flex-col gap-4">
        <div className="w-36 sm:w-52 h-[18px] bg-gray-200 rounded-lg animate-pulse"></div>

        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5 sm:gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-surface border border-border/60">
              <div className="w-full aspect-video rounded-lg bg-gray-200 animate-pulse mb-2"></div>
              <div className="w-28 h-3.5 rounded bg-gray-200 animate-pulse mb-1.5"></div>
              <div className="w-20 h-3 rounded bg-gray-200 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListingDetailsLoader;