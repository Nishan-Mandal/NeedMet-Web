import { useState, useEffect } from "react";
import { TimeSlot } from "../../../data/model/listingModel.js";
import { X, ExternalLink, Clock } from "lucide-react";

const WEEK_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getTodayName() {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[new Date().getDay()];
}

function getDayDetails(businessHours, dayName) {
  if (!businessHours) return null;
  if (businessHours[dayName]) return businessHours[dayName];
  const lower = dayName.toLowerCase();
  for (const [key, val] of Object.entries(businessHours)) {
    if (key.toLowerCase() === lower || key.toLowerCase().startsWith(lower.slice(0, 3))) {
      return val;
    }
  }
  return null;
}

function formatSlot(slot) {
  if (!slot) return "";
  if (typeof slot.to12Hour === "function") return slot.to12Hour();
  if (slot.open && slot.close) {
    try {
      return TimeSlot.fromJson(slot).to12Hour();
    } catch (_) {}
  }
  if (typeof slot === "string") return slot;
  return "";
}

/**
 * OpeningHoursCard.jsx
 * Tabular Opening Hours (Day | Hours) with matching fixed height.
 * Features:
 * - Tabular grid structure matching Detailed Information
 * - Today highlighted with visual badge
 * - Popup modal to view complete schedule details
 */
export default function OpeningHoursCard({ businessHours }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = getTodayName();

  const hasAnyConfiguredHours =
    businessHours && Object.keys(businessHours).length > 0;

  const rows = WEEK_ORDER.map((day) => {
    const details = getDayDetails(businessHours, day);
    const isToday = day === today;

    if (!details || details.isClosed) {
      return { day, slots: [], isClosed: true, isToday };
    }

    const rawSlots = details.slots || [];
    const formattedSlots = rawSlots.map(formatSlot).filter(Boolean);

    if (formattedSlots.length === 0) {
      return { day, slots: [], isClosed: true, isToday };
    }

    return { day, slots: formattedSlots, isClosed: false, isToday };
  });

  // Close modal on Escape
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

  // Today's hours status text
  const todayRow = rows.find((r) => r.isToday);
  const todayStatus = todayRow
    ? todayRow.isClosed
      ? "Closed Today"
      : `Open Today: ${todayRow.slots.join(", ")}`
    : "";

  return (
    <>
      {/* ── Tabular Opening Hours Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md sm:shadow-lg p-4 sm:p-5 flex flex-col gap-3.5 w-full font-primary">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0 min-h-[38px]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center text-sm shrink-0">
              <i className="fa-regular fa-clock"></i>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-text-accent m-0 leading-tight">
              Opening Hours
            </h2>
          </div>

          <span
            className={`h-6 inline-flex items-center text-xs px-2.5 rounded-full font-medium leading-none ${
              todayRow?.isClosed
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {todayRow?.isClosed ? "Closed Today" : "Open Today"}
          </span>
        </div>

        {/* Tabular Card Body */}
        <div className="w-full flex flex-col overflow-hidden rounded-xl bg-surface border border-border">
          <div className="w-full overflow-hidden">
            <table className="w-full border-collapse table-fixed bg-surface">
              <thead>
                <tr>
                  <th className="h-10 bg-primary-surface text-primary text-xs sm:text-[0.88rem] font-bold font-heading border border-border px-3 py-2 text-center tracking-[0.02em] w-2/5">
                    Day
                  </th>
                  <th className="h-10 bg-primary-surface text-primary text-xs sm:text-[0.88rem] font-bold font-heading border border-border px-3 py-2 text-center tracking-[0.02em] w-3/5">
                    Hours
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map(({ day, slots, isClosed, isToday }) => (
                  <tr
                    key={day}
                    className={`transition-colors ${
                      isToday
                        ? "bg-primary/[0.06] font-bold"
                        : "hover:bg-primary/[0.025]"
                    }`}
                  >
                    <td className="h-9 sm:h-10 text-xs sm:text-[0.84rem] font-semibold text-text bg-surface border border-border px-2.5 py-1.5 sm:px-3 text-center break-words">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={isToday ? "text-primary font-bold" : "text-text"}>
                          {day}
                        </span>
                        {isToday && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-1 py-0.2 rounded-full leading-none">
                            Today
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="h-9 sm:h-10 text-xs sm:text-[0.84rem] bg-surface border border-border px-2.5 py-1.5 sm:px-3 text-center break-words">
                      {isClosed ? (
                        <span className="inline-block text-[11px] font-semibold text-accent-red/90 bg-red-50 px-2 py-0.5 rounded border border-red-100 leading-none">
                          Closed
                        </span>
                      ) : (
                        <span
                          className={`font-medium ${
                            isToday ? "text-primary font-bold" : "text-text-secondary"
                          }`}
                        >
                          {slots.join(", ")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Action Bar */}
          <div className="border-t border-border bg-slate-50/70 p-2 sm:p-2.5 flex items-center justify-center shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition cursor-pointer"
            >
              <span>View Full Details Popup</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Full Opening Hours Popup Modal ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-xl max-h-[85vh] bg-surface rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-primary-surface/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center text-sm">
                  <Clock size={16} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-text m-0">
                    Weekly Opening Hours
                  </h3>
                  <p className="text-xs text-text-secondary m-0">
                    {todayStatus || "Complete business operation timetable"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                aria-label="Close hours popup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="w-full overflow-hidden rounded-xl border border-border">
                <table className="w-full border-collapse table-fixed bg-surface">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="bg-primary-surface text-primary text-xs sm:text-sm font-bold font-heading border border-border p-3 text-center w-2/5">
                        Day
                      </th>
                      <th className="bg-primary-surface text-primary text-xs sm:text-sm font-bold font-heading border border-border p-3 text-center w-3/5">
                        Operating Hours
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map(({ day, slots, isClosed, isToday }) => (
                      <tr
                        key={day}
                        className={`transition-colors ${
                          isToday
                            ? "bg-primary/[0.06] font-bold"
                            : "hover:bg-primary/[0.025]"
                        }`}
                      >
                        <td className="text-xs sm:text-sm font-semibold text-text bg-surface border border-border p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className={isToday ? "text-primary font-bold" : "text-text"}>
                              {day}
                            </span>
                            {isToday && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/25 px-1.5 py-0.5 rounded-full">
                                Today
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="text-xs sm:text-sm bg-surface border border-border p-3 text-center break-words">
                          {isClosed ? (
                            <span className="inline-block text-xs font-semibold text-accent-red/90 bg-red-50 px-2.5 py-0.5 rounded border border-red-100">
                              Closed
                            </span>
                          ) : (
                            <span
                              className={`font-medium ${
                                isToday ? "text-primary font-bold" : "text-text-secondary"
                              }`}
                            >
                              {slots.join(", ")}
                            </span>
                          )}
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
