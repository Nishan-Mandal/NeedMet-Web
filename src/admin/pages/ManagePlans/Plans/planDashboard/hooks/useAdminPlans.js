import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchAdminPlans, archivePlan, publishPlan, deletePlan } from "../../../../../services/db";
import { calculateServiceMetrics, filterServicesAndPlans } from "../utils/dashboard.utils";

export default function useAdminPlans({ currentUser }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [feedback, setFeedback] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [expandedServiceIds, setExpandedServiceIds] = useState(new Set());
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminPlans();
      setPlans(data);
    } catch (err) {
      console.error("Error loading admin plans:", err);
      setFeedback({ type: "error", text: "Failed to load services and plans from database." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadPlans();
    }
  }, [currentUser, loadPlans]);

  // Toggle row expand/collapse to view all nested plans
  const toggleExpand = useCallback((serviceId) => {
    setExpandedServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }
      return next;
    });
  }, []);

  // Status transitions: publish or soft-archive
  const handleToggleStatus = useCallback(async (plan) => {
    const planId = plan.id;
    const isCurrentlyPublished = plan.status === "published";
    setActionInProgress(planId);
    setFeedback(null);

    try {
      if (isCurrentlyPublished) {
        await archivePlan(planId, currentUser);
        setFeedback({ type: "success", text: `Service "${plan.name}" archived successfully.` });
      } else {
        await publishPlan(planId, currentUser);
        setFeedback({ type: "success", text: `Service "${plan.name}" published successfully.` });
      }
      await loadPlans();
    } catch (err) {
      console.error("Error changing service status:", err);
      setFeedback({ type: "error", text: err.message || "Failed to update service status." });
    } finally {
      setActionInProgress(null);
    }
  }, [currentUser, loadPlans]);

  // Permanently delete a service and all its child plans
  const handleConfirmDelete = useCallback(async () => {
    if (!serviceToDelete) return;
    const planId = serviceToDelete.id;
    setActionInProgress(planId);
    setFeedback(null);

    try {
      await deletePlan(planId);
      setFeedback({ type: "success", text: `Service "${serviceToDelete.name}" deleted permanently.` });
      setServiceToDelete(null);
      await loadPlans();
    } catch (err) {
      console.error("Error deleting service:", err);
      setFeedback({ type: "error", text: err.message || "Failed to delete service." });
    } finally {
      setActionInProgress(null);
    }
  }, [serviceToDelete, loadPlans]);

  // Reset filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setPaymentFilter("all");
  }, []);

  // Derived metrics
  const metrics = useMemo(() => calculateServiceMetrics(plans), [plans]);

  // Filtered services
  const filteredPlans = useMemo(
    () => filterServicesAndPlans(plans, { statusFilter, paymentFilter, searchQuery }),
    [plans, statusFilter, paymentFilter, searchQuery]
  );

  return {
    plans,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    feedback,
    setFeedback,
    actionInProgress,
    expandedServiceIds,
    toggleExpand,
    serviceToDelete,
    setServiceToDelete,
    loadPlans,
    handleToggleStatus,
    handleConfirmDelete,
    handleClearFilters,
    metrics,
    filteredPlans,
  };
}

