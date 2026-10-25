import ToggleSwitch from "./ToggleSwitch.jsx";

// Default single slot shape
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const defaultHours = () =>
  Object.fromEntries(
    DAYS.map((d, i) => [
      d,
      {
        isClosed: i >= 5,
        slots: [{ open: "09:00", close: "18:00" }],
      },
    ])
  );

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

export default function OpenHours({ hours, onChange }) {
  // ── Toggle open/closed for a day ──────────────────────
  const toggleDay = (day) => {
    onChange(day, {
      ...hours[day],
      isClosed: !hours[day].isClosed,
    });
  };

  // ── Update a single slot field ─────────────────────────
  const updateSlot = (day, index, field, value) => {
    const newSlots = hours[day].slots.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    onChange(day, { ...hours[day], slots: newSlots });
  };

  // ── Add a new slot (default offset from last slot) ─────
  const addSlot = (day) => {
    const existing = hours[day].slots;
    const last = existing[existing.length - 1];
    onChange(day, {
      ...hours[day],
      slots: [...existing, { open: last?.close || "09:00", close: "18:00" }],
    });
  };

  // ── Remove a slot ──────────────────────────────────────
  const removeSlot = (day, index) => {
    const newSlots = hours[day].slots.filter((_, i) => i !== index);
    onChange(day, { ...hours[day], slots: newSlots });
  };

  return (
    <div className="flex flex-col border border-border rounded-xl overflow-hidden">
      {DAYS.map((day) => {

        const schedule = hours?.[day] ?? {
          isClosed: true,
          slots: [],
        };

        const isOpen = !schedule.isClosed;
        const slots = schedule.slots ?? [];

        return (
          <div key={day} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:px-[18px] sm:py-3.5 border-b border-border/60 last:border-b-0 transition-colors ${isOpen ? "bg-[#f8faff]" : "bg-white"}`}>

            {/* ── Left: toggle + day name ── */}
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <ToggleSwitch
                checked={isOpen}
                onChange={() => toggleDay(day)}
              />
              
              <span className={`text-[13.5px] transition-colors select-none ${isOpen ? "text-gray-900 font-semibold" : "text-gray-400 font-medium"}`}>
                {day}
              </span>
            </div>

            {/* ── Right: slots or closed badge ── */}
            <div className="flex items-start">
              {!isOpen ? (
                <span className="inline-flex items-center py-0.5 px-2.5 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-400">Closed</span>
              ) : (
                <div className="flex flex-col items-center sm:items-start gap-2 w-full sm:w-auto">
                  {slots?.map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={slot.open}
                          onChange={(e) => updateSlot(day, idx, "open", e.target.value)}
                          className="h-9 px-2.5 border border-border rounded-lg text-xs sm:text-[13px] font-medium text-text bg-white outline-none cursor-pointer hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all w-[100px] sm:w-[116px]"
                          aria-label={`${day} slot ${idx + 1} start time`}
                        />
                        <span className="text-sm text-slate-400 font-medium shrink-0">–</span>
                        <input
                          type="time"
                          value={slot.close}
                          onChange={(e) => updateSlot(day, idx, "close", e.target.value)}
                          className="h-9 px-2.5 border border-border rounded-lg text-xs sm:text-[13px] font-medium text-text bg-white outline-none cursor-pointer hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all w-[100px] sm:w-[116px]"
                          aria-label={`${day} slot ${idx + 1} end time`}
                        />
                      </div>

                      {/* Remove slot — only show when more than 1 slot */}
                      {slots.length > 1 && (
                        <button
                          type="button"
                          className="w-[30px] h-[30px] rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                          onClick={() => removeSlot(day, idx)}
                          aria-label={`Remove slot ${idx + 1} for ${day}`}
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add slot button */}
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 h-[30px] px-3 border border-dashed border-blue-300 rounded-lg text-blue-600 text-xs font-medium hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => addSlot(day)}
                    aria-label={`Add time slot for ${day}`}
                  >
                    <PlusIcon />
                    Add slot
                  </button>
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
