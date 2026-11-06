import { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import ActionHeader from "../../components/ActionHeader";
import {
  CouponTableSection,
  CouponFormModal,
} from "./Sections";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: 500,
    expiresAt: "",
    usageLimit: 100,
    description: "",
  });

  const loadCoupons = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await adminApi.getCoupons(statusFilter);
      if (res?.success) {
        setCoupons(res.coupons || []);
      }
    } catch (err) {
      console.error("Error loading coupons:", err);
      setErrorMsg(err.message || "Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, [statusFilter]);

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscountAmount: 500,
      expiresAt: "",
      usageLimit: 100,
      description: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue || 0,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
      usageLimit: coupon.usageLimit || 0,
      description: coupon.description || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (editingCoupon) {
        await adminApi.updateCoupon(editingCoupon.id, formData);
        setSuccessMsg(`Coupon ${formData.code} updated.`);
      } else {
        await adminApi.createCoupon(formData);
        setSuccessMsg(`Coupon ${formData.code} created.`);
      }
      setModalOpen(false);
      await loadCoupons();
    } catch (err) {
      console.error("Coupon submit error:", err);
      setErrorMsg(err.message || "Failed to save coupon.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      setErrorMsg("");
      await adminApi.toggleCoupon(id);
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: currentStatus === "active" ? "inactive" : "active" } : c
        )
      );
    } catch (err) {
      console.error("Toggle error:", err);
      setErrorMsg(err.message || "Failed to toggle coupon status.");
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon ${code}? This action cannot be undone.`)) {
      return;
    }
    try {
      setErrorMsg("");
      await adminApi.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setSuccessMsg(`Coupon ${code} removed.`);
    } catch (err) {
      console.error("Delete error:", err);
      setErrorMsg(err.message || "Failed to delete coupon.");
    }
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 w-full font-primary">
      {/* Unified Action & Filter Toolbar */}
      <ActionHeader
        filters={["all", "active", "inactive"]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        searchPlaceholder="Search code or desc..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={loadCoupons}
        refreshing={loading}
        actionLabel="Create Coupon"
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

      {/* Coupons Table Section */}
      <CouponTableSection
        loading={loading}
        coupons={filteredCoupons}
        searchQuery={searchQuery}
        onToggle={handleToggle}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Modal for Create / Edit */}
      <CouponFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingCoupon={editingCoupon}
        actionLoading={actionLoading}
      />
    </div>
  );
}
