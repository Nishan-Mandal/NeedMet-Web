import React from "react";
import ToggleButton from "../../../../../../Components/common/ToggleButton";

const PRESET_TAGS = [
  "Popular",
  "Best Value",
  "Recommended",
  "Trending",
  "Best Seller",
  "Saver",
  "Exclusive",
];

export default function VariantIdentitySection({
  activeVariant = {},
  activeIndex = 0,
  onUpdateVariant,
  onDuplicateVariant,
}) {
  const durationDaysVal =
    activeVariant.durationDays !== undefined && activeVariant.durationDays !== null
      ? activeVariant.durationDays
      : "";

  return (
    <div className="space-y-3.5 sm:space-y-3">
      {/* Tier Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-100">
        <div className="flex items-center gap-1.5 text-sm sm:text-xs flex-wrap">
          <span className="font-bold text-gray-900">
            Editing:{" "}
            <span className="text-[#266C51]">
              {activeVariant.name || activeVariant.duration || `Tier ${activeIndex + 1}`}
            </span>
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 text-xs sm:text-[11px]">
            {activeVariant.duration || "Custom"} ({durationDaysVal || 0} days)
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ToggleButton
            checked={Boolean(activeVariant.isActive)}
            onChange={(e) =>
              onUpdateVariant(activeIndex, "isActive", e.target.checked)
            }
            label="Active"
            size="sm"
          />
          <button
            type="button"
            onClick={() => onDuplicateVariant(activeIndex)}
            className="inline-flex items-center gap-1 rounded-lg sm:rounded-md border border-gray-200 bg-white px-3 py-1.5 sm:px-2 sm:py-0.5 text-xs sm:text-[11px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition min-h-[36px] sm:min-h-0 cursor-pointer"
            title="Duplicate this plan tier"
          >
            <span className="material-symbols-outlined text-sm sm:text-xs">content_copy</span>
            <span>Duplicate</span>
          </button>
        </div>
      </div>

      {/* Identification & Duration Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2.5">
        <div className="space-y-1.5 sm:space-y-1">
          <label className="text-xs sm:text-[11px] font-bold text-gray-700">Tier Name *</label>
          <input
            type="text"
            value={activeVariant.name || ""}
            onChange={(e) => onUpdateVariant(activeIndex, "name", e.target.value)}
            placeholder="e.g. Starter-3M"
            required
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#266C51] focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[34px]"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-1">
          <label className="text-xs sm:text-[11px] font-bold text-gray-700">Duration Label *</label>
          <input
            type="text"
            value={activeVariant.duration || ""}
            onChange={(e) => onUpdateVariant(activeIndex, "duration", e.target.value)}
            placeholder="e.g. 3 Months"
            required
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs text-gray-900 focus:outline-none focus:border-[#266C51] focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[34px]"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-1">
          <label className="text-xs sm:text-[11px] font-bold text-gray-700">Duration Days *</label>
          <input
            type="text"
            inputMode="numeric"
            value={durationDaysVal}
            onChange={(e) => {
              const numeric = e.target.value.replace(/[^0-9]/g, "");
              onUpdateVariant(activeIndex, "durationDays", numeric);
            }}
            placeholder="e.g. 90"
            required
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs text-gray-900 focus:outline-none focus:border-[#266C51] focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[34px]"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-1">
          <label className="text-xs sm:text-[11px] font-bold text-gray-700">Category Tier</label>
          <select
            value={activeVariant.planType || "3 Months"}
            onChange={(e) => onUpdateVariant(activeIndex, "planType", e.target.value)}
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs text-gray-900 focus:outline-none focus:border-[#266C51] focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[34px]"
          >
            <option value="1 Month">1 Month</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="1 Year">1 Year</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {/* Badge Tag with Presets */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center gap-1.5 pt-1 sm:pt-0.5">
          <span className="text-xs sm:text-[11px] font-bold text-gray-700 mr-1">Badge:</span>
          <input
            type="text"
            value={activeVariant.tag || ""}
            onChange={(e) => onUpdateVariant(activeIndex, "tag", e.target.value)}
            placeholder="e.g. Popular"
            className="w-28 sm:w-24 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 sm:px-2 sm:py-0.5 text-sm sm:text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#266C51] min-h-[36px] sm:min-h-0"
          />
          {PRESET_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onUpdateVariant(activeIndex, "tag", t)}
              className={`rounded-lg sm:rounded px-2.5 py-1.5 sm:px-1.5 sm:py-0.5 text-xs sm:text-[10px] font-semibold transition min-h-[32px] sm:min-h-0 cursor-pointer ${
                activeVariant.tag === t
                  ? "bg-[#266C51] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
          {activeVariant.tag && (
            <button
              type="button"
              onClick={() => onUpdateVariant(activeIndex, "tag", "")}
              className="text-gray-400 hover:text-gray-600 text-xs sm:text-[10px] px-1.5 py-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
