import { Search, RefreshCw, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";


export default function ActionHeader({
  filters = [],
  activeFilter,
  onFilterChange,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  onRefresh,
  refreshing = false,
  actionLabel,
  actionIcon: ActionIcon = Plus,
  onActionClick,
  actionTo,
  children,
  className = "",
}) {
  const showSearch = typeof onSearchChange === "function";

  const handleSearchInput = (e) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const handleClearSearch = () => {
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  return (
    <div
      className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-3 ${className}`}
    >
      {/* ── Left Side: Filter Tabs ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0">
        {filters.map((filter) => {
          const isObj = typeof filter === "object" && filter !== null;
          const value = isObj ? filter.value : filter;
          const label = isObj ? filter.label : filter;
          const count = isObj ? filter.count : undefined;
          const isSelected = activeFilter === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange && onFilterChange(value)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold capitalize transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? "bg-[#0f5c3e] text-white border border-[#0f5c3e] font-bold shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80"
              }`}
            >
              <span>{label}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-white/25 text-white font-bold"
                      : "bg-slate-100 text-slate-500 font-medium"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Right Side: Search Bar + Refresh + Action Buttons ── */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between md:justify-end shrink-0">
        {/* Search Input */}
        {showSearch && (
          <div className="relative w-full sm:w-64 md:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchInput}
              className="w-full bg-white border border-slate-200/90 rounded-full pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0f5c3e] focus:ring-1 focus:ring-[#0f5c3e]/20 transition shadow-xs"
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-md transition cursor-pointer"
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
        )}

        {/* Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="p-2 sm:p-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-[#0f5c3e] border border-slate-200/90 transition cursor-pointer disabled:opacity-50 shrink-0 box-shadow"
            title="Refresh records"
            aria-label="Refresh records"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin text-[#0f5c3e]" : ""}
            />
          </button>
        )}

        {/* Primary Action Button (Link or Button) */}
        {actionTo ? (
          <Link
            to={actionTo}
            className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-[#0f5c3e] hover:bg-[#1a8a5a] text-white font-bold text-xs sm:text-sm box-shadow transition cursor-pointer shrink-0"
          >
            <ActionIcon size={16} />
            <span>{actionLabel}</span>
          </Link>
        ) : actionLabel && onActionClick ? (
          <button
            type="button"
            onClick={onActionClick}
            className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-[#0f5c3e] hover:bg-[#1a8a5a] text-white font-bold text-xs sm:text-sm box-shadow transition cursor-pointer shrink-0"
          >
            <ActionIcon size={16} />
            <span>{actionLabel}</span>
          </button>
        ) : null}

        {/* Additional custom actions if provided */}
        {children}
      </div>
    </div>
  );
}

// Named alias for convenience
export { ActionHeader as FilterSearchHeader };
