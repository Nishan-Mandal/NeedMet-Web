import React from "react";

export default function VariantEmiSection({
  activeVariant = {},
  activeIndex = 0,
  activeCalc = {},
  onUpdateVariant,
}) {
  if (activeVariant.paymentOptions !== "BOTH" && activeVariant.paymentOptions !== "EMI") {
    return null;
  }

  const upfrontVal =
    activeVariant.upfrontValue !== undefined && activeVariant.upfrontValue !== null
      ? activeVariant.upfrontValue
      : "";
  const cyclesVal =
    activeVariant.totalCycles !== undefined && activeVariant.totalCycles !== null
      ? activeVariant.totalCycles
      : "";
  const billingDayVal =
    activeVariant.billingDay !== undefined && activeVariant.billingDay !== null && activeVariant.billingDay !== ""
      ? activeVariant.billingDay
      : 9;

  return (
    <div className="space-y-2.5 sm:space-y-2 pt-2 sm:pt-1 border-t border-gray-100">
      <div className="flex items-center gap-1.5 sm:gap-1 text-sm sm:text-xs font-bold text-gray-900">
        <span className="material-symbols-outlined text-[#266C51] text-base sm:text-sm">event_repeat</span>
        <span>Monthly EMI & Down Payment Schedule</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-2.5">
        <div className="space-y-1 sm:space-y-0.5">
          <label className="text-xs sm:text-[11px] font-medium text-gray-600">Down Payment Mode</label>
          <select
            value={activeVariant.upfrontType || "percentage"}
            onChange={(e) => onUpdateVariant(activeIndex, "upfrontType", e.target.value)}
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:px-2.5 sm:py-1 min-h-[44px] sm:min-h-[34px] text-sm sm:text-xs text-gray-900 focus:outline-none focus:border-[#266C51]"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>

        <div className="space-y-1 sm:space-y-0.5">
          <label className="text-xs sm:text-[11px] font-medium text-gray-600">
            {activeVariant.upfrontType === "percentage" ? "Upfront Value (%)" : "Upfront Value (₹)"}
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={upfrontVal}
            onChange={(e) => {
              const numeric = e.target.value.replace(/[^0-9]/g, "");
              onUpdateVariant(activeIndex, "upfrontValue", numeric);
            }}
            placeholder={activeVariant.upfrontType === "percentage" ? "e.g. 15" : "e.g. 1000"}
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:px-2.5 sm:py-1 min-h-[44px] sm:min-h-[34px] text-sm sm:text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#266C51]"
          />
        </div>

        <div className="space-y-1 sm:space-y-0.5">
          <label className="text-xs sm:text-[11px] font-medium text-gray-600">Monthly EMI Cycles</label>
          <input
            type="text"
            inputMode="numeric"
            value={cyclesVal}
            onChange={(e) => {
              const numeric = e.target.value.replace(/[^0-9]/g, "");
              onUpdateVariant(activeIndex, "totalCycles", numeric);
            }}
            placeholder="e.g. 3"
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:px-2.5 sm:py-1 min-h-[44px] sm:min-h-[34px] text-sm sm:text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#266C51]"
          />
        </div>

        <div className="space-y-1 sm:space-y-0.5">
          <label className="text-xs sm:text-[11px] font-medium text-gray-600">Billing Day (1–31)</label>
          <input
            type="number"
            min={1}
            max={31}
            value={billingDayVal}
            onChange={(e) => onUpdateVariant(activeIndex, "billingDay", e.target.value)}
            placeholder="9"
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:px-2.5 sm:py-1 min-h-[44px] sm:min-h-[34px] text-sm sm:text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#266C51]"
          />
        </div>
      </div>

      {/* EMI summary */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-1.5 sm:gap-2 rounded-xl sm:rounded-lg bg-emerald-50/40 sm:bg-gray-50 border border-emerald-100/60 sm:border-gray-100 p-2.5 sm:px-3 sm:py-1.5 text-xs">
        <span className="text-gray-600">
          Down Payment:{" "}
          <strong className="text-emerald-700 font-bold">
            ₹{Number(activeCalc.upfrontAmount || 0).toLocaleString("en-IN")}
          </strong>
        </span>
        <span className="text-gray-300 hidden sm:inline">•</span>
        <span className="text-gray-600">
          Balance:{" "}
          <strong className="text-gray-800 font-bold">
            ₹{Number(activeCalc.remainingAmount || 0).toLocaleString("en-IN")}
          </strong>
        </span>
        <span className="text-gray-300 hidden sm:inline">•</span>
        <span className="text-gray-600">
          EMI:{" "}
          <strong className="text-[#266C51] font-bold">
            ₹{Number(activeCalc.emiAmount || 0).toLocaleString("en-IN")}/mo
          </strong>{" "}
          ({activeCalc.cycles || 1} mos, {billingDayVal}th of each month)
        </span>
      </div>
    </div>
  );
}
