
export default function PlanPricingSection({
  formData,
  calculations,
  onChange,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
      {/* 1. Base Pricing */}
      <div>
        <h2 className="text-sm sm:text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#266C51] text-lg">payments</span>
          4. Pricing & Payment Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Original Base Price (₹) *</label>
            <input
              type="text"
              name="price"
              min={0}
              value={formData.price}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50/40 px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-[#266C51]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Discount Amount (₹)</label>
            <input
              type="text"
              name="discountAmount"
              min={0}
              value={formData.discountAmount}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/40 px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-[#266C51]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Final Customer Price</label>
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2.5">
              <span className="text-sm font-black text-emerald-800">
                ₹{calculations.finalPrice.toLocaleString("en-IN")}
              </span>
              {calculations.discountPercent > 0 && (
                <span className="rounded-md bg-emerald-200/80 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900">
                  {calculations.discountPercent}% OFF
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Combined EMI & Recurring Schedule */}
      <div className="border-t border-gray-100 pt-5 space-y-4">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#266C51] text-base">calendar_month</span>
            EMI & Recurring Schedule
          </h3>
          <p className="text-[11px] text-text-secondary">
            Configure down payment authorization and monthly recurring cycles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Upfront Down Payment Type</label>
            <select
              name="upfrontType"
              value={formData.upfrontType}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/40 px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#266C51]"
            >
              <option value="percentage">Percentage of Total (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">
              {formData.upfrontType === "percentage" ? "Upfront Percentage (%)" : "Upfront Fixed Amount (₹)"}
            </label>
            <input
              type="text"
              name="upfrontValue"
              min={1}
              value={formData.upfrontValue}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/40 px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-[#266C51]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Number of Installment Months</label>
            <input
              type="text"
              name="totalCycles"
              min={1}
              max={36}
              value={formData.totalCycles}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/40 px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-[#266C51]"
            />
          </div>
        </div>

        {/* Real-time Schedule Breakdown */}
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
            Payment Schedule Breakdown
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-xl bg-white p-3 shadow-2xs border border-gray-200/70">
              <p className="text-[11px] text-gray-500 font-medium">Upfront Down Payment</p>
              <p className="text-base font-black text-emerald-700 mt-0.5">
                ₹{calculations.upfrontAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-2xs border border-gray-200/70">
              <p className="text-[11px] text-gray-500 font-medium">Remaining Principal</p>
              <p className="text-base font-black text-gray-800 mt-0.5">
                ₹{calculations.remainingAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-2xs border border-gray-200/70">
              <p className="text-[11px] text-gray-500 font-medium">Monthly Debit</p>
              <p className="text-base font-black text-[#266C51] mt-0.5">
                ₹{calculations.emiAmount.toLocaleString("en-IN")} / mo
              </p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-2xs border border-gray-200/70">
              <p className="text-[11px] text-gray-500 font-medium">EMI Duration</p>
              <p className="text-base font-black text-gray-800 mt-0.5">
                {calculations.cycles} Months
              </p>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 text-center">
            First recurring auto-debit triggers 30 days after the upfront payment authorization.
          </p>
        </div>
      </div>
    </div>
  );
}
