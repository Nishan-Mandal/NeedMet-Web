import React from "react";
import { Link } from "react-router-dom";
import { ReceiptText, Clock, Eye, CreditCard, User, ExternalLink, Calendar, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export default function OrdersTableSection({
  loading = false,
  orders = [],
  searchQuery = "",
  onInspect,
}) {
  if (loading) {
    return (
      <div className="p-16 text-center rounded-2xl bg-white border border-slate-200/80 shadow-xs text-slate-400 text-sm animate-pulse">
        <div className="inline-block w-7 h-7 border-2 border-[#0f5c3e] border-t-transparent rounded-full animate-spin mb-3" />
        <p>Loading purchase ledger from Firestore...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-16 text-center rounded-2xl bg-white border border-slate-200/80 shadow-xs text-slate-500">
        <ReceiptText size={44} className="mx-auto mb-3 text-slate-300" />
        <p className="font-bold text-slate-800 text-base">No Orders Found</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          {searchQuery
            ? `No purchase records match "${searchQuery}". Try refining your search.`
            : "No customer purchase transactions recorded in the 'purchases' ledger yet."}
        </p>
      </div>
    );
  }

  const statusStyles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    expired: "bg-slate-100 text-slate-600 border-slate-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    refunded: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-[#f7faf8] text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200/80 font-bold">
          <tr>
            <th className="px-5 py-3.5">Purchase ID & Date</th>
            <th className="px-5 py-3.5">Customer / Merchant</th>
            <th className="px-5 py-3.5">Purchased Plan</th>
            <th className="px-5 py-3.5">Amount</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Payment Link</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => {
            const badge =
              statusStyles[order.status] ||
              "bg-slate-100 text-slate-600 border-slate-200";

            const linkedTxn = order.paymentId || order.transactionId;

            return (
              <tr key={order.id} className="hover:bg-[#e8f5ee]/25 transition duration-150">
                {/* 1. Purchase ID & Date */}
                <td className="px-5 py-4">
                  <div className="font-mono font-bold text-slate-900 text-xs">
                    {order.purchaseId || order.orderId || order.id}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock size={11} className="text-slate-400 shrink-0" />
                    <span>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "Recent"}
                    </span>
                    {order.collectionSource && (
                      <span className="text-[9px] px-1 rounded bg-slate-100 text-slate-500 uppercase font-mono">
                        {order.collectionSource}
                      </span>
                    )}
                  </div>
                </td>

                {/* 2. Customer / Merchant */}
                <td className="px-5 py-4 text-xs">
                  <div className="text-slate-900 font-bold flex items-center gap-1.5">
                    <User size={13} className="text-[#0f5c3e] shrink-0" />
                    <span>{order.userName || "Customer"}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5 truncate max-w-[180px]">
                    {order.userEmail || order.userPhone || order.userId || "N/A"}
                  </div>
                </td>

                {/* 3. Purchased Plan */}
                <td className="px-5 py-4">
                  <div className="font-bold text-slate-800 text-xs">
                    {order.planName || "Subscription Plan"}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar size={11} />
                    <span>Duration: {order.duration || "1 Month"}</span>
                  </div>
                </td>

                {/* 4. Amount */}
                <td className="px-5 py-4">
                  <div className="font-bold text-slate-900 text-sm">
                    ₹{order.amount || 0}
                  </div>
                  {order.discount > 0 && (
                    <div className="text-[10px] text-emerald-600 font-medium">
                      Saved ₹{order.discount}
                    </div>
                  )}
                </td>

                {/* 5. Status */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badge}`}
                  >
                    <span>{order.status || "completed"}</span>
                  </span>
                </td>

                {/* 6. Payment Link */}
                <td className="px-5 py-4 text-xs">
                  {linkedTxn ? (
                    <Link
                      to={`/admin/transactions?search=${encodeURIComponent(linkedTxn)}`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0f5c3e] hover:text-[#1a8a5a] hover:underline bg-[#e8f5ee]/60 px-2 py-1 rounded-lg border border-emerald-200/60 transition"
                      title="View transaction in Payments ledger"
                    >
                      <CreditCard size={12} />
                      <span className="truncate max-w-[110px]">{linkedTxn}</span>
                      <ExternalLink size={10} />
                    </Link>
                  ) : (
                    <span className="text-slate-400 text-[11px] italic">Direct Order</span>
                  )}
                </td>

                {/* 7. Action Button */}
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onInspect(order)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#e8f5ee] hover:text-[#0f5c3e] text-slate-700 text-xs font-semibold border border-slate-200 transition inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>Inspect</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
