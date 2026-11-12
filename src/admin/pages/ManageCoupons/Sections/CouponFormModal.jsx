import React from "react";
import { Tag, X } from "lucide-react";

export default function CouponFormModal({
  isOpen = false,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingCoupon,
  actionLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f5c3e]/20 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
            <Tag size={18} className="text-[#0f5c3e]" />
            {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : "Create New Coupon"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Coupon Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. WELCOME50, DIWALI2026"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-4 py-2 text-sm text-[#0f5c3e] font-mono uppercase tracking-wider font-bold focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Discount Type
              </label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({ ...formData, discountType: e.target.value })
                }
                className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Flat (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountValue: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Min Order Value (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.minOrderAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minOrderAmount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Discount Cap (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxDiscountAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxDiscountAmount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Redemptions
              </label>
              <input
                type="number"
                min="1"
                value={formData.usageLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usageLimit: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Campaign Notes
            </label>
            <textarea
              rows="2"
              placeholder="e.g. 50% discount for new merchant onboarding"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
            ></textarea>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-[#0f5c3e] hover:bg-[#1a8a5a] text-white text-sm font-bold shadow-md shadow-emerald-900/10 transition disabled:opacity-50 cursor-pointer"
            >
              {actionLoading ? "Processing..." : editingCoupon ? "Save Changes" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
