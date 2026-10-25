import React from "react";

export default function ArticleSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl bg-white border border-border/80 overflow-hidden shadow-2xs flex flex-col h-full"
        >
          {/* Image skeleton with floating badges */}
          <div className="w-full h-48 sm:h-52 skeleton-shimmer relative">
            {/* Top-left category badge skeleton */}
            <div className="absolute top-3 left-3 w-20 h-6 bg-white/85 rounded-full shadow-2xs" />
            {/* Top-right reading time skeleton */}
            <div className="absolute top-3 right-3 w-16 h-5 bg-black/20 backdrop-blur-xs rounded-full shadow-2xs" />
          </div>

          {/* Card Body Content skeleton */}
          <div className="p-4 sm:px-5 sm:pt-4 sm:pb-4 flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-2.5">
              {/* Title lines */}
              <div className="w-11/12 h-5 rounded-md skeleton-shimmer" />
              <div className="w-4/5 h-5 rounded-md skeleton-shimmer" />

              {/* Excerpt lines */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-3.5 rounded skeleton-shimmer-subtle" />
                <div className="w-5/6 h-3.5 rounded skeleton-shimmer-subtle" />
              </div>
            </div>

            {/* Footer: Date + Read link skeleton */}
            <div className="pt-3 border-t border-border/70 flex items-center justify-between">
              <div className="w-20 h-3.5 rounded skeleton-shimmer-subtle" />
              <div className="w-24 h-4 rounded-md skeleton-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
