import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * Color presets for KPI Card icon containers and accent styling
 */
const COLOR_VARIANTS = {
  primary: {
    iconBg: "bg-[#e8f5ee] text-[#0f5c3e] border-[#d1fae5]",
    valueColor: "text-slate-900 group-hover:text-[#0f5c3e]",
    borderHover: "hover:border-[#0f5c3e]/40",
    badge: "bg-[#e8f5ee] text-[#0f5c3e] border-[#d1fae5]",
  },
  emerald: {
    iconBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    valueColor: "text-emerald-700",
    borderHover: "hover:border-emerald-300",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  blue: {
    iconBg: "bg-blue-50 text-blue-600 border-blue-100",
    valueColor: "text-blue-600",
    borderHover: "hover:border-blue-300",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  amber: {
    iconBg: "bg-amber-50 text-amber-600 border-amber-100",
    valueColor: "text-amber-600",
    borderHover: "hover:border-amber-300",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  rose: {
    iconBg: "bg-rose-50 text-rose-600 border-rose-100",
    valueColor: "text-rose-600",
    borderHover: "hover:border-rose-300",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
  indigo: {
    iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
    valueColor: "text-indigo-600",
    borderHover: "hover:border-indigo-300",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  teal: {
    iconBg: "bg-teal-50 text-teal-700 border-teal-100",
    valueColor: "text-teal-700",
    borderHover: "hover:border-teal-300",
    badge: "bg-teal-50 text-teal-700 border-teal-200",
  },
  purple: {
    iconBg: "bg-purple-50 text-purple-600 border-purple-100",
    valueColor: "text-purple-600",
    borderHover: "hover:border-purple-300",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  slate: {
    iconBg: "bg-slate-100 text-slate-700 border-slate-200",
    valueColor: "text-slate-900",
    borderHover: "hover:border-slate-300",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

/**
 * Reusable KPI Card Component for NeedMet Admin
 * Supports standalone cards, links, custom icon variants, trend indicators, badges, and skeleton loading.
 */
export default function KpiCard({
  title,
  label, // alias for title
  value,
  subtitle,
  subValue, // alias for subtitle
  icon: Icon,
  variant = "slate",
  color, // alias for variant
  valueColor,
  trend, // { value: string|number, direction: 'up'|'down'|'neutral', label?: string }
  badgeText,
  badgeType,
  to,
  onClick,
  loading = false,
  className = "",
}) {
  const displayTitle = title || label;
  const displaySubtitle = subtitle || subValue;
  const activeVariantKey = (color || variant || "slate").toLowerCase();
  const theme = COLOR_VARIANTS[activeVariantKey] || COLOR_VARIANTS.slate;

  // Resolve Value styling
  const computedValueColor = valueColor || theme.valueColor;

  const content = (
    <>
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 line-clamp-1">
          {displayTitle}
        </span>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${theme.iconBg}`}
          >
            <Icon size={19} />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-auto">
        {loading ? (
          <div className="h-8 w-24 bg-slate-200 animate-pulse rounded-lg mt-1" />
        ) : (
          <div
            className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight transition-colors ${computedValueColor}`}
          >
            {value !== undefined && value !== null ? value : "—"}
          </div>
        )}

        {badgeText && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
              badgeType && COLOR_VARIANTS[badgeType]
                ? COLOR_VARIANTS[badgeType].badge
                : theme.badge
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Trend indicator or secondary subtitle */}
      {(trend || displaySubtitle) && (
        <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-100 text-xs text-slate-500">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-bold shrink-0 ${
                trend.direction === "up"
                  ? "text-emerald-600"
                  : trend.direction === "down"
                  ? "text-rose-600"
                  : "text-slate-500"
              }`}
            >
              {trend.direction === "up" && <TrendingUp size={13} />}
              {trend.direction === "down" && <TrendingDown size={13} />}
              {trend.direction === "neutral" && <Minus size={13} />}
              {trend.value}
            </span>
          )}
          {displaySubtitle && (
            <span className="truncate leading-tight">
              {displaySubtitle}
            </span>
          )}
        </div>
      )}
    </>
  );

  const baseClasses = `group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs transition-all duration-200 flex flex-col justify-between ${
    to ? `cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${theme.borderHover}` : ""
  } ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {content}
    </div>
  );
}

