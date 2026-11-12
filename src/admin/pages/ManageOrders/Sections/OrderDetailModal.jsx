import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReceiptText, X, MessageSquare, CreditCard, User, ExternalLink, Calendar, ShieldCheck, Tag } from "lucide-react";

export default function OrderDetailModal({
  order,
  onClose,
  newNote,
  setNewNote,
  noteLoading = false,
  onAddNote,
  onStatusChange,
}) {
  const [changingStatus, setChangingStatus] = useState(false);

  if (!order) return null;

  const linkedTxn = order.paymentId || order.transactionId;

  const handleStatusSelect = async (newStatus) => {
    if (!onStatusChange || order.status === newStatus) return;
    try {
      setChangingStatus(true);
      await onStatusChange(order.id, newStatus, order.collectionSource);
    } finally {
      setChangingStatus(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-50 text-[#0f5c3e] border border-emerald-200">
                <ReceiptText size={18} />
              </span>
              <h2 className="text-lg font-bold font-heading text-slate-900">
                Purchase Audit Ledger
              </h2>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-1">
              ID: {order.purchaseId || order.orderId || order.id}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Financial & Plan Overview Grid */}
        <div className="p-4 rounded-2xl bg-[#f7faf8] border border-slate-200/80 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Purchased Plan / Item:</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{order.planName || "Subscription"}</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Settlement Amount:</span>
            <div className="text-base font-extrabold text-[#0f5c3e] mt-0.5">₹{order.amount || 0}</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Plan Validity Duration:</span>
            <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
              <Calendar size={13} className="text-slate-400" />
              <span>{order.duration || "1 Month"}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Fulfillment Status:</span>
            <div className="mt-1">
              <select
                disabled={changingStatus}
                value={order.status || "completed"}
                onChange={(e) => handleStatusSelect(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 uppercase focus:outline-none focus:border-[#0f5c3e] cursor-pointer disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Purchase Timestamp:</span>
            <div className="text-slate-700 mt-0.5">
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Recent"}
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Expiry Date:</span>
            <div className="text-slate-700 mt-0.5">
              {order.expiresAt ? new Date(order.expiresAt).toLocaleDateString() : "Ongoing / Lifetime"}
            </div>
          </div>
        </div>

        {/* Customer & Payment Link Banner */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <User size={14} className="text-[#0f5c3e]" />
              <span>Purchaser Details</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">UID: {order.userId || "N/A"}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Name:</span>
              <p className="font-semibold text-slate-800 truncate">{order.userName || "Customer"}</p>
            </div>
            <div>
              <span className="text-slate-400">Email:</span>
              <p className="font-semibold text-slate-800 truncate">{order.userEmail || "N/A"}</p>
            </div>
            {order.userPhone && (
              <div>
                <span className="text-slate-400">Phone:</span>
                <p className="font-semibold text-slate-800">{order.userPhone}</p>
              </div>
            )}
            {order.paymentMethod && (
              <div>
                <span className="text-slate-400">Method:</span>
                <p className="font-semibold text-slate-800 capitalize">{order.paymentMethod}</p>
              </div>
            )}
          </div>

          {/* Linked Payment Record Link */}
          {linkedTxn && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <CreditCard size={13} className="text-[#0f5c3e]" />
                <span>Linked Payment:</span>
                <span className="font-mono text-slate-800 font-semibold">{linkedTxn}</span>
              </div>
              <Link
                to={`/admin/transactions?search=${encodeURIComponent(linkedTxn)}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f5c3e] hover:underline"
              >
                <span>View Transaction</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          )}
        </div>

        {/* Admin Audit Notes Timeline */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f5c3e] mb-2 flex items-center gap-1.5">
            <MessageSquare size={14} />
            Official Audit Notes ({order.adminNotes?.length || 0})
          </h3>

          <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
            {!order.adminNotes || order.adminNotes.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-3 bg-[#f7faf8] rounded-xl border border-slate-200/80">
                No administrative audit notes attached to this purchase yet.
              </p>
            ) : (
              order.adminNotes.map((entry, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#f7faf8] border border-slate-200/80 text-xs">
                  <div className="text-slate-800 leading-relaxed">{entry.note}</div>
                  <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                    <span>Admin: {entry.addedBy}</span>
                    <span>{entry.addedAt ? new Date(entry.addedAt).toLocaleString() : ""}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={onAddNote} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Append official administrative audit note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 bg-[#f7faf8] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0f5c3e] focus:bg-white"
            />
            <button
              type="submit"
              disabled={noteLoading}
              className="px-4 py-2 rounded-xl bg-[#0f5c3e] hover:bg-[#1a8a5a] text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {noteLoading ? "Saving..." : "Add Note"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
