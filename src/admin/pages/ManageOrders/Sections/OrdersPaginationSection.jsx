import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OrdersPaginationSection({
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      <div className="text-xs text-slate-500">
        Showing page <span className="text-slate-800 font-bold">{page}</span> of{" "}
        <span className="text-slate-800 font-bold">{totalPages}</span> ({totalCount} transactions)
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page <= 1}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition shadow-xs cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page >= totalPages}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition shadow-xs cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
