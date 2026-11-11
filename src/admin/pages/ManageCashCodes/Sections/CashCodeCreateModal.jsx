import React from "react";
import { Coins, X } from "lucide-react";

export default function CashCodeCreateModal({
  isOpen = false,
  onClose,
  onSubmit,
  formData,
  setFormData,
  actionLoading = false,
  onRegenerateCode,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f5c3e]/20 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
            <Coins size={18} className="text-[#0f5c3e]" />
            Issue New Cash Code
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Cash Code *</label>
              <button
                type="button"
                onClick={onRegenerateCode}
                className="text-xs text-[#0f5c3e] hover:underline font-semibold cursor-pointer"
              >
                Regenerate Random
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-4 py-2 text-sm text-[#0f5c3e] font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Value Amount (₹) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    value: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Validity (Days) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.validityDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    validityDays: parseInt(e.target.value, 10) || 30,
                  })
                }
                className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Max Allowable Redemptions
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.maxRedemptions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxRedemptions: parseInt(e.target.value, 10) || 1,
                })
              }
              className="w-full bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Issuance Notes / Justification
            </label>
            <textarea
              rows="2"
              placeholder="e.g. VIP merchant grant, customer reimbursement"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              {actionLoading ? "Issuing..." : "Issue Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
