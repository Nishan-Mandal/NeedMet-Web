import { useState, useEffect } from "react";
import { X, ExternalLink, Info } from "lucide-react";

/**
 * DetailInfoCard.jsx
 * Tabular Detailed Information with fixed card height.
 * If rows exceed the visible limit, a "See More" trigger opens a popup modal with full details.
 */
export default function DetailInfoCard({
  title = "Detailed Information",
  columns = ["Details", "Info"],
  rows = [],
  maxVisibleRows = 7,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const cleanRows = (rows || []).filter(
    (row) => Array.isArray(row) && row[0] && String(row[0]).trim() !== ""
  );

  if (!cleanRows || cleanRows.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md sm:shadow-lg p-4 sm:p-5 flex flex-col gap-3.5 w-full font-primary">
        <div className="flex items-center justify-between shrink-0 min-h-[38px]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center text-sm shrink-0">
              <i className="fa-solid fa-circle-info"></i>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-text-accent m-0 leading-tight">
              {title}
            </h2>
          </div>
        </div>

        <div className="w-full rounded-xl bg-gray-50/50 border border-border flex flex-col items-center justify-center p-6 text-center text-text-secondary">
          <Info size={28} className="text-slate-300 mb-2" />
          <p className="text-sm font-medium">No additional details provided.</p>
        </div>
      </div>
    );
  }

  const hasMore = cleanRows.length > maxVisibleRows;
  const visibleRows = hasMore ? cleanRows.slice(0, maxVisibleRows) : cleanRows;

  return (
    <>
      {/* ── Tabular Detailed Information Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md sm:shadow-lg p-4 sm:p-5 flex flex-col gap-3.5 w-full font-primary">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0 min-h-[38px]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center text-sm shrink-0">
              <i className="fa-solid fa-circle-info"></i>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-text-accent m-0 leading-tight">
              {title}
            </h2>
          </div>

          <span className="h-6 inline-flex items-center text-xs text-text-secondary bg-surface border border-border px-2.5 rounded-full font-medium leading-none">
            {cleanRows.length} {cleanRows.length === 1 ? "field" : "fields"}
          </span>
        </div>

        {/* Tabular Card Body */}
        <div className="w-full flex flex-col overflow-hidden rounded-xl bg-surface border border-border">
          <div className="w-full overflow-hidden">
            <table className="w-full border-collapse table-fixed bg-surface">
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      className={`h-10 bg-primary-surface text-primary text-xs sm:text-[0.88rem] font-bold font-heading border border-border px-3 py-2 text-center tracking-[0.02em] ${
                        index === 0 ? "w-2/5" : "w-3/5"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleRows.map(([label, value], index) => (
                  <tr
                    key={index}
                    className="hover:bg-primary/[0.025] transition-colors"
                  >
                    <td className="h-9 sm:h-10 text-xs sm:text-[0.84rem] font-semibold text-text bg-surface border border-border px-2.5 py-1.5 sm:px-3 text-center break-words capitalize">
                      {label}
                    </td>
                    <td className="h-9 sm:h-10 text-xs sm:text-[0.84rem] text-text-secondary bg-surface border border-border px-2.5 py-1.5 sm:px-3 text-center break-words truncate">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom "See More" Bar if overflow occurs */}
          {hasMore && (
            <div className="border-t border-border bg-slate-50/70 p-2 sm:p-2.5 flex items-center justify-center shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition cursor-pointer"
              >
                <span>See More ({cleanRows.length - maxVisibleRows} more details)</span>
                <ExternalLink size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Full Details Popup Modal ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] bg-surface rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:py-2 px-4 border-b border-border flex items-center justify-between bg-primary-surface/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center text-sm">
                  <i className="fa-solid fa-circle-info"></i>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-text m-0">
                    {title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                aria-label="Close details popup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Table Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="w-full overflow-hidden rounded-xl border border-border">
                <table className="w-full border-collapse table-fixed bg-surface">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      {columns.map((col, index) => (
                        <th
                          key={index}
                          className={`bg-primary-surface text-primary text-xs sm:text-sm font-bold font-heading border border-border p-3 text-center ${
                            index === 0 ? "w-2/5" : "w-3/5"
                          }`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {cleanRows.map(([label, value], index) => (
                      <tr
                        key={index}
                        className="hover:bg-primary/[0.025] transition-colors"
                      >
                        <td className="text-xs sm:text-sm font-semibold text-text bg-surface border border-border p-3 text-center break-words capitalize">
                          {label}
                        </td>
                        <td className="text-xs sm:text-sm text-text-secondary bg-surface border border-border p-3 text-center break-words leading-relaxed">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-border flex justify-end bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary-dark transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
