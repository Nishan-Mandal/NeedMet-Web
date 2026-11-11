import React from "react";
import { Package, X } from "lucide-react";

export default function PlanFormModal({
  isOpen = false,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingPlan,
  actionLoading = false,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f5c3e]/20 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
            <Package size={18} className="text-[#0f5c3e]" />
            {editingPlan ? `Edit Plan: ${editingPlan.name}` : "Create Subscription Plan"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Plan Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pro Merchant, Enterprise Platinum"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tagline / Brief Subtitle
            </label>
            <input
              type="text"
              placeholder="e.g. Ideal for growing retail stores and service hubs"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration (Days) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.durationDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationDays: parseInt(e.target.value, 10) || 30,
                  })
                }
                className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Billing Cycle
              </label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-2 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Plan Feature Bullets
            </label>
            <div className="space-y-2">
              {formData.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Feature ${idx + 1}`}
                    value={feat}
                    onChange={(e) => onFeatureChange(idx, e.target.value)}
                    className="flex-1 bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveFeature(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={onAddFeature}
                className="text-xs text-[#0f5c3e] hover:underline font-bold cursor-pointer"
              >
                + Add Another Feature
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPopular"
              checked={formData.isPopular}
              onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
              className="rounded border-slate-300 text-[#0f5c3e] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="isPopular" className="text-xs text-slate-700 cursor-pointer font-medium">
              Highlight as "Popular / Recommended" tier
            </label>
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
              {actionLoading ? "Saving..." : editingPlan ? "Save Changes" : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
