import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import useAdminPlans from "./hooks/useAdminPlans";

import ActionHeader from "../../../../components/ActionHeader";
import DashboardMetricsSection from "./Sections/DashboardMetricsSection";
import DesktopPlansTable from "./Sections/DesktopPlansTable";
import MobilePlansList from "./Sections/MobilePlansList";
import DeleteServiceModal from "./Sections/DeleteServiceModal";
import ClonePlanModal from "./Sections/ClonePlanModal";
import { CheckCircle2, AlertCircle, X, SearchX } from "lucide-react";

export default function AdminPlansDashboard() {
  const { currentUser, isAdmin, isStaff, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [planToClone, setPlanToClone] = useState(null);

  // Security guard: Only admins or staff can view
  useEffect(() => {
    if (!authLoading && (!currentUser || (!isAdmin && !isStaff))) {
      navigate("/login?redirect=/admin/plans");
    }
  }, [currentUser, isAdmin, isStaff, authLoading, navigate]);

  const {
    loading,
    searchQuery,
    actionInProgress,
    statusFilter,
    paymentFilter,
    feedback,
    expandedServiceIds,
    serviceToDelete,
    setPaymentFilter,
    setFeedback,
    setStatusFilter,
    setSearchQuery,
    toggleExpand,
    handleToggleStatus,
    handleConfirmDelete,
    handleClearFilters,
    setServiceToDelete,
    loadPlans,
    metrics,
    filteredPlans,
  } = useAdminPlans({ currentUser });

  // Consume feedback from navigation state (e.g. after cloning or creating a plan)
  useEffect(() => {
    if (location.state?.feedback) {
      setFeedback(location.state.feedback);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setFeedback]);

  const handleConfirmClone = () => {
    if (!planToClone) return;
    const cloneId = planToClone.id;
    setPlanToClone(null);
    navigate(`/admin/plans/new?cloneFrom=${cloneId}`);
  };

  const hasActiveFilters = Boolean(
    searchQuery || statusFilter !== "all" || paymentFilter !== "all"
  );

  const filterTabs = [
    { label: "All Services", value: "all", count: metrics?.totalServices || 0 },
    { label: "Published", value: "published", count: metrics?.published || 0 },
    { label: "Draft", value: "draft", count: metrics?.draft || 0 },
    ...(metrics?.archived ? [{ label: "Archived", value: "archived", count: metrics.archived }] : []),
  ];

  return (
    <div className="space-y-6 w-full font-primary">
      {/* Unified Action & Filter Toolbar using ActionHeader */}
      <ActionHeader
        filters={filterTabs}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        searchPlaceholder="Search service, plan, or category..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={loadPlans}
        refreshing={loading}
        actionLabel="Create Service"
        actionTo="/admin/plans/new"
      >
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="bg-white border border-slate-200/90 rounded-full px-3.5 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0f5c3e] cursor-pointer shadow-xs"
        >
          <option value="all">All Payments</option>
          <option value="BOTH">Full & EMI</option>
          <option value="EMI">EMI Only</option>
          <option value="FULL">Full Only</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition cursor-pointer"
          >
            Reset
          </button>
        )}
      </ActionHeader>

      {/* Alerts */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-[#e8f5ee] border-[#d1fae5] text-[#0f5c3e]"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 size={16} className="shrink-0" />
            ) : (
              <AlertCircle size={16} className="shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs uppercase font-bold opacity-70 hover:opacity-100 cursor-pointer p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <DashboardMetricsSection metrics={metrics} />

      {/* Plans Table / Cards Container */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-10 sm:p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-[#0f5c3e] border-t-transparent" />
            <p className="mt-3 text-sm sm:text-xs font-semibold text-slate-500">
              Loading services and plans...
            </p>
          </div>
        ) : filteredPlans.length > 0 ? (
          <div>
            {/* Desktop Table View (lg screens and above) */}
            <DesktopPlansTable
              plans={filteredPlans}
              expandedServiceIds={expandedServiceIds}
              onToggleExpand={toggleExpand}
              onToggleStatus={handleToggleStatus}
              onDeleteClick={setServiceToDelete}
              onCloneClick={setPlanToClone}
              actionInProgress={actionInProgress}
            />

            {/* Mobile / Tablet Cards View (screens below lg) */}
            <MobilePlansList
              plans={filteredPlans}
              expandedServiceIds={expandedServiceIds}
              onToggleExpand={toggleExpand}
              onToggleStatus={handleToggleStatus}
              onDeleteClick={setServiceToDelete}
              onCloneClick={setPlanToClone}
              actionInProgress={actionInProgress}
            />
          </div>
        ) : (
          <div className="p-10 sm:p-12 text-center space-y-2">
            <SearchX size={36} className="mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-800">No services found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              No services or duration plans matched your search or filter parameters.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteServiceModal
        service={serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={Boolean(actionInProgress)}
      />

      {/* Clone Confirmation Modal */}
      <ClonePlanModal
        service={planToClone}
        onClose={() => setPlanToClone(null)}
        onConfirm={handleConfirmClone}
      />
    </div>
  );
}
