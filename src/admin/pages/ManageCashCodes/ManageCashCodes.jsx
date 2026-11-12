import { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import ActionHeader from "../../components/ActionHeader";
import {
  CashCodeTableSection,
  CashCodeCreateModal,
  CashCodeRevokeModal,
  CashCodeAuditModal,
} from "./Sections";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function ManageCashCodes() {
  const [cashCodes, setCashCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [auditModalCode, setAuditModalCode] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);

  // Form & Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [revokeReason, setRevokeReason] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    value: 500,
    validityDays: 30,
    maxRedemptions: 1,
    notes: "",
  });

  const generateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "NM-";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    result += "-";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const loadCashCodes = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await adminApi.getCashCodes(statusFilter);
      if (res?.success) {
        setCashCodes(res.codes || []);
      }
    } catch (err) {
      console.error("Error loading cash codes:", err);
      setErrorMsg(err.message || "Failed to load cash codes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCashCodes();
  }, [statusFilter]);

  const handleOpenCreate = () => {
    setFormData({
      code: generateRandomCode(),
      value: 500,
      validityDays: 30,
      maxRedemptions: 1,
      notes: "",
    });
    setCreateModalOpen(true);
  };

  const handleOpenRevoke = (codeItem) => {
    setSelectedCode(codeItem);
    setRevokeReason("");
    setRevokeModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");

    try {
      await adminApi.issueCashCode(formData);
      setSuccessMsg(`Cash code ${formData.code} created and activated.`);
      setCreateModalOpen(false);
      await loadCashCodes();
    } catch (err) {
      console.error("Issue cash code error:", err);
      setErrorMsg(err.message || "Failed to issue cash code.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeSubmit = async (e) => {
    e.preventDefault();
    if (!revokeReason.trim()) {
      setErrorMsg("Please specify a reason for revocation.");
      return;
    }

    setActionLoading(true);
    setErrorMsg("");

    try {
      await adminApi.revokeCashCode(selectedCode.id, revokeReason);
      setSuccessMsg(`Cash code ${selectedCode.code} has been permanently revoked.`);
      setRevokeModalOpen(false);
      await loadCashCodes();
    } catch (err) {
      console.error("Revoke error:", err);
      setErrorMsg(err.message || "Failed to revoke cash code.");
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccessMsg(`Copied "${text}" to clipboard.`);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const filteredCodes = cashCodes.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (c.code && c.code.toLowerCase().includes(q)) ||
      (c.ownerName && c.ownerName.toLowerCase().includes(q)) ||
      (c.purchaseId && c.purchaseId.toLowerCase().includes(q)) ||
      (c.paymentId && c.paymentId.toLowerCase().includes(q)) ||
      (c.usedBy && c.usedBy.toLowerCase().includes(q)) ||
      (c.notes && c.notes.toLowerCase().includes(q))
    );
  });

  const filterTabs = [
    { label: "All Codes", value: "all", count: cashCodes.length },
    {
      label: "Active",
      value: "active",
      count: cashCodes.filter((c) => c.isAvailable === true).length,
    },
    {
      label: "Redeemed",
      value: "redeemed",
      count: cashCodes.filter((c) => c.isUsed === true).length,
    },
    {
      label: "Expired",
      value: "expired",
      count: cashCodes.filter((c) => c.isExpired === true && !c.isUsed).length,
    },
    {
      label: "Revoked",
      value: "revoked",
      count: cashCodes.filter((c) => c.isRevoked === true).length,
    },
  ];

  return (
    <div className="space-y-6 w-full font-primary">
      {/* Unified Action & Filter Toolbar */}
      <ActionHeader
        filters={filterTabs}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        searchPlaceholder="Search code, owner, payment or purchase ID..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={loadCashCodes}
        refreshing={loading}
        actionLabel="Issue Cash Code"
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

      {/* Cash Codes Table Section */}
      <CashCodeTableSection
        loading={loading}
        codes={filteredCodes}
        searchQuery={searchQuery}
        onCopy={copyToClipboard}
        onOpenAudit={(code) => setAuditModalCode(code)}
        onOpenRevoke={handleOpenRevoke}
      />

      {/* Modal: Create Cash Code */}
      <CashCodeCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        formData={formData}
        setFormData={setFormData}
        actionLoading={actionLoading}
        onRegenerateCode={() =>
          setFormData({ ...formData, code: generateRandomCode() })
        }
      />

      {/* Modal: Revoke Code */}
      <CashCodeRevokeModal
        isOpen={revokeModalOpen}
        codeItem={selectedCode}
        onClose={() => setRevokeModalOpen(false)}
        onSubmit={handleRevokeSubmit}
        reason={revokeReason}
        setReason={setRevokeReason}
        actionLoading={actionLoading}
      />

      {/* Modal: Audit Log Viewer */}
      <CashCodeAuditModal
        codeItem={auditModalCode}
        onClose={() => setAuditModalCode(null)}
      />
    </div>
  );
}
