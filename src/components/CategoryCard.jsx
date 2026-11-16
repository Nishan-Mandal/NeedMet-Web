import React, { useState } from "react";
import { Link } from "react-router-dom";
import empty_thumb from "../assets/empty_thumb.png";
import { generateSlug } from "../utils/slugify.js";

// Restrained pastel color palette with gentle borders matching reference aesthetics
export const CATEGORY_PALETTE = [
  { bg: "#fff7ed", border: "#fde2c8" }, // Warm Cream / Peach (Reference)
  { bg: "#fefce8", border: "#fcf09f" }, // Soft Warm Butter
  { bg: "#edf9f2", border: "#c1ead1" }, // Soft Mint
  { bg: "#f0f7ff", border: "#cfe1fd" }, // Soft Sky Blue
  { bg: "#f3edff", border: "#dcd0f9" }, // Soft Lavender
  { bg: "#fff1f6", border: "#fad1e4" }, // Soft Rose Pink
  { bg: "#f0fdfa", border: "#bbf7ed" }, // Soft Aqua
  { bg: "#fffbeb", border: "#fdeec4" }, // Warm Vanilla
];

/**
 * Reusable CategoryCard component:
 * - Rounded pastel container for image only
 * - Subcategory/category label centered outside below the container
 */
export default function CategoryCard({ category, index = 0, className = "" }) {
  const [imgError, setImgError] = useState(false);
  const name = category.name || category.category || "Category";
  const image = category.imageUrl || empty_thumb;
  const palette = CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
  const slug = generateSlug(name);

  return (
    <Link
      to={`/listings/category/${slug}`}
      className={`group flex flex-col items-center cursor-pointer no-underline text-center select-none w-full max-w-[85px] sm:max-w-[98px] md:max-w-[106px] lg:max-w-[114px] mx-auto ${className}`}
    >
      {/* Rounded Pastel Image Box */}
      <div
        style={{
          backgroundColor: palette.bg,
          borderColor: palette.border,
        }}
        className="w-full aspect-square rounded-2xl sm:rounded-[20px] md:rounded-[22px] border border-solid flex items-center justify-center p-2.5 sm:p-3 overflow-hidden transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-sm active:scale-[0.97]"
      >
        {!imgError && image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain block select-none transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <i className="fa-solid fa-shapes text-slate-400 text-lg sm:text-xl" />
        )}
      </div>

      {/* Category Label Outside the Colored Box */}
      <div className="mt-1.5 sm:mt-2 px-0.5 w-full">
        <h3 className="font-medium sm:font-semibold text-slate-800 text-[11px] sm:text-xs md:text-[12.5px] leading-tight line-clamp-2 m-0 text-center group-hover:text-[#0f5c3e] transition-colors break-words">
          {name}
        </h3>
      </div>
    </Link>
  );
}
