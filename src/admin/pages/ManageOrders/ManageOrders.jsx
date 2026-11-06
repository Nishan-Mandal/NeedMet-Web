import { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import { ActionHeader, KpiCard } from "../../components";
import {
  OrdersTransactionsTabs,
  OrdersTableSection,
  OrdersPaginationSection,
  OrderDetailModal,
} from "./Sections";
import { CheckCircle2, AlertCircle, X, ShoppingBag, IndianRupee, CheckCircle, Clock } from "lucide-react";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    totalCount: 0,
    totalRevenue: 0,
    activeCount: 0,
    pendingCount: 0,
    expiredCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Inspect Modal State
  const [detailOrder, setDetailOrder] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await adminApi.getPurchases({
        page,
        limit: 15,
        status: statusFilter,
        search: searchQuery,
      });

      if (res?.success) {
        setOrders(res.purchases || res.orders || []);
        if (res.metrics) {
          setMetrics(res.metrics);
        }
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalCount(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Error loading purchases:", err);
      setErrorMsg(err.message || "Failed to retrieve purchases ledger from Firestore.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter, searchQuery]);

  const handleAddAuditNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !detailOrder) return;

    try {
      setNoteLoading(true);
      setErrorMsg("");
      const res = await adminApi.addPurchaseAuditNote(detailOrder.id, newNote, detailOrder.collectionSource);
      if (res?.success) {
        const appendedNotes = [
          ...(detailOrder.adminNotes || []),
          {
            note: newNote,
            addedAt: new Date().toISOString(),
            addedBy: "Admin",
          },
        ];

        setDetailOrder((prev) => ({
          ...prev,
          adminNotes: appendedNotes,
        }));

        setOrders((prev) =>
          prev.map((o) =>
            o.id === detailOrder.id ? { ...o, adminNotes: appendedNotes } : o
          )
        );
        setNewNote("");
        setSuccessMsg("Audit note appended to purchase ledger.");
        setTimeout(() => setSuccessMsg(""), 2500);
      }
    } catch (err) {
      console.error("Add note error:", err);
      setErrorMsg(err.message || "Failed to append audit note.");
    } finally {
      setNoteLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus, collectionSource) => {
    try {
      setErrorMsg("");
      await adminApi.updatePurchaseStatus(id, newStatus, collectionSource);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
      if (detailOrder && detailOrder.id === id) {
        setDetailOrder((prev) => ({ ...prev, status: newStatus }));
      }
      setSuccessMsg(`Purchase status updated to "${newStatus}".`);
      setTimeout(() => setSuccessMsg(""), 2500);
      loadOrders();
    } catch (err) {
      console.error("Update purchase status error:", err);
      setErrorMsg(err.message || "Failed to update purchase status.");
    }
  };

  const filterTabs = [
    { value: "all", label: "All Purchases" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "expired", label: "Expired" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const kpiCards = [
    {
      id: "total-purchases",
      title: "Total Purchases",
      value: metrics.totalCount,
      icon: ShoppingBag,
      variant: "slate",
      subtitle: "All-time purchase orders",
    },
    {
      id: "total-volume",
      title: "Total Volume",
      value: `₹${metrics.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      variant: "primary",
      subtitle: "Gross order receipts",
    },
    {
      id: "active-plans",
      title: "Active Plans",
      value: metrics.activeCount,
      icon: CheckCircle,
      variant: "blue",
      subtitle: "Live ongoing services",
    },
    {
      id: "pending-orders",
      title: "Pending Orders",
      value: metrics.pendingCount,
      icon: Clock,
      variant: "amber",
      subtitle: "Awaiting fulfillment",
    },
  ];

  return (
    <div className="space-y-6 w-full font-primary">
      {/* ── Top Branch Switcher (Orders vs Transactions) ── */}
      <OrdersTransactionsTabs active="orders" metrics={{ totalOrders: totalCount }} />

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
        searchPlaceholder="Search Purchase ID, customer, plan, txn..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={loadOrders}
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

      {/* Orders & Purchases Table Section */}
      <OrdersTableSection
        loading={loading}
        orders={orders}
        searchQuery={searchQuery}
        onInspect={(order) => setDetailOrder(order)}
      />

      {/* Pagination Footer Section */}
      <OrdersPaginationSection
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={(p) => setPage(p)}
      />

      {/* Purchase Detail & Audit Modal Section */}
      <OrderDetailModal
        order={detailOrder}
        onClose={() => setDetailOrder(null)}
        newNote={newNote}
        setNewNote={setNewNote}
        noteLoading={noteLoading}
        onAddNote={handleAddAuditNote}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
