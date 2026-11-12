export default function PlanDatesNotesSection({
  formData,
  creatorInfo,
  onChange,
  isExpanded = true,
  onToggleExpand,
}) {
  return (
    <div className="rounded-2xl sm:rounded-xl border border-gray-200/70 bg-white p-4 sm:p-4 shadow-2xs space-y-3.5 sm:space-y-3 text-left h-full flex flex-col justify-between">
      <div className="space-y-3">
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
                  event_available
                </span>
                Availability & Dates
              </h2>
              <p className="text-xs sm:text-[11px] text-gray-500">
                Storefront window and service kickoff timelines.
              </p>
            </div>
          </button>

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

        {/* Collapsed State Preview */}
        {!isExpanded && (
          <div
            onClick={onToggleExpand}
            className="flex items-center justify-between text-xs text-gray-600 bg-gray-50/70 rounded-xl p-3 cursor-pointer hover:bg-gray-100/70 transition border border-gray-100"
          >
            <span className="font-semibold text-gray-800">
              {formData.availabilityStart || formData.availabilityEnd
                ? `${formData.availabilityStart || "Immediate"} → ${formData.availabilityEnd || "Open ended"}`
                : "No date restrictions set"}
            </span>
            <span className="text-[11px] text-[#266C51] font-bold shrink-0 ml-2">Tap to expand</span>
          </div>
        )}

        {/* Date Inputs */}
        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-2.5">
            <div className="space-y-1.5 sm:space-y-1">
              <label className="text-xs sm:text-[11px] font-bold text-gray-700">
                Availability Start
              </label>
              <input
                type="date"
                name="availabilityStart"
                value={formData.availabilityStart || ""}
                onChange={onChange}
                className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs text-gray-900 focus:border-[#266C51] focus:outline-none focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[36px]"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-1">
              <label className="text-xs sm:text-[11px] font-bold text-gray-700">
                Availability Expiry
              </label>
              <input
                type="date"
                name="availabilityEnd"
                value={formData.availabilityEnd || ""}
                onChange={onChange}
                className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs text-gray-900 focus:border-[#266C51] focus:outline-none focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[36px]"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-1 sm:col-span-2 lg:col-span-1">
              <label className="text-xs sm:text-[11px] font-bold text-gray-700">
                Service Kickoff Date
              </label>
              <input
                type="date"
                name="serviceStart"
                value={formData.serviceStart || ""}
                onChange={onChange}
                className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs text-gray-900 focus:border-[#266C51] focus:outline-none focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[36px]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Creator Attribution (single flat row, no nested box) */}
      {creatorInfo && (
        <div className="pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-1.5 text-xs sm:text-[10px] text-gray-400">
          <span>
            By: <span className="font-medium text-gray-600">{creatorInfo.creatorEmail || creatorInfo.createdBy || "Admin"}</span>
          </span>
          {creatorInfo.updatedBy && (
            <span>
              Updated: <span className="font-medium text-gray-600">{creatorInfo.updatedBy}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
