import styles from "../style/OpenHours.module.css";
import { ToggleSwitch } from "../components";

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
    <div className={styles.hoursGrid}>
      {DAYS.map((day) => {

        const schedule = hours?.[day] ?? {
          isClosed: true,
          slots: [],
        };

        const isOpen = !schedule.isClosed;
        const slots = schedule.slots ?? [];

        return (
          <div key={day} className={`${styles.dayRow} ${isOpen ? styles.dayRowOpen : ""}`}>

            {/* ── Left: toggle + day name ── */}
            <div className={styles.dayLeft}>
              {/* <button
                type="button"
                role="switch"
                aria-checked={open}
                aria-label={`${open ? "Close" : "Open"} ${day}`}
                className={`${styles.toggle} ${open ? styles.toggleOn : ""}`}
                onClick={() => toggleDay(day)}
              >
                <span className={styles.toggleThumb} />
              </button> */}

              <ToggleSwitch
                checked={isOpen}
                onChange={() => toggleDay(day)}
              />
              
              <span className={`${styles.dayName} ${isOpen ? styles.dayNameActive : ""}`}>
                {day}
              </span>
            </div>

            {/* ── Right: slots or closed badge ── */}
            <div className={styles.dayRight}>
              {!isOpen ? (
                <span className={styles.closedBadge}>Closed</span>
              ) : (
                <div className={styles.slotsWrap}>
                  {slots?.map((slot, idx) => (
                    <div key={idx} className={styles.slotRow}>
                      <div className={styles.slotInputs}>
                        <input
                          type="time"
                          value={slot.open}
                          onChange={(e) => updateSlot(day, idx, "open", e.target.value)}
                          className={styles.timeInput}
                          aria-label={`${day} slot ${idx + 1} start time`}
                        />
                        <span className={styles.timeSep}>–</span>
                        <input
                          type="time"
                          value={slot.close}
                          onChange={(e) => updateSlot(day, idx, "close", e.target.value)}
                          className={styles.timeInput}
                          aria-label={`${day} slot ${idx + 1} end time`}
                        />
                      </div>

                      {/* Remove slot — only show when more than 1 slot */}
                      {slots.length > 1 && (
                        <button
                          type="button"
                          className={styles.removeSlot}
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
                    className={styles.addSlot}
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