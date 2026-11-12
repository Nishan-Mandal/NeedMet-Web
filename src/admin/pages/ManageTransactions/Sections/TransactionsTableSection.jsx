import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, Clock, Eye, ShoppingBag, User, ExternalLink, ShieldCheck, ArrowDownLeft, AlertCircle } from "lucide-react";

export default function TransactionsTableSection({
  loading = false,
  payments = [],
  searchQuery = "",
  onInspect,
}) {
  if (loading) {
    return (
      <div className="p-16 text-center rounded-2xl bg-white border border-slate-200/80 shadow-xs text-slate-400 text-sm animate-pulse">
        <div className="inline-block w-7 h-7 border-2 border-[#0f5c3e] border-t-transparent rounded-full animate-spin mb-3" />
        <p>Loading gateway transactions from 'payments' ledger...</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="p-16 text-center rounded-2xl bg-white border border-slate-200/80 shadow-xs text-slate-500">
        <CreditCard size={44} className="mx-auto mb-3 text-slate-300" />
        <p className="font-bold text-slate-800 text-base">No Transactions Recorded</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          {searchQuery
            ? `No payment records match "${searchQuery}". Try refining your search.`
            : "No payment gateway transactions recorded in the 'payments' ledger yet."}
        </p>
      </div>
    );
  }

  const statusStyles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    failed: "bg-rose-50 text-rose-700 border-rose-200",
    refunded: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const getMethodBadge = (method = "") => {
    const m = method.toLowerCase();
    if (m.includes("upi")) return "bg-purple-50 text-purple-700 border-purple-200";
    if (m.includes("card")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (m.includes("cash")) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-[#f7faf8] text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200/80 font-bold">
          <tr>
            <th className="px-5 py-3.5">Payment / Txn ID</th>
            <th className="px-5 py-3.5">Payer Details</th>
            <th className="px-5 py-3.5">Gateway & Mode</th>
            <th className="px-5 py-3.5">Amount</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Linked Order</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {payments.map((payment) => {
            const badge =
              statusStyles[payment.status] ||
              "bg-slate-100 text-slate-600 border-slate-200";

            const linkedOrder = payment.purchaseId || payment.orderId;

            return (
              <tr key={payment.id} className="hover:bg-[#e8f5ee]/25 transition duration-150">
                {/* 1. Payment / Txn ID & Timestamp */}
                <td className="px-5 py-4">
                  <div className="font-mono font-bold text-slate-900 text-xs">
                    {payment.paymentId || payment.transactionId || payment.id}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock size={11} className="text-slate-400 shrink-0" />
                    <span>
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleString()
                        : "Recent"}
                    </span>
                  </div>
                </td>

                {/* 2. Payer Details */}
                <td className="px-5 py-4 text-xs">
                  <div className="text-slate-900 font-bold flex items-center gap-1.5">
                    <User size={13} className="text-[#0f5c3e] shrink-0" />
                    <span>{payment.payerName || "Customer"}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5 truncate max-w-[170px]">
                    {payment.payerEmail || payment.payerPhone || payment.userId || "N/A"}
                  </div>
                </td>

                {/* 3. Gateway & Payment Method */}
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-800 text-xs">
                    {payment.gateway || "Payment Gateway"}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getMethodBadge(
                        payment.method
                      )}`}
                    >
                      {payment.method || "ONLINE"}
                    </span>
                  </div>
                </td>

                {/* 4. Amount */}
                <td className="px-5 py-4">
                  <div className="font-bold text-slate-900 text-sm">
                    ₹{payment.amount || 0}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">
                    {payment.currency || "INR"}
                  </div>
                </td>

                {/* 5. Status */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badge}`}
                  >
                    <span>{payment.status || "success"}</span>
                  </span>
                </td>

                {/* 6. Linked Order (with 1-click navigate) */}
                <td className="px-5 py-4 text-xs">
                  {linkedOrder ? (
                    <Link
                      to={`/admin/orders?search=${encodeURIComponent(linkedOrder)}`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0f5c3e] hover:text-[#1a8a5a] hover:underline bg-[#e8f5ee]/60 px-2 py-1 rounded-lg border border-emerald-200/60 transition"
                      title="View order in Purchases ledger"
                    >
                      <ShoppingBag size={12} />
                      <span className="truncate max-w-[110px]">{linkedOrder}</span>
                      <ExternalLink size={10} />
                    </Link>
                  ) : (
                    <span className="text-slate-400 text-[11px] italic">Direct Gateway</span>
                  )}
                </td>

                {/* 7. Action Button */}
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onInspect(payment)}
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

