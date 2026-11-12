import { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import ActionHeader from "../../components/ActionHeader";
import {
  PlanGridSection,
  PlanFormModal,
} from "./Sections";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function ManagePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    price: 999,
    durationDays: 30,
    billingCycle: "monthly",
    features: [""],
    maxListings: 1,
    badgeText: "",
    isPopular: false,
    kudosBonus: 0,
  });

  const loadPlans = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await adminApi.getPlans(statusFilter);
      if (res?.success) {
        setPlans(res.plans || []);
      }
    } catch (err) {
      console.error("Error loading plans:", err);
      setErrorMsg(err.message || "Failed to load plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [statusFilter]);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      tagline: "",
      price: 999,
      durationDays: 30,
      billingCycle: "monthly",
      features: [
        "Verified Business Badge",
        "Unlimited Customer Inquiries",
        "Featured in Hyperlocal Search",
      ],
      maxListings: 1,
      badgeText: "",
      isPopular: false,
      kudosBonus: 0,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || "",
      tagline: plan.tagline || "",
      price: plan.price || 0,
      durationDays: plan.durationDays || 30,
      billingCycle: plan.billingCycle || "monthly",
      features: plan.features?.length ? [...plan.features] : [""],
      maxListings: plan.maxListings || 1,
      badgeText: plan.badgeText || "",
      isPopular: Boolean(plan.isPopular),
      kudosBonus: plan.kudosBonus || 0,
    });
    setModalOpen(true);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  const addFeatureInput = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeatureInput = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const cleanPayload = {
        ...formData,
        features: formData.features.filter((f) => f.trim() !== ""),
      };

      if (editingPlan) {
        await adminApi.updatePlan(editingPlan.id, cleanPayload);
        setSuccessMsg(`Plan "${formData.name}" updated successfully.`);
      } else {
        await adminApi.createPlan(cleanPayload);
        setSuccessMsg(`Plan "${formData.name}" created and published.`);
      }
      setModalOpen(false);
      await loadPlans();
    } catch (err) {
      console.error("Plan submit error:", err);
      setErrorMsg(err.message || "Failed to save subscription plan.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setErrorMsg("");
      const nextStatus = currentStatus === "active" ? "inactive" : "active";
      await adminApi.togglePlanStatus(id, nextStatus);
      setPlans((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
      );
    } catch (err) {
      console.error("Plan status toggle error:", err);
      setErrorMsg(err.message || "Failed to toggle plan status.");
    }
  };

  const handleArchive = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to archive "${name}"? Historical subscriber records will be preserved.`
      )
    ) {
      return;
    }
    try {
      setErrorMsg("");
      await adminApi.archivePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      setSuccessMsg(`Plan "${name}" archived safely.`);
    } catch (err) {
      console.error("Plan archive error:", err);
      setErrorMsg(err.message || "Failed to archive plan.");
    }
  };

  return (
    <div className="space-y-6 w-full font-primary">
      {/* Unified Action & Filter Toolbar */}
      <ActionHeader
        filters={["all", "active", "inactive"]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onRefresh={loadPlans}
        refreshing={loading}
        actionLabel="Create New Plan"
        onActionClick={handleOpenCreate}
      />

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            className="text-red-500 hover:text-red-800 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#e8f5ee] border border-[#d1fae5] text-[#0f5c3e] text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg("")}
            className="text-[#0f5c3e] hover:opacity-75 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Plan Cards Grid Section */}
      <PlanGridSection
        loading={loading}
        plans={plans}
        onToggleStatus={handleToggleStatus}
        onEdit={handleOpenEdit}
        onArchive={handleArchive}
      />

      {/* Create / Edit Modal Section */}
      <PlanFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingPlan={editingPlan}
        actionLoading={actionLoading}
        onFeatureChange={handleFeatureChange}
        onAddFeature={addFeatureInput}
        onRemoveFeature={removeFeatureInput}
      />
    </div>
  );
}
