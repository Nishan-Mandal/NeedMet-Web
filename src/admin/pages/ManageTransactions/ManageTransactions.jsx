import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { adminApi } from "../../services/adminApi";
import { ActionHeader, KpiCard } from "../../components";
import { OrdersTransactionsTabs } from "../ManageOrders/Sections";
import {
  TransactionsTableSection,
  TransactionsPaginationSection,
  TransactionDetailModal,
} from "./Sections";
import { CheckCircle2, AlertCircle, X, CreditCard, IndianRupee, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function ManageTransactions() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [payments, setPayments] = useState([]);
  const [metrics, setMetrics] = useState({
    totalCount: 0,
    totalVolume: 0,
    successfulCount: 0,
    pendingCount: 0,
    failedCount: 0,
    refundedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Inspect Modal State
  const [detailPayment, setDetailPayment] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);

  // Sync if URL search changes
  useEffect(() => {
    if (searchParams.get("search")) {
      setSearchQuery(searchParams.get("search"));
    }
  }, [searchParams]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await adminApi.getPayments({
        page,
        limit: 15,
        status: statusFilter,
        search: searchQuery,
      });

      if (res?.success) {
        setPayments(res.payments || []);
        if (res.metrics) {
          setMetrics(res.metrics);
        }
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalCount(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Error loading payments:", err);
      setErrorMsg(err.message || "Failed to retrieve transactions ledger from Firestore.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [page, statusFilter, searchQuery]);

  const handleAddAuditNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !detailPayment) return;

    try {
      setNoteLoading(true);
      setErrorMsg("");
      const res = await adminApi.addPaymentAuditNote(detailPayment.id, newNote);
      if (res?.success) {
        const appendedNotes = [
          ...(detailPayment.adminNotes || []),
          {
            note: newNote,
            addedAt: new Date().toISOString(),
            addedBy: "Admin",
          },
        ];

        setDetailPayment((prev) => ({
          ...prev,
          adminNotes: appendedNotes,
        }));

        setPayments((prev) =>
          prev.map((p) =>
            p.id === detailPayment.id ? { ...p, adminNotes: appendedNotes } : p
          )
        );
        setNewNote("");
        setSuccessMsg("Settlement note appended to transaction ledger.");
        setTimeout(() => setSuccessMsg(""), 2500);
      }
    } catch (err) {
      console.error("Add payment note error:", err);
      setErrorMsg(err.message || "Failed to append settlement note.");
    } finally {
      setNoteLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setErrorMsg("");
      await adminApi.updatePaymentStatus(id, newStatus);
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      if (detailPayment && detailPayment.id === id) {
        setDetailPayment((prev) => ({ ...prev, status: newStatus }));
      }
      setSuccessMsg(`Transaction status updated to "${newStatus}".`);
      setTimeout(() => setSuccessMsg(""), 2500);
      loadPayments();
    } catch (err) {
      console.error("Update payment status error:", err);
      setErrorMsg(err.message || "Failed to update transaction status.");
    }
  };

  const filterTabs = [
    { value: "all", label: "All Transactions" },
    { value: "success", label: "Successful" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
  ];

  const kpiCards = [
    {
      id: "total-settlements",
      title: "Total Settlements",
      value: metrics.totalCount,
      icon: CreditCard,
      variant: "slate",
      subtitle: "All recorded transactions",
    },
    {
      id: "settled-volume",
      title: "Settled Volume",
      value: `₹${metrics.totalVolume.toLocaleString()}`,
      icon: IndianRupee,
      variant: "primary",
      subtitle: "Cleared transaction value",
    },
    {
      id: "captured",
      title: "Captured",
      value: metrics.successfulCount,
      icon: CheckCircle,
      variant: "emerald",
      subtitle: "Successful payments",
    },
    {
      id: "failed-issues",
      title: "Failed / Issues",
      value: metrics.failedCount + metrics.refundedCount,
      icon: AlertTriangle,
      variant: "rose",
      subtitle: "Failed or refunded items",
    },
  ];

  return (
    <div className="space-y-6 w-full font-primary">
      {/* ── Top Branch Switcher (Orders vs Transactions) ── */}
      <OrdersTransactionsTabs active="transactions" metrics={{ totalTransactions: totalCount }} />

      {/* ── KPI Summary Stats ── */}
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

      {/* Unified Action & Filter Toolbar */}
      <ActionHeader
        filters={filterTabs}
        activeFilter={statusFilter}
        onFilterChange={(st) => {
          setStatusFilter(st);
          setPage(1);
        }}
        searchPlaceholder="Search Payment ID, Txn Ref, Payer, Order ID..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={loadPayments}
        refreshing={loading}
      />

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between animate-in fade-in">
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
        <div className="p-4 rounded-xl bg-[#e8f5ee] border border-[#d1fae5] text-[#0f5c3e] text-sm flex items-center justify-between animate-in fade-in">
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

      {/* Transactions & Payments Table Section */}
      <TransactionsTableSection
        loading={loading}
        payments={payments}
        searchQuery={searchQuery}
        onInspect={(payment) => setDetailPayment(payment)}
      />

      {/* Pagination Footer Section */}
      <TransactionsPaginationSection
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={(p) => setPage(p)}
      />

      {/* Payment Detail & Audit Modal Section */}
      <TransactionDetailModal
        payment={detailPayment}
        onClose={() => setDetailPayment(null)}
        newNote={newNote}
        setNewNote={setNewNote}
        noteLoading={noteLoading}
        onAddNote={handleAddAuditNote}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

