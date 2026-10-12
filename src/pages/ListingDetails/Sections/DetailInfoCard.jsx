/* ──────────────────────────────────────────────────────────────
   DetailInfoCard.jsx
   Card-based detailed information using vertical space:
   Outer container with responsive grid of individual detail tiles
   (Label on top, Value below).
─────────────────────────────────────────────────────────────── */
export default function DetailInfoCard({ title = 'Detailed Information', rows = [] }) {
  if (!rows || rows.length === 0) return null;

  return (
    <div className="flex flex-col gap-3.5 w-full font-primary">
      {/* Section Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center text-sm">
          <i className="fa-solid fa-circle-info"></i>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-accent m-0">{title}</h2>
      </div>

      {/* Outer Container with Individual Detail Tiles */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {rows.map(([label, value], index) => (
            <div
              key={index}
              className="flex flex-col justify-between p-4 rounded-xl bg-white border border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              {/* Label (Top) */}
              <span className="text-[0.7rem] sm:text-xs font-bold uppercase tracking-wider text-text-secondary/80 mb-2 font-heading">
                {label}
              </span>

              {/* Value (Bottom) */}
              <span className="text-sm sm:text-[0.95rem] font-bold text-text break-words leading-snug">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
