import React from "react";

export default function SearchLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(15,92,62,0.08),0_1px_4px_rgba(0,0,0,0.04)] animate-pulse flex flex-col"
        >
          <div className="h-44 w-full bg-surface-container-high" />
          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-surface-container-high rounded w-3/4" />
              <div className="h-3 bg-surface-container-low rounded w-1/2" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-8 bg-surface-container-low rounded-xl flex-1" />
              <div className="h-8 bg-surface-container-high rounded-xl flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
