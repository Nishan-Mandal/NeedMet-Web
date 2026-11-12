import React, { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ActionHeader from "../../components/ActionHeader";
import {
  PartnerTableSection,
  PartnerFormModal,
  PartnerOrbitalPreviewSection,
} from "./Sections";
import { adminApi } from "../../services/adminApi";
import {
  CheckCircle2,
  AlertCircle,
  X,
  List,
  Eye,
} from "lucide-react";

export default function ManagePartners() {
  const queryClient = useQueryClient();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" | "preview"

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    isActive: true,
  });

  const invalidateHomepageCache = () => {
    try {
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ["partners"] });
      }
    } catch (e) {
      console.warn("Could not invalidate partners query cache:", e);
    }
  };

  const loadPartners = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await adminApi.getPartners(statusFilter);
      if (res?.success) {
        setPartners(res.partners || []);
      }
    } catch (err) {
      console.error("Error loading partners:", err);
      setErrorMsg(err.message || "Failed to load partners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, [statusFilter]);

  const handleOpenCreate = () => {
    setEditingPartner(null);
    setFormData({
      name: "",
      logo: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name || "",
      logo: partner.logo || "",
      isActive: partner.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (editingPartner) {
        await adminApi.updatePartner(editingPartner.id, formData);
        setSuccessMsg(`Partner "${formData.name}" successfully updated.`);
      } else {
        await adminApi.createPartner(formData);
        setSuccessMsg(`Partner "${formData.name}" created and added to orbit.`);
      }
      setIsModalOpen(false);
      invalidateHomepageCache();
      await loadPartners();
    } catch (err) {
      console.error("Error saving partner:", err);
      setErrorMsg(err.message || "Failed to save partner.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setErrorMsg("");
      await adminApi.togglePartner(id, currentStatus);
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !currentStatus } : p))
      );
      invalidateHomepageCache();
      setSuccessMsg("Partner visibility updated.");
    } catch (err) {
      console.error("Error toggling partner status:", err);
      setErrorMsg(err.message || "Failed to update partner status.");
    }
  };

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${name}" from the partner network?`
      )
    ) {
      return;
    }

    try {
      setErrorMsg("");
      await adminApi.deletePartner(id);
      setPartners((prev) => prev.filter((p) => p.id !== id));
      invalidateHomepageCache();
      setSuccessMsg(`Partner "${name}" removed.`);
    } catch (err) {
      console.error("Error deleting partner:", err);
      setErrorMsg(err.message || "Failed to delete partner.");
    }
  };

  // Reorder Handler: Move Up / Down
  const handleMove = async (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= partners.length) return;

    const reordered = [...partners];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update local state immediately for snappy feel
    setPartners(reordered);

    try {
      await adminApi.reorderPartners(reordered);
      invalidateHomepageCache();
    } catch (err) {
      console.error("Reorder failed:", err);
      setErrorMsg("Failed to persist new partner order.");
      await loadPartners();
    }
  };

  // Filter and search
  const filteredPartners = useMemo(() => {
    let result = partners;

    if (statusFilter === "active") {
      result = result.filter((p) => p.isActive !== false);
    } else if (statusFilter === "inactive") {
      result = result.filter((p) => p.isActive === false);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [partners, statusFilter, searchQuery]);

  return (
    <div className="space-y-5 w-full font-primary">
      {/* ── Action & Filter Header ── */}
      <ActionHeader
        filters={[
          { label: "All Partners", value: "all", count: partners.length },
          { label: "Active on Homepage", value: "active", count: partners.filter((p) => p.isActive !== false).length },
          { label: "Hidden", value: "inactive", count: partners.filter((p) => p.isActive === false).length },
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        searchPlaceholder="Search partner name..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={loadPartners}
        refreshing={loading}
        actionLabel="Add Partner"
        onActionClick={handleOpenCreate}
      />

      {/* ── View Switcher Pills: Table Directory vs Live Orbital Network Preview ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/70 w-fit">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List size={14} />
            <span>Table Directory</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "preview"
                ? "bg-white text-[#0f5c3e] shadow-2xs"
                : "text-slate-600 hover:text-[#0f5c3e]"
            }`}
          >
            <Eye size={14} />
            <span>Live Marquee Preview</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Showing {filteredPartners.length} of {partners.length} partners
        </span>
      </div>

      {/* ── Notification Alerts ── */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            className="text-red-500 hover:text-red-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#e8f5ee] border border-[#d1fae5] text-[#0f5c3e] text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg("")}
            className="text-[#0f5c3e] hover:opacity-75"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Main View Content ── */}
      {viewMode === "table" ? (
        <PartnerTableSection
          partners={filteredPartners}
          loading={loading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onMove={handleMove}
        />
      ) : (
        <PartnerOrbitalPreviewSection partners={partners} />
      )}

      {/* ── Partner Add / Edit Modal with File Upload Support ── */}
      <PartnerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingPartner={editingPartner}
        actionLoading={actionLoading}
      />
    </div>
  );
}
