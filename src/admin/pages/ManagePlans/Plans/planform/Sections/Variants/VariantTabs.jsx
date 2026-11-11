import React from "react";

export default function VariantTabs({
  variants = [],
  activeIndex = 0,
  variantCalculations = [],
  onSelectVariantIndex,
  onRemoveVariant,
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-1 p-1.5 sm:p-1 bg-gray-50 rounded-xl sm:rounded-lg border border-gray-100">
      {variants.map((v, idx) => {
        const isSelected = idx === activeIndex;
        const calc = variantCalculations[idx] || {};
        const rawPrice = Number(v.price) || 0;
        const displayPrice = calc.finalPrice !== undefined ? calc.finalPrice : rawPrice;

        return (
          <div
            key={v.id || idx}
            onClick={() => onSelectVariantIndex(idx)}
            className={`group flex items-center gap-1.5 sm:gap-1.5 rounded-xl sm:rounded-md px-3.5 py-2 sm:px-2.5 sm:py-1 transition cursor-pointer text-sm sm:text-xs min-h-[38px] sm:min-h-0 ${
              isSelected
                ? "bg-[#266C51] text-white shadow-2xs font-bold"
                : "bg-white text-gray-700 border border-gray-200/60 hover:bg-gray-100 font-medium"
            }`}
          >
            <span>{v.name || v.duration || `Tier ${idx + 1}`}</span>
            <span
              className={`text-xs sm:text-[11px] ${
                isSelected ? "text-emerald-100 font-semibold" : "text-gray-500 font-normal"
              }`}
            >
              ₹{Number(displayPrice || 0).toLocaleString("en-IN")}
            </span>
            {v.tag && (
              <span
                className={`rounded-md sm:rounded px-1.5 py-0.5 sm:px-1 sm:py-0.2 text-[10px] sm:text-[9px] font-bold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {v.tag}
              </span>
            )}
            {variants.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveVariant(idx);
                }}
                className={`rounded p-1 sm:p-0.5 transition cursor-pointer -mr-1 sm:-mr-0.5 ${
                  isSelected
                    ? "hover:bg-red-500 hover:text-white text-emerald-200"
                    : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                }`}
                title="Remove this tier"
              >
                <span className="material-symbols-outlined text-sm sm:text-xs">close</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

