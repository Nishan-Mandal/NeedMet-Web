import React from "react";
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Trash2,
  Eye,
  Check,
  User,
  MessageSquare,
  MapPin,
} from "lucide-react";

export default function ReviewsTableSection({
  reviews = [],
  loading = false,
  searchQuery = "",
  statusFilter = "all",
  actionLoadingId = null,
  onStatusChange,
  onDelete,
  onInspect,
}) {
  if (loading) {
    return (
      <div className="p-16 text-center rounded-2xl bg-white border border-slate-200/80 shadow-xs text-slate-400 text-sm animate-pulse">
        <div className="inline-block w-7 h-7 border-2 border-[#0f5c3e] border-t-transparent rounded-full animate-spin mb-3" />
        <p>Loading customer reviews from Firestore...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="p-16 text-center rounded-2xl bg-white border border-slate-200/80 shadow-xs text-slate-500">
        <MessageSquare size={44} className="mx-auto mb-3 text-slate-300" />
        <p className="font-bold text-slate-800 text-base">No Reviews Found</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          {searchQuery
            ? `No reviews match "${searchQuery}". Try refining your query.`
            : statusFilter === "all"
            ? "No customer reviews have been recorded in the system yet."
            : `No reviews found with status "${statusFilter}".`}
        </p>
      </div>
    );
  }

  const statusBadges = {
    approved: {
      bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: CheckCircle2,
      label: "Live on Web",
    },
    pending: {
      bg: "bg-amber-50 text-amber-800 border-amber-200",
      icon: Clock,
      label: "Pending Moderation",
    },
    rejected: {
      bg: "bg-rose-50 text-rose-800 border-rose-200",
      icon: XCircle,
      label: "Rejected",
    },
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-[#f7faf8] text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200/80 font-bold">
          <tr>
            <th className="px-5 py-3.5">Reviewer</th>
            <th className="px-5 py-3.5">Rating</th>
            <th className="px-5 py-3.5 min-w-[280px]">Review / Feedback</th>
            <th className="px-5 py-3.5">Date</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {reviews.map((review) => {
            const isActing = actionLoadingId === review.id;
            const isApproved = review.status === "approved";
            const isPending = review.status === "pending";
            const isRejected = review.status === "rejected";

            const badgeConfig =
              statusBadges[review.status] || statusBadges.pending;
            const StatusIcon = badgeConfig.icon;

            return (
              <tr
                key={review.id}
                className="hover:bg-[#e8f5ee]/25 transition duration-150"
              >
                {/* 1. Reviewer */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a8a5a] to-[#0f5c3e] text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
                        {review.name?.trim()?.slice(0, 2).toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate">
                        {review.name || "Anonymous User"}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 truncate">
                        {review.location ? (
                          <span className="flex items-center gap-0.5">
                            <MapPin size={10} className="shrink-0" />
                            {review.location}
                          </span>
                        ) : (
                          <span>Verified User</span>
                        )}
                        {review.role && <span>• {review.role}</span>}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Rating */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={13}
                          className={
                            star <= (review.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {review.rating || 5}
                    </span>
                  </div>
                </td>

                {/* 3. Review Content */}
                <td className="px-5 py-4">
                  <div
                    onClick={() => onInspect && onInspect(review)}
                    className="cursor-pointer group/quote"
                    title="Click to view full review in modal"
                  >
                    <p className="text-xs text-slate-700 italic font-serif leading-relaxed line-clamp-2 group-hover/quote:text-[#0f5c3e] transition-colors">
                      &ldquo;{review.review || review.quote || review.text}&rdquo;
                    </p>
                    <span className="text-[10px] text-slate-400 group-hover/quote:text-[#0f5c3e] font-sans font-semibold mt-0.5 inline-block">
                      Read more →
                    </span>
                  </div>
                </td>

                {/* 4. Date */}
                <td className="px-5 py-4 text-xs whitespace-nowrap text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-slate-400 shrink-0" />
                    <span>
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "Recent"}
                    </span>
                  </div>
                </td>

                {/* 5. Status Badge */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeConfig.bg}`}
                  >
                    <StatusIcon size={12} />
                    <span>{badgeConfig.label}</span>
                  </span>
                </td>

                {/* 6. Actions */}
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Approve button */}
                    {!isApproved && (
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => onStatusChange(review.id, "approved")}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0f5c3e] hover:bg-[#1a8a5a] text-white text-xs font-semibold transition cursor-pointer shadow-2xs disabled:opacity-50"
                        title="Approve for Homepage Display"
                      >
                        <Check size={13} />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Hold / Unapprove */}
                    {isApproved && (
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => onStatusChange(review.id, "pending")}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                        title="Move back to pending queue"
                      >
                        <RotateCcw size={13} />
                        <span>Hold</span>
                      </button>
                    )}

                    {/* Reject */}
                    {!isRejected && (
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => onStatusChange(review.id, "rejected")}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                        title="Reject review"
                      >
                        <XCircle size={13} />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Inspect / View Full Details */}
                    <button
                      type="button"
                      onClick={() => onInspect && onInspect(review)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#0f5c3e] hover:bg-[#e8f5ee] transition cursor-pointer"
                      title="Inspect full details"
                    >
                      <Eye size={15} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      disabled={isActing}
                      onClick={() => onDelete(review.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer disabled:opacity-50"
                      title="Permanently delete review"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

