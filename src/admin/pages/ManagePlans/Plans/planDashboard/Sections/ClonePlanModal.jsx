export default function ClonePlanModal({
  service,
  onClose,
  onConfirm,
}) {
  if (!service) return null;

  const childPlansCount = (service.plans || service.variants || []).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full rounded-2xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-left border border-gray-100 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl sm:rounded-full bg-emerald-100 text-[#266C51]">
            <span className="material-symbols-outlined text-2xl sm:text-xl">content_copy</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Clone Plan?</h3>
            <p className="text-xs text-gray-500">Create a new plan starting from this configuration.</p>
          </div>
        </div>

        <p className="text-sm sm:text-xs text-gray-600 leading-relaxed">
          You are about to clone <strong className="text-gray-900 font-semibold">"{service.name}"</strong>
          {childPlansCount > 0 ? ` (${childPlansCount} duration ${childPlansCount === 1 ? "tier" : "tiers"})` : ""}.
          The plan creation form will be prefilled with all its settings. You can edit any field before saving it as a completely new plan without affecting the original.
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-2 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl sm:rounded-lg border border-gray-200 bg-white px-4 py-2.5 sm:py-1.5 text-sm sm:text-xs font-semibold text-gray-700 hover:bg-gray-50 transition min-h-[44px] sm:min-h-0 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl sm:rounded-lg bg-[#266C51] px-5 py-2.5 sm:py-1.5 text-sm sm:text-xs font-bold text-white shadow-xs hover:bg-[#1f5741] transition min-h-[44px] sm:min-h-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base sm:text-sm">arrow_forward</span>
            <span>Confirm & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
