export default function DashboardFiltersSection({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  paymentFilter,
  onPaymentFilterChange,
  onClear,
}) {
  const hasActiveFilters = Boolean(searchQuery || statusFilter !== "all" || paymentFilter !== "all");

  return (
    <div className="rounded-2xl sm:rounded-xl border border-gray-200/70 bg-white p-3.5 sm:p-3 shadow-2xs space-y-3 sm:space-y-0">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 sm:left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-base">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search service, plan, or category..."
            className="w-full rounded-xl sm:rounded-lg border border-gray-200 bg-gray-50/50 pl-9 sm:pl-8 pr-3.5 py-2.5 sm:py-1.5 text-sm sm:text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#266C51] min-h-[44px] sm:min-h-[36px]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3 py-2.5 sm:px-2.5 sm:py-1.5 text-sm sm:text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#266C51] min-h-[44px] sm:min-h-[36px]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => onPaymentFilterChange(e.target.value)}
            className="rounded-xl sm:rounded-lg border border-gray-200 bg-white px-3 py-2.5 sm:px-2.5 sm:py-1.5 text-sm sm:text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#266C51] min-h-[44px] sm:min-h-[36px]"
          >
            <option value="all">All Payments</option>
            <option value="BOTH">Full & EMI</option>
            <option value="EMI">EMI Only</option>
            <option value="FULL">Full Only</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="col-span-2 sm:col-span-1 inline-flex items-center justify-center rounded-xl sm:rounded-lg px-3 py-2.5 sm:py-1.5 text-sm sm:text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 min-h-[44px] sm:min-h-0 transition cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
