import React from "react";
import { useSearchParams } from "react-router-dom";
import { TrendingSearches } from "../../../components";
import { useCategories } from "../../../hooks/useAllCategories";
import searchImg from "../../../assets/search.png";

export default function SearchEmptyLanding() {
  const [, setSearchParams] = useSearchParams();
  const { data: allCategories = [] } = useCategories();

  const handleSelectCategory = (catName) => {
    if (!catName || !catName.trim()) return;
    setSearchParams({ q: catName.trim() });
  };

  return (
    <div className="w-full  max-w-9xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-full overflow-hidden">
        <TrendingSearches />
      </div>

      <div className=" hidden mt-8 bg-white rounded-3xl p-6 sm:p-10 shadow-[0_8px_32px_rgba(15,92,62,0.10),0_2px_8px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
        <img
          src={searchImg}
          alt="Search illustration"
          loading="lazy"
          className="w-48 sm:w-60 mb-4 opacity-90"
        />
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface m-0">
          Search Listings &amp; Services
        </h2>
        <p className="font-primary text-[15px] text-on-surface-variant max-w-md mt-2 leading-relaxed">
          Find verified salons, mechanics, restaurants, PGs, doctors, and home services in Haldia instantly.
        </p>

        {/* Popular quick categories pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-xl">
          {allCategories.slice(0, 8).map((cat) => (
            <button
              key={cat.id || cat.name}
              type="button"
              onClick={() => handleSelectCategory(cat.name)}
              className="px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-primary hover:text-white text-on-surface font-primary text-[13px] font-medium transition-all shadow-[0_2px_8px_rgba(15,92,62,0.10)] hover:shadow-[0_4px_14px_rgba(15,92,62,0.25)] cursor-pointer"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
