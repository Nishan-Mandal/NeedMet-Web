import { Link } from "react-router-dom";

export default function DashboardHeader({ userEmail }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/60">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs sm:text-[10px] font-bold text-purple-800 uppercase tracking-wide">
            Admin Panel
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs font-medium text-gray-500">
            {userEmail || "Admin"}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Services & Plans Management
        </h1>
        <p className="text-xs sm:text-[11px] text-gray-500 leading-relaxed">
          Manage root services, nested duration plans (1M, 3M, 6M, 1Y), EMI schedules, and deliverables.
        </p>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
        <Link
          to="/admin/plans/new"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-lg bg-[#266C51] px-5 py-2.5 sm:py-2 text-sm sm:text-sm font-bold text-white shadow-sm hover:bg-[#1f5741] transition min-h-[44px] sm:min-h-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg sm:text-base">add_circle</span>
          <span>Create New Service</span>
        </Link>
      </div>
    </div>
  );
}
