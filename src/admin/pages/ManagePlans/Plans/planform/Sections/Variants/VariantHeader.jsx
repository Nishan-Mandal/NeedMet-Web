import React from "react";
import { DURATION_PRESETS } from "../../utils/planForm.utils";

export default function VariantHeader({
  variantsCount = 0,
  onAddPresetVariant,
  onAddCustomVariant,
  isExpanded = true,
  onToggleExpand,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-100">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex items-center gap-1.5 text-left group cursor-pointer"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#266C51] text-lg sm:text-base">
                calendar_month
              </span>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#266C51] transition">
                Service Plans & Pricing
              </h2>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 sm:py-0.2 text-xs sm:text-[10px] font-bold text-emerald-800">
                {variantsCount} Tier{variantsCount === 1 ? "" : "s"}
              </span>
            </div>
            <p className="text-xs sm:text-[11px] text-gray-500">
              Duration options (1M, 3M, 6M, 1Y) and pricing under this service.
            </p>
          </div>
        </button>

        {onToggleExpand && (
          <button
            type="button"
            onClick={onToggleExpand}
            className="sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer shrink-0 ml-2"
            title={isExpanded ? "Collapse section" : "Expand section"}
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            <span className="material-symbols-outlined text-lg">
              {isExpanded ? "expand_less" : "expand_more"}
            </span>
          </button>
        )}
      </div>

      {/* QUICK PRESET BUTTONS + Desktop expand/collapse */}
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-1 pt-1 sm:pt-0">
          <span className="text-xs sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-0.5">
            + Add:
          </span>
          {DURATION_PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => onAddPresetVariant(preset.key)}
              className="inline-flex items-center gap-1 sm:gap-0.5 rounded-lg sm:rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 sm:px-1.5 sm:py-0.5 text-xs sm:text-[11px] font-semibold text-gray-700 hover:border-[#266C51] hover:text-[#266C51] hover:bg-emerald-50/40 transition min-h-[34px] sm:min-h-0 cursor-pointer"
              title={`Add ${preset.duration} tier`}
            >
              <span className="material-symbols-outlined text-sm sm:text-xs">add</span>
              <span>{preset.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onAddCustomVariant}
            className="inline-flex items-center gap-1 sm:gap-0.5 rounded-lg sm:rounded-md border border-dashed border-gray-300 bg-gray-50/50 px-2.5 py-1.5 sm:px-1.5 sm:py-0.5 text-xs sm:text-[11px] font-semibold text-gray-600 hover:border-[#266C51] hover:text-[#266C51] transition min-h-[34px] sm:min-h-0 cursor-pointer"
            title="Add custom duration tier"
          >
            <span className="material-symbols-outlined text-sm sm:text-xs">more_time</span>
            <span>Custom</span>
          </button>
        </div>

        {onToggleExpand && (
          <button
            type="button"
            onClick={onToggleExpand}
            className="hidden sm:inline-flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300 transition cursor-pointer shrink-0"
            title={isExpanded ? "Collapse section" : "Expand section"}
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            <span className="material-symbols-outlined text-base">
              {isExpanded ? "expand_less" : "expand_more"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
