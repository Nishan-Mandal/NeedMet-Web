import React from "react";
import {
  X,
  Star,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Trash2,
  MapPin,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function ReviewDetailModal({
  review,
  onClose,
  onStatusChange,
  onDelete,
  actionLoading = false,
}) {
  if (!review) return null;

  const isApproved = review.status === "approved";
  const isPending = review.status === "pending";
  const isRejected = review.status === "rejected";

  const statusStyles = {
    approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    rejected: "bg-rose-50 text-rose-800 border-rose-200",
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#f7faf8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0f5c3e] border border-emerald-200 flex items-center justify-center">
              <Star size={16} className="fill-[#0f5c3e]" />
            </div>
            <div>
              <h3 className="font-bold font-display text-slate-900 text-sm sm:text-base">
                Customer Testimonial Details
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                ID: {review.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-primary">
          {/* Reviewer Profile */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#f7faf8] border border-slate-200/80">
            <div className="flex items-center gap-3">
              {review.avatar ? (
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a8a5a] to-[#0f5c3e] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {review.name?.trim()?.slice(0, 2).toUpperCase() || "U"}
                </div>
              )}
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  {review.name || "Anonymous Reviewer"}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  {review.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      {review.location}
                    </span>
                  )}
                  {review.role && (
                    <span className="text-slate-400 font-medium">
                      • {review.role}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border capitalize shrink-0 ${
                statusStyles[review.status] || statusStyles.pending
              }`}
            >
              {isApproved && <CheckCircle2 size={12} />}
              {isPending && <Clock size={12} />}
              {isRejected && <XCircle size={12} />}
              <span>{review.status}</span>
            </span>
          </div>

          {/* Rating */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Rating
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= (review.rating || 5)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">
                {review.rating || 5} out of 5 stars
              </span>
            </div>
          </div>

          {/* Feedback Message */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Review Quote & Feedback
            </span>
            <blockquote className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed italic font-serif">
              &ldquo;{review.review || review.quote || review.text}&rdquo;
            </blockquote>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3">
            <div>
              <span className="text-slate-400">User Account ID:</span>
              <p className="font-mono text-slate-700 truncate mt-0.5">
                {review.userId || "N/A (Public submission)"}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Submission Date:</span>
              <p className="font-semibold text-slate-700 mt-0.5">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#f7faf8] border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => {
              if (window.confirm("Permanently delete this review from Firestore?")) {
                onDelete(review.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            {!isApproved && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  onStatusChange(review.id, "approved");
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f5c3e] hover:bg-[#1a8a5a] text-white text-xs font-semibold transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Check size={14} />
                <span>Approve for Homepage</span>
              </button>
            )}

            {isApproved && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  onStatusChange(review.id, "pending");
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={14} />
                <span>Hold (Pending)</span>
              </button>
            )}

            {!isRejected && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  onStatusChange(review.id, "rejected");
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              >
                <XCircle size={14} />
                <span>Reject</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

