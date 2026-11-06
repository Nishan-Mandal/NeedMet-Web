export default function DashboardMetricsSection({ metrics }) {
  const {
    totalServices = 0,
    totalPlans = 0,
    published = 0,
    draft = 0,
  } = metrics || {};

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="rounded-2xl sm:rounded-xl border border-gray-200/70 bg-white p-3.5 sm:p-3.5 shadow-2xs">
        <p className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-gray-500">
          Total Services
        </p>
        <p className="mt-1 text-2xl sm:text-xl font-bold text-gray-900">{totalServices}</p>
      </div>

      <div className="rounded-2xl sm:rounded-xl border border-purple-200/70 bg-purple-50/40 p-3.5 sm:p-3.5 shadow-2xs">
        <p className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-purple-800">
          Duration Plans
        </p>
        <p className="mt-1 text-2xl sm:text-xl font-bold text-purple-800">{totalPlans}</p>
      </div>

      <div className="rounded-2xl sm:rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-3.5 sm:p-3.5 shadow-2xs">
        <p className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-emerald-800">
          Storefront Published
        </p>
        <p className="mt-1 text-2xl sm:text-xl font-bold text-emerald-800">{published}</p>
      </div>

      <div className="rounded-2xl sm:rounded-xl border border-amber-200/70 bg-amber-50/40 p-3.5 sm:p-3.5 shadow-2xs">
        <p className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-amber-800">
          Draft / Inactive
        </p>
        <p className="mt-1 text-2xl sm:text-xl font-bold text-amber-800">{draft}</p>
      </div>
    </div>
  );
}
