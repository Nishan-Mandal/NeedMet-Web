import React from "react";
import { Tag, Clock, XCircle, CheckCircle2, Edit2, Trash2 } from "lucide-react";

export default function CouponTableSection({
  loading = false,
  coupons = [],
  searchQuery = "",
  onToggle,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
        Loading coupons...
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs text-slate-500">
        <Tag size={40} className="mx-auto mb-3 text-slate-300" />
        <p className="font-semibold text-slate-800">No coupons found</p>
        <p className="text-xs text-slate-400 mt-1">
          {searchQuery
            ? "Try refining your search keyword."
            : "Get started by creating your first promotional coupon."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-[#f7faf8] text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
          <tr>
            <th className="px-5 py-3.5">Code & Type</th>
            <th className="px-5 py-3.5">Discount</th>
            <th className="px-5 py-3.5">Min / Max</th>
            <th className="px-5 py-3.5">Redemptions</th>
            <th className="px-5 py-3.5">Validity</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {coupons.map((coupon) => {
            const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
            const isActive = coupon.status === "active" && !isExpired;

            return (
              <tr key={coupon.id} className="hover:bg-[#e8f5ee]/30 transition">
                <td className="px-5 py-4">
                  <div className="font-bold font-mono text-[#0f5c3e] tracking-wider text-sm">
                    {coupon.code}
                  </div>
                  <div className="text-xs text-slate-400 capitalize">
                    {coupon.discountType} discount
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-bold text-slate-900">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% OFF`
                      : `₹${coupon.discountValue} FLAT OFF`}
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-slate-500">
                  <div>Min: ₹{coupon.minOrderAmount || 0}</div>
                  <div>Cap: ₹{coupon.maxDiscountAmount || "∞"}</div>
                </td>
                <td className="px-5 py-4 text-xs">
                  <div className="font-medium text-slate-700">
                    {coupon.timesUsed || 0} / {coupon.usageLimit || "∞"}
                  </div>
                  <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-[#0f5c3e] h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          ((coupon.timesUsed || 0) / (coupon.usageLimit || 100)) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock
                      size={12}
                      className={isExpired ? "text-red-500" : "text-slate-400"}
                    />
                    <span className={isExpired ? "text-red-600 font-semibold" : ""}>
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString()
                        : "No Expiry"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  {isExpired ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200">
                      Expired
                    </span>
                  ) : isActive ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e8f5ee] text-[#0f5c3e] border border-[#d1fae5]">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      Disabled
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onToggle(coupon.id, coupon.status)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        coupon.status === "active"
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                          : "bg-[#e8f5ee] hover:bg-[#d1fae5] text-[#0f5c3e] border-[#d1fae5]"
                      }`}
                      title={coupon.status === "active" ? "Disable coupon" : "Enable coupon"}
                    >
                      {coupon.status === "active" ? (
                        <XCircle size={15} />
                      ) : (
                        <CheckCircle2 size={15} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(coupon)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(coupon.id, coupon.code)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
