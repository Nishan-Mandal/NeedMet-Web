import React from "react";

export default function VariantPricingSection({
  activeVariant = {},
  activeIndex = 0,
  activeCalc = {},
  onUpdateVariant,
}) {
  const priceVal =
    activeVariant.price !== undefined && activeVariant.price !== null
      ? activeVariant.price
      : "";
  const discountVal =
    activeVariant.discountAmount !== undefined && activeVariant.discountAmount !== null
      ? activeVariant.discountAmount
      : "";

  return (
    <div className="border-t border-gray-100 pt-3 sm:pt-2.5 space-y-3 sm:space-y-2.5">
      <div className="flex items-center gap-1.5 text-sm sm:text-xs font-bold text-gray-900">
        <span className="material-symbols-outlined text-[#266C51] text-base sm:text-sm">payments</span>
        <span>Pricing & Payment Modes</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-2.5">
        <div className="space-y-1.5 sm:space-y-1">
          <label className="text-xs sm:text-[11px] font-bold text-gray-700">Base Price (₹) *</label>
          <input
            type="text"
            inputMode="numeric"
            value={priceVal}
            onChange={(e) => {
              const numeric = e.target.value.replace(/[^0-9]/g, "");
              onUpdateVariant(activeIndex, "price", numeric);
            }}
            placeholder="e.g. 3999"
            required
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs font-bold text-gray-900 focus:outline-none focus:border-[#266C51] focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[34px]"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-1">
          <label className="text-xs sm:text-[11px] font-bold text-gray-700">Discount (₹)</label>
          <input
            type="text"
            inputMode="numeric"
            value={discountVal}
            onChange={(e) => {
              const numeric = e.target.value.replace(/[^0-9]/g, "");
              onUpdateVariant(activeIndex, "discountAmount", numeric);
            }}
            placeholder="e.g. 500"
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs text-gray-900 focus:outline-none focus:border-[#266C51] focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[34px]"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-1">
          <label className="text-xs sm:text-[11px] font-bold text-gray-700">Payable Price</label>
          <div className="flex items-center justify-between rounded-xl sm:rounded-lg bg-emerald-50/70 border border-emerald-200/70 px-3.5 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-[34px]">
            <span className="text-sm sm:text-xs font-black text-emerald-800">
              ₹{Number(activeCalc.finalPrice || 0).toLocaleString("en-IN")}
            </span>
            {activeCalc.discountPercent > 0 && (
              <span className="rounded-md sm:rounded bg-emerald-200 px-1.5 py-0.5 sm:px-1 sm:py-0.2 text-[10px] sm:text-[9px] font-bold text-emerald-900">
                {activeCalc.discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-1">
          <label className="text-xs sm:text-[11px] font-bold text-gray-700">Payment Modes</label>
          <select
            value={activeVariant.paymentOptions || "BOTH"}
            onChange={(e) => onUpdateVariant(activeIndex, "paymentOptions", e.target.value)}
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs text-gray-900 focus:outline-none focus:border-[#266C51] focus:ring-1 focus:ring-[#266C51] min-h-[44px] sm:min-h-[34px]"
          >
            <option value="BOTH">Full & Monthly EMI</option>
            <option value="EMI">EMI Only</option>
            <option value="FULL">Full Payment Only</option>
          </select>
        </div>
      </div>
    </div>
  );
}
