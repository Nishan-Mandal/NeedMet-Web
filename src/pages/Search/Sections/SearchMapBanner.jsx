import React from "react";
import { useSearch } from "../context/SearchContext";

export default function SearchMapBanner() {
  const { activeQuery, filteredListings } = useSearch();
  const totalResults = filteredListings.length;

  return (
    <div className="relative bg-white rounded-2xl p-5 shadow-[0_8px_28px_rgba(15,92,62,0.10),0_2px_8px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-primary-surface flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-[26px]">map</span>
        </div>
        <div>
          <h4 className="font-heading text-[16px] text-on-surface font-bold m-0">
            Explore Haldia Businesses Map
          </h4>
          <p className="font-primary text-[13px] text-on-surface-variant m-0 mt-0.5">
            View {totalResults} locations on an interactive neighborhood map with live routes.
          </p>
        </div>
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${activeQuery} Haldia West Bengal`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-surface-container-low hover:bg-surface-container text-on-surface font-primary font-semibold text-[13px] px-5 py-2.5 rounded-xl transition-all shadow-[0_2px_8px_rgba(15,92,62,0.10)] hover:shadow-[0_4px_14px_rgba(15,92,62,0.18)] shrink-0 flex items-center gap-1.5 no-underline"
      >
        <span className="material-symbols-outlined text-[18px] text-secondary">
          explore
        </span>
        <span>Open Map View</span>
      </a>
    </div>
  );
}
