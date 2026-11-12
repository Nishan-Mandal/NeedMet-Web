import React, { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ActionHeader, KpiCard } from "../../components";
import { adminApi } from "../../services/adminApi";
import { ReviewsTableSection, ReviewDetailModal } from "./Sections";
import {
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Clock,
  XCircle,
  Star,
} from "lucide-react";

export default function ManageReviews() {
  const queryClient = useQueryClient();
  const [reviews, setReviews] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const invalidateHomepageTestimonials = () => {
    try {
      localStorage.removeItem("needmet_approved_reviews_cache_v1");
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      }
      window.dispatchEvent(new CustomEvent("needmet:reviews_changed"));
    } catch (e) {
      console.warn("Could not invalidate testimonials cache:", e);
    }
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await adminApi.getReviews(statusFilter, searchQuery);
      if (res?.success) {
        setReviews(res.reviews || []);
        if (res.counts) setCounts(res.counts);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setErrorMsg(err.message || "Failed to load reviews from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setActionLoadingId(id);
      setErrorMsg("");
      await adminApi.updateReviewStatus(id, newStatus);

      // Update state locally
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );

      if (selectedReview?.id === id) {
        setSelectedReview((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      // Invalidate frontend cache immediately
      invalidateHomepageTestimonials();

      setSuccessMsg(`Review status updated to "${newStatus}".`);
      setTimeout(() => setSuccessMsg(""), 3000);

      // Reload counts
      loadReviews();
    } catch (err) {
      console.error("Failed to update status:", err);
      setErrorMsg(err.message || "Failed to update review status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) {
      return;
    }

    try {
      setActionLoadingId(id);
      setErrorMsg("");
      await adminApi.deleteReview(id);

      setReviews((prev) => prev.filter((r) => r.id !== id));
      if (selectedReview?.id === id) {
        setSelectedReview(null);
      }

      invalidateHomepageTestimonials();

      setSuccessMsg("Review deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
      loadReviews();
    } catch (err) {
      console.error("Failed to delete review:", err);
      setErrorMsg(err.message || "Failed to delete review.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredReviews = useMemo(() => {
    if (!searchQuery.trim()) return reviews;
    const q = searchQuery.trim().toLowerCase();
    return reviews.filter(
      (r) =>
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.review && r.review.toLowerCase().includes(q)) ||
        (r.quote && r.quote.toLowerCase().includes(q)) ||
        (r.location && r.location.toLowerCase().includes(q))
    );
  }, [reviews, searchQuery]);

  const filterTabs = [
    { value: "all", label: "All Reviews", count: counts.total },
    { value: "approved", label: "Approved (Live)", count: counts.approved },
    { value: "pending", label: "Pending", count: counts.pending },
    { value: "rejected", label: "Rejected", count: counts.rejected },
  ];

  const kpiCards = [
    {
      id: "total",
      title: "Total Reviews",
      value: counts.total,
      icon: MessageSquare,
      variant: "slate",
      subtitle: "All customer submissions",
    },
    {
      id: "approved",
      title: "Live on Homepage",
      value: counts.approved,
      icon: CheckCircle2,
      variant: "emerald",
      subtitle: "Published testimonials",
    },
    {
      id: "pending",
      title: "Pending Moderation",
      value: counts.pending,
      icon: Clock,
      variant: "amber",
      subtitle: "Awaiting staff review",
    },
    {
      id: "rejected",
      title: "Rejected",
      value: counts.rejected,
      icon: XCircle,
      variant: "rose",
      subtitle: "Declined testimonials",
    },
  ];

  return (
    <div className="w-full space-y-6 font-primary">
      {/* ── Top KPI Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <KpiCard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            variant={kpi.variant}
            loading={loading}
            subtitle={kpi.subtitle}
          />
        ))}
      </div>

      {/* ── Alerts ── */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg("")}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-2 animate-in shake">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            className="text-rose-600 hover:text-rose-800 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Action Header (Filters & Search) ── */}
      <ActionHeader
        filters={filterTabs}
        activeFilter={statusFilter}
        onFilterChange={(val) => setStatusFilter(val)}
        searchPlaceholder="Search reviewer, quote, location..."
        searchValue={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        onRefresh={loadReviews}
        refreshing={loading}
      />

      {/* ── Reviews Table Section ── */}
      <ReviewsTableSection
        reviews={filteredReviews}
        loading={loading}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        actionLoadingId={actionLoadingId}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onInspect={(rev) => setSelectedReview(rev)}
      />

      {/* ── Inspect Review Modal ── */}
      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          actionLoading={actionLoadingId === selectedReview.id}
        />
      )}
    </div>
  );
}
