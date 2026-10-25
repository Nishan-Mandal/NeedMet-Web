import React, { useEffect } from "react";
import { useSearch } from "../context/SearchContext";

const SORT_OPTIONS = [
  { value: "recommended", label: "Relevance" },
  { value: "rating", label: "Popularity" },
  { value: "price_asc", label: "Price -- Low to High" },
  { value: "price_desc", label: "Price -- High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function MobileSortBottomSheet() {
  const {
    isMobileSortOpen,
    setIsMobileSortOpen,
    sortBy,
    setSortBy,
    setCurrentPage,
  } = useSearch();

  // Prevent background scroll when bottom sheet is open
  useEffect(() => {
    if (isMobileSortOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSortOpen]);

  if (!isMobileSortOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
        onClick={() => setIsMobileSortOpen(false)}
      />

      {/* Bottom Sheet Card */}
      <div className="relative w-full bg-white rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.25)] z-10 overflow-hidden animate-[slideUp_0.22s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header matching user screenshot */}
        <div className="px-5 py-3.5 border-b border-gray-200">
          <span className="font-primary text-[12px] font-bold text-gray-500 uppercase tracking-wider">
            SORT BY
          </span>
        </div>

        {/* Radio Options List matching user screenshot */}
        <div className="py-1">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = sortBy === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setSortBy(opt.value);
                  setCurrentPage(1);
                  setIsMobileSortOpen(false);
                }}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 border-0 bg-transparent cursor-pointer select-none"
              >
                <span
                  className={`font-primary text-[15px] ${
                    isSelected
                      ? "font-medium text-gray-900"
                      : "font-normal text-gray-700"
                  }`}
                >
                  {opt.label}
                </span>

                {/* Radio Button on the right matching user screenshot */}
                <span className="shrink-0 flex items-center justify-center ml-3">
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full border-2 border-[#1a73e8] flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8]" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-gray-400" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom safe area spacing */}
        <div className="h-6 pb-[env(safe-area-inset-bottom)] bg-white" />
      </div>
    </div>
  );
}
