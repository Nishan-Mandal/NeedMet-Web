import React from "react";

export default function FeaturedArticleSkeleton() {
  return (
    <div className="relative rounded-3xl bg-white overflow-hidden border border-border/80 shadow-md">
      {/* Ambient background glow behind card */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
        {/* Left: Big Cover Image Skeleton */}
        <div className="relative lg:col-span-7 h-64 sm:h-80 lg:h-[420px] overflow-hidden skeleton-shimmer">
          {/* Floating badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-28 h-6 rounded-full bg-white/80 shadow-xs" />
            <div className="w-20 h-6 rounded-full bg-white/90 shadow-xs" />
          </div>

          <div className="absolute bottom-4 right-4">
            <div className="w-24 h-6 rounded-full bg-black/25 backdrop-blur-md shadow-xs" />
          </div>
        </div>

        {/* Right: Text & Action Skeletons */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full space-y-4 sm:space-y-6">
          <div className="space-y-3.5">
            {/* Meta Row */}
            <div className="w-24 h-4 rounded-md skeleton-shimmer-subtle" />

            {/* Headline */}
            <div className="space-y-2 pt-1">
              <div className="w-full h-7 sm:h-8 lg:h-9 rounded-lg skeleton-shimmer" />
              <div className="w-4/5 h-7 sm:h-8 lg:h-9 rounded-lg skeleton-shimmer" />
              <div className="w-2/3 h-7 sm:h-8 lg:h-9 rounded-lg skeleton-shimmer" />
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-2">
              <div className="w-full h-3.5 sm:h-4 rounded skeleton-shimmer-subtle" />
              <div className="w-11/12 h-3.5 sm:h-4 rounded skeleton-shimmer-subtle" />
              <div className="w-3/4 h-3.5 sm:h-4 rounded skeleton-shimmer-subtle" />
            </div>
          </div>

          {/* Footer: Date + Read CTA */}
          <div className="pt-4 border-t border-border/80 flex items-center justify-between gap-4">
            <div className="w-28 h-4 rounded skeleton-shimmer-subtle" />
            <div className="w-36 h-10 rounded-xl skeleton-shimmer shadow-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
