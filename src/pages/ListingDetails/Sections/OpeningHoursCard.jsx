import { TimeSlot } from '../../../data/model/listingModel.js';

/* ──────────────────────────────────────────────────────────────
   OpeningHoursCard.jsx — V2
   Premium hours table: forest green gradient header,
   today's row highlighted, robust day lookup & formatting.
   Always renders (never hides) to preserve page structure.
─────────────────────────────────────────────────────────────── */
const WEEK_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function getTodayName() {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
    } catch (_) { }
  }
  if (typeof slot === "string") return slot;
  return "";
}

export default function OpeningHoursCard({ businessHours }) {
  const today = getTodayName();

  const hasAnyConfiguredHours = businessHours && Object.keys(businessHours).length > 0;

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

  return (
    <div className="flex flex-col gap-3.5 w-full font-primary">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center text-sm">
            <i className="fa-regular fa-clock"></i>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-accent m-0">Opening Hours</h2>
        </div>
        {!hasAnyConfiguredHours && (
          <span className="text-xs text-text-secondary bg-surface border border-border px-3 py-1 rounded-full font-medium">
            Hours not specified
          </span>
        )}
      </div>

      {/* Outer Container with Individual Day Cards */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {rows.map(({ day, slots, isClosed, isToday }) => (
            <div
              key={day}
              className={`flex flex-col justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${isToday
                  ? 'bg-primary-surface border-primary text-primary shadow-sm ring-1 ring-primary/20'
                  : 'border-border bg-white shadow-sm hover:border-primary/30 hover:shadow-md'
                }`}
            >
              {/* Day Name (Top) */}
              <div className="flex items-center justify-between gap-1 mb-3">
                <span className={`text-sm font-bold font-heading ${isToday ? 'text-primary' : 'text-text'}`}>
                  {day}
                </span>
                {isToday && (
                  <span className="text-[0.62rem] font-extrabold uppercase tracking-wider text-primary bg-primary/10 border border-primary/25 px-1.5 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </div>

              {/* Time slot(s) (Bottom) */}
              <div className="mt-auto">
                {isClosed ? (
                  <span className="inline-block text-xs font-semibold text-accent-red/90 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                    Closed
                  </span>
                ) : (
                  <div className="flex flex-col gap-1">
                    {slots.map((slotText, idx) => (
                      <span
                        key={idx}
                        className={`text-xs sm:text-[0.82rem] leading-snug font-medium ${isToday ? 'text-primary font-bold' : 'text-text-secondary'
                          }`}
                      >
                        {slotText}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
