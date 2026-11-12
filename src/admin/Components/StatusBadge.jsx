/**
 * Reusable Status Badge for Admin Entities
 */
export default function StatusBadge({ status, customLabel, size = "sm" }) {
  const norm = String(status || "").toLowerCase().trim();

  let styles = "bg-slate-100 text-slate-700 border-slate-200";
  let label = customLabel || status || "Unknown";

  if (norm === "active" || norm === "verified" || norm === "success" || norm === "published") {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
    label = customLabel || (norm === "verified" ? "Verified" : "Active");
  } else if (norm === "inactive" || norm === "unverified" || norm === "pending") {
    styles = "bg-amber-50 text-amber-700 border-amber-200";
    label = customLabel || (norm === "unverified" ? "Unverified" : "Inactive");
  } else if (norm === "claimed") {
    styles = "bg-blue-50 text-blue-700 border-blue-200";
    label = customLabel || "Claimed";
  } else if (norm === "revoked" || norm === "failed" || norm === "cancelled" || norm === "deleted") {
    styles = "bg-red-50 text-red-700 border-red-200";
    label = customLabel || (norm === "revoked" ? "Revoked" : "Failed");
  } else if (norm === "archived") {
    styles = "bg-purple-50 text-purple-700 border-purple-200";
    label = customLabel || "Archived";
  }

  const sizeClasses = size === "xs" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold capitalize rounded-full border ${sizeClasses} ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      <span>{label}</span>
    </span>
  );
}
