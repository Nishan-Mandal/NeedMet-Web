
import { useState } from "react";

const FEATURE_ICONS = [
  "verified",
  "check_circle",
  "star",
  "analytics",
  "trending_up",
  "videocam",
  "smart_display",
  "brush",
  "code",
  "language",
  "campaign",
  "chat",
  "support_agent",
  "shield",
];

export default function PlanFeaturesSection({
  features = [],
  featureMode = "structured",
  onToggleMode,
  bulkFeaturesText,
  onBulkFeaturesTextChange,
  onApplyBulkFeatures,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 shadow-xs space-y-5">
      <div className={`flex items-center justify-between ${!isCollapsed ? "border-b border-gray-100 pb-3" : ""}`}>
        <div className="space-y-0.5">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#266C51] text-lg">checklist</span>
            3. Deliverables & Features
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              {features.length} Item{features.length === 1 ? "" : "s"}
            </span>
          </h2>
          <p className="text-xs text-text-secondary">
            Feature items displayed in the pricing table and customer cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <>
              <button
                type="button"
                onClick={onToggleMode}
                className="text-xs font-semibold text-[#266C51] hover:underline cursor-pointer"
              >
                {featureMode === "structured" ? "Bulk Paste Mode" : "Card Mode"}
              </button>
              {featureMode === "structured" && (
                <button
                  type="button"
                  onClick={onAddFeature}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#266C51] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1f5741] transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Item
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            title={isCollapsed ? "Expand Deliverables Section" : "Collapse Deliverables Section"}
          >
            <span className="material-symbols-outlined text-base">
              {isCollapsed ? "expand_more" : "expand_less"}
            </span>
            <span>{isCollapsed ? "Expand" : "Collapse"}</span>
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {featureMode === "structured" ? (
        <div className="space-y-3">
          {features.map((feat, idx) => (
            <div
              key={`${idx}-${feat.title}`}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 rounded-xl border border-gray-200/80 bg-gray-50/50 p-3"
            >
              {/* Icon selector */}
              <select
                value={feat.icon || "check_circle"}
                onChange={(e) => onUpdateFeature(idx, "icon", e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
              >
                {FEATURE_ICONS.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>

              {/* Feature Title */}
              <input
                type="text"
                value={feat.title}
                onChange={(e) => onUpdateFeature(idx, "title", e.target.value)}
                placeholder="Feature title (e.g. 2 Weekly Video Posts)"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#266C51]"
              />

              {/* Feature Short Description */}
              <input
                type="text"
                value={feat.desc}
                onChange={(e) => onUpdateFeature(idx, "desc", e.target.value)}
                placeholder="Short description (optional)"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#266C51]"
              />

              {/* Delete */}
              <button
                type="button"
                onClick={() => onRemoveFeature(idx)}
                className="rounded-lg p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          ))}

          {features.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-4">
              No features added. Click "Add Item" to add deliverables.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            rows={6}
            value={bulkFeaturesText}
            onChange={(e) => onBulkFeaturesTextChange(e.target.value)}
            placeholder="Profile Setup: Professional setup and branding&#10;Weekly Reports: Real-time analytics report"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/40 p-3 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#266C51]"
          />
          <button
            type="button"
            onClick={onApplyBulkFeatures}
            className="rounded-xl bg-[#266C51] px-4 py-2 text-xs font-bold text-white hover:bg-[#1f5741] transition cursor-pointer"
          >
            Apply Bulk Features
          </button>
        </div>
      )}
        </>
      )}
    </div>
  );
}
