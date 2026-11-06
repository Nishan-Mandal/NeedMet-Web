import React, { useState } from "react";
import { parseBulkFeatures } from "../../utils/planForm.utils";

const FEATURE_ICONS = [
  "check_circle",
  "verified",
  "star",
  "analytics",
  "trending_up",
  "videocam",
  "smart_display",
  "brush",
  "code",
  "campaign",
  "support_agent",
  "shield",
  "palette",
  "image",
];

export default function VariantFeaturesSection({
  activeVariant = {},
  activeIndex = 0,
  variants = [],
  onAddVariantFeature,
  onUpdateVariantFeature,
  onRemoveVariantFeature,
  onApplyVariantBulkFeatures,
  onCopyFeatures,
}) {
  const [featureModeMap, setFeatureModeMap] = useState({});
  const [bulkTextMap, setBulkTextMap] = useState({});

  const isBulkMode = featureModeMap[activeIndex] === "bulk";
  const bulkText =
    bulkTextMap[activeIndex] !== undefined
      ? bulkTextMap[activeIndex]
      : (activeVariant.features || [])
          .map((f) => (f.desc ? `${f.title}: ${f.desc}` : f.title))
          .join("\n");

  const handleBulkChange = (txt) => {
    setBulkTextMap((p) => ({ ...p, [activeIndex]: txt }));
  };

  const handleApplyBulk = () => {
    const parsed = parseBulkFeatures(bulkText);
    onApplyVariantBulkFeatures(activeIndex, parsed);
    setFeatureModeMap((p) => ({ ...p, [activeIndex]: "structured" }));
  };

  const toggleFeatureMode = () => {
    if (!isBulkMode) {
      setBulkTextMap((p) => ({
        ...p,
        [activeIndex]: (activeVariant.features || [])
          .map((f) => (f.desc ? `${f.title}: ${f.desc}` : f.title))
          .join("\n"),
      }));
      setFeatureModeMap((p) => ({ ...p, [activeIndex]: "bulk" }));
    } else {
      setFeatureModeMap((p) => ({ ...p, [activeIndex]: "structured" }));
    }
  };

  return (
    <div className="border-t border-gray-100 pt-3 sm:pt-2.5 space-y-2.5 sm:space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#266C51] text-base sm:text-sm">checklist</span>
          <span className="text-sm sm:text-xs font-bold text-gray-900">
            Deliverables for {activeVariant.name || activeVariant.duration || `Tier ${activeIndex + 1}`}
          </span>
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 sm:px-1.5 sm:py-0.2 text-xs sm:text-[10px] font-bold text-emerald-800">
            {(activeVariant.features || []).length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {variants.length > 1 && (
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-[10px] text-gray-500 sm:text-gray-400">Copy:</span>
              <select
                onChange={(e) => {
                  if (e.target.value !== "") {
                    onCopyFeatures(activeIndex, Number(e.target.value));
                    e.target.value = "";
                  }
                }}
                defaultValue=""
                className="rounded-lg sm:rounded-md border border-gray-200 bg-white px-2 py-1.5 sm:px-1.5 sm:py-0.5 text-xs sm:text-[10px] font-medium text-gray-700 min-h-[36px] sm:min-h-0"
              >
                <option value="" disabled>From tier...</option>
                {variants.map((v, i) => (
                  i !== activeIndex && (
                    <option key={i} value={i}>
                      {v.name || v.duration || `Tier ${i + 1}`} ({(v.features || []).length})
                    </option>
                  )
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={toggleFeatureMode}
            className="text-xs sm:text-[11px] font-semibold text-[#266C51] hover:underline cursor-pointer py-1 px-1"
          >
            {isBulkMode ? "List View" : "Bulk Paste"}
          </button>

          {!isBulkMode && (
            <button
              type="button"
              onClick={() => onAddVariantFeature(activeIndex)}
              className="inline-flex items-center gap-1 rounded-lg sm:rounded-md bg-[#266C51] px-3 py-1.5 sm:px-2 sm:py-0.5 min-h-[36px] sm:min-h-0 text-xs sm:text-[11px] font-bold text-white hover:bg-[#1f5741] transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm sm:text-xs">add</span>
              <span>Add Item</span>
            </button>
          )}
        </div>
      </div>

      {/* List Mode / Bulk Mode */}
      {isBulkMode ? (
        <div className="space-y-2 sm:space-y-1.5">
          <p className="text-xs sm:text-[10px] text-gray-500 sm:text-gray-400">
            One deliverable per line. Format: <code className="text-[#266C51] font-semibold">Title: Description</code>
          </p>
          <textarea
            rows={4}
            value={bulkText}
            onChange={(e) => handleBulkChange(e.target.value)}
            placeholder="Weekly Reports: Delivered every week.&#10;Social Calendar: 30-day planned posts."
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-gray-50/50 p-3 sm:p-2 font-mono text-sm sm:text-xs text-gray-800 min-h-[100px] sm:min-h-0 focus:bg-white focus:outline-none focus:border-[#266C51]"
          />
          <button
            type="button"
            onClick={handleApplyBulk}
            className="rounded-xl sm:rounded-md bg-[#266C51] px-4 py-2.5 sm:px-2.5 sm:py-1 min-h-[44px] sm:min-h-0 text-sm sm:text-xs font-bold text-white hover:bg-[#1f5741] transition cursor-pointer"
          >
            Apply Deliverables
          </button>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-1">
          {(activeVariant.features || []).map((feat, fIdx) => (
            <div
              key={fIdx}
              className="p-2.5 sm:p-0 rounded-xl sm:rounded-none border border-gray-200/80 sm:border-0 bg-gray-50/60 sm:bg-transparent space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-1.5 sm:py-0.5"
            >
              {/* Row 1 on mobile: Icon Select + Title + Delete Button */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                {/* Compact Icon */}
                <select
                  value={feat.icon || "check_circle"}
                  onChange={(e) => onUpdateVariantFeature(activeIndex, fIdx, "icon", e.target.value)}
                  className="w-20 sm:w-16 rounded-xl sm:rounded-md border border-gray-200 bg-white px-2 py-2 sm:px-1 sm:py-1 min-h-[42px] sm:min-h-0 text-xs text-gray-700 focus:outline-none shrink-0"
                >
                  {FEATURE_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>

                {/* Title */}
                <input
                  type="text"
                  value={feat.title || ""}
                  onChange={(e) => onUpdateVariantFeature(activeIndex, fIdx, "title", e.target.value)}
                  placeholder="Deliverable title"
                  required
                  className="flex-1 sm:w-60 rounded-xl sm:rounded-md border border-gray-200 bg-white px-3 py-2 sm:px-2 sm:py-1 min-h-[42px] sm:min-h-0 text-sm sm:text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#266C51]"
                />

                {/* Delete button (mobile only here) */}
                <button
                  type="button"
                  onClick={() => onRemoveVariantFeature(activeIndex, fIdx)}
                  className="sm:hidden rounded-xl p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer shrink-0 min-h-[42px] min-w-[42px] flex items-center justify-center border border-gray-200 bg-white"
                  title="Remove deliverable"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              {/* Description */}
              <input
                type="text"
                value={feat.desc || ""}
                onChange={(e) => onUpdateVariantFeature(activeIndex, fIdx, "desc", e.target.value)}
                placeholder="Scope details (optional)"
                className="w-full sm:flex-1 sm:min-w-0 rounded-xl sm:rounded-md border border-gray-200 bg-white px-3 py-2 sm:px-2 sm:py-1 min-h-[42px] sm:min-h-0 text-sm sm:text-xs text-gray-600 focus:outline-none focus:border-[#266C51]"
              />

              {/* Delete button (desktop only) */}
              <button
                type="button"
                onClick={() => onRemoveVariantFeature(activeIndex, fIdx)}
                className="hidden sm:inline-flex rounded p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer shrink-0"
                title="Remove deliverable"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </div>
          ))}

          {(activeVariant.features || []).length === 0 && (
            <div className="rounded-xl sm:rounded-lg border border-dashed border-gray-200 py-4 sm:py-3 text-center">
              <p className="text-sm sm:text-xs text-gray-400">No deliverables added yet for this tier.</p>
              <button
                type="button"
                onClick={() => onAddVariantFeature(activeIndex)}
                className="mt-2 sm:mt-1 inline-flex items-center gap-1 rounded-xl sm:rounded-md bg-[#266C51] px-3 py-2 sm:px-2 sm:py-0.5 text-xs font-semibold text-white hover:bg-[#1f5741] transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm sm:text-xs">add</span>
                <span>Add Deliverable</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
