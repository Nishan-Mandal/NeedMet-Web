import ToggleButton from "../../../../../Components/common/ToggleButton";

const CATEGORIES = [
  "Digital Marketing",
  "Social Media",
  "Website Development",
  "Branding",
  "SEO",
  "Content Creation",
  "General",
];

export default function PlanBasicDetailsSection({
  formData,
  onChange,
  onTagSelect,
  isExpanded = true,
  onToggleExpand,
}) {
  const serviceTitle = formData.title || formData.name || "";
  const autoSlug =
    (formData.id || serviceTitle)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "service-slug";

  return (
    <div className="rounded-2xl sm:rounded-xl border border-gray-200/70 bg-white p-4 sm:p-4 shadow-2xs space-y-3.5 sm:space-y-3 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 flex-wrap gap-2">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex items-center gap-1.5 text-left group cursor-pointer"
        >
          <div className="space-y-0.5">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5 group-hover:text-[#266C51] transition">
              <span className="material-symbols-outlined text-[#266C51] text-lg sm:text-base">
                design_services
              </span>
              Service Identity & Basic Info
            </h2>
            <p className="text-xs sm:text-[11px] text-gray-500">
              Primary title, category, and storefront visibility.
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <ToggleButton
            name="isActive"
            checked={Boolean(formData.isActive)}
            onChange={onChange}
            label="Active"
            size="sm"
          />
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="inline-flex items-center justify-center h-8 w-8 sm:h-7 sm:w-7 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300 transition cursor-pointer"
              title={isExpanded ? "Collapse section" : "Expand section"}
              aria-label={isExpanded ? "Collapse section" : "Expand section"}
            >
              <span className="material-symbols-outlined text-lg sm:text-base">
                {isExpanded ? "expand_less" : "expand_more"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsed Preview */}
      {!isExpanded && (
        <div
          onClick={onToggleExpand}
          className="flex items-center justify-between text-xs text-gray-600 bg-gray-50/70 rounded-xl p-3 cursor-pointer hover:bg-gray-100/70 transition border border-gray-100"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-gray-900 truncate">
              {serviceTitle || "Untitled Service"}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600 truncate">{formData.category || "General"}</span>
            {(formData.badge || formData.tag) && (
              <span className="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.2 text-[10px] font-bold">
                {formData.badge || formData.tag}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#266C51] font-bold shrink-0 ml-2">Tap to expand</span>
        </div>
      )}

      {/* Fields Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-3">
          {/* Service Title */}
          <div className="space-y-1.5 sm:space-y-1 sm:col-span-3">
            <label className="text-xs sm:text-[11px] font-bold text-gray-700">
              Service Title *
            </label>
            <input
              type="text"
              name="title"
              value={serviceTitle}
              onChange={onChange}
              placeholder="e.g. Social Media Marketing & Management"
              required
              className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:border-[#266C51] focus:outline-none focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[36px]"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5 sm:space-y-1 sm:col-span-1">
            <label className="text-xs sm:text-[11px] font-bold text-gray-700">
              Category *
            </label>
            <select
              name="category"
              value={formData.category || "Digital Marketing"}
              onChange={onChange}
              className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs text-gray-900 focus:border-[#266C51] focus:outline-none focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[36px]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Card Badge */}
          <div className="space-y-1.5 sm:space-y-1 sm:col-span-2">
            <label className="text-xs sm:text-[11px] font-bold text-gray-700 flex items-center justify-between">
              <span>Storefront Badge</span>
              <span className="text-[11px] sm:text-[10px] text-gray-400 font-normal">Optional tag</span>
            </label>
            <input
              type="text"
              name="badge"
              value={formData.badge || formData.tag || ""}
              onChange={onChange}
              placeholder="e.g. Popular, Best Value, Trending"
              className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:border-[#266C51] focus:outline-none focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[36px]"
            />
          </div>

          {/* Route URL Preview */}
          <div className="space-y-1.5 sm:space-y-1 sm:col-span-2">
            <label className="text-xs sm:text-[11px] font-bold text-gray-700 flex items-center justify-between">
              <span>Storefront Route</span>
              <span className="text-[11px] sm:text-[10px] text-gray-400 font-normal">Auto-generated</span>
            </label>
            <div className="flex items-center rounded-xl sm:rounded-lg bg-gray-50 border border-gray-200/80 px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs text-gray-500 font-mono truncate min-h-[44px] sm:min-h-[36px]">
              <span className="text-gray-400 mr-0.5">/service/</span>
              <span className="text-[#266C51] font-semibold truncate">{autoSlug}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 sm:space-y-1 sm:col-span-4">
            <label className="text-xs sm:text-[11px] font-bold text-gray-700 flex items-center justify-between">
              <span>Service Overview</span>
              <span className="text-[11px] sm:text-[10px] text-gray-400 font-normal">
                Summary displayed on cards and detail page
              </span>
            </label>
            <textarea
              name="description"
              rows={2}
              value={formData.description || ""}
              onChange={onChange}
              placeholder="Comprehensive end-to-end service management designed to drive high-impact results..."
              className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#266C51] focus:outline-none focus:ring-1 focus:ring-[#266C51] leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
}
