export default function PlanEmiScheduleSection({
  formData,
  calculations,
  onChange,
}) {
  if (formData.paymentOptions !== "EMI" && formData.paymentOptions !== "BOTH") {
    return null;
  }

  const billingDayVal = formData.billingDay !== undefined && formData.billingDay !== null && formData.billingDay !== ""
    ? formData.billingDay
    : 9;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 shadow-xs space-y-5">
      <h2 className="text-sm sm:text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[#266C51] text-lg">calendar_month</span>
        5. Custom EMI & Recurring Schedule
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            inputMode="numeric"
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
            inputMode="numeric"
            name="totalCycles"
            min={1}
            max={36}
            value={formData.totalCycles}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/40 px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-[#266C51]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Monthly Billing Day (1–31)</label>
          <input
            type="number"
            name="billingDay"
            min={1}
            max={31}
            value={billingDayVal}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/40 px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-[#266C51]"
          />
          <p className="text-[11px] text-gray-500">
            Default: 9th of every month. Enforces minimum 7 calendar days lead time from upfront checkout.
          </p>
        </div>
      </div>

      {/* Real-time Schedule Breakdown */}
      <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
          Real-time Payment Schedule Breakdown
        </p>
        <div className="grid grid-cols-2 gap-2.5 text-center">
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
          Recurring auto-debits trigger on the {billingDayVal}th of every month (minimum 7-day buffer from upfront payment).
        </p>
      </div>
    </div>
  );
}
