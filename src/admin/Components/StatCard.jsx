/**
 * Reusable Admin Analytics & Metrics Card
 */
export default function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  badgeText,
  badgeType = "neutral", // 'success', 'warning', 'info', 'neutral'
  className = "",
}) {
  const badgeStyles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div
      className={`p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-[#e8f5ee] text-[#0f5c3e] border border-[#d1fae5] flex items-center justify-center shrink-0">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
          {value ?? "—"}
        </div>
        {badgeText && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyles[badgeType] || badgeStyles.neutral}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-2 truncate leading-tight">
          {subtitle}
        </p>
      )}
    </div>
  );
}
