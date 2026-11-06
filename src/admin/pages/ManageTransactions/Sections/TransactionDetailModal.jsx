import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, X, MessageSquare, ShoppingBag, User, ExternalLink, ShieldCheck, ArrowDownLeft, FileText } from "lucide-react";

export default function TransactionDetailModal({
  payment,
  onClose,
  newNote,
  setNewNote,
  noteLoading = false,
  onAddNote,
  onStatusChange,
}) {
  const [changingStatus, setChangingStatus] = useState(false);

  if (!payment) return null;

  const linkedOrder = payment.purchaseId || payment.orderId;

  const handleStatusSelect = async (newStatus) => {
    if (!onStatusChange || payment.status === newStatus) return;
    try {
      setChangingStatus(true);
      await onStatusChange(payment.id, newStatus);
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
                <CreditCard size={18} />
              </span>
              <h2 className="text-lg font-bold font-heading text-slate-900">
                Payment Audit Record
              </h2>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-1">
              Txn ID: {payment.paymentId || payment.transactionId || payment.id}
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

        {/* Financial & Gateway Snapshot Grid */}
        <div className="p-4 rounded-2xl bg-[#f7faf8] border border-slate-200/80 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Settlement Amount:</span>
            <div className="text-base font-extrabold text-[#0f5c3e] mt-0.5">
              ₹{payment.amount || 0} <span className="text-xs font-normal text-slate-400 uppercase">{payment.currency || "INR"}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Payment Mode:</span>
            <div className="font-bold text-slate-900 mt-0.5 uppercase">{payment.method || "ONLINE"}</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Payment Gateway:</span>
            <div className="font-semibold text-slate-800 mt-0.5">{payment.gateway || "Direct Gateway"}</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Gateway Settlement Status:</span>
            <div className="mt-1">
              <select
                disabled={changingStatus}
                value={payment.status || "success"}
                onChange={(e) => handleStatusSelect(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 uppercase focus:outline-none focus:border-[#0f5c3e] cursor-pointer disabled:opacity-50"
              >
                <option value="success">Success / Captured</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Gateway Reference:</span>
            <div className="font-mono text-slate-700 mt-0.5 truncate max-w-[200px]" title={payment.gatewayRef}>
              {payment.gatewayRef || "N/A"}
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Transaction Timestamp:</span>
            <div className="text-slate-700 mt-0.5">
              {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "Recent"}
            </div>
          </div>
        </div>

        {/* Payer & Linked Purchase Info */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <User size={14} className="text-[#0f5c3e]" />
              <span>Payer Identification</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">UID: {payment.userId || "N/A"}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Payer Name:</span>
              <p className="font-semibold text-slate-800 truncate">{payment.payerName || "Customer"}</p>
            </div>
            <div>
              <span className="text-slate-400">Payer Email:</span>
              <p className="font-semibold text-slate-800 truncate">{payment.payerEmail || "N/A"}</p>
            </div>
            {payment.payerPhone && (
              <div>
                <span className="text-slate-400">Phone:</span>
                <p className="font-semibold text-slate-800">{payment.payerPhone}</p>
              </div>
            )}
            {payment.receiptUrl && (
              <div>
                <span className="text-slate-400">Receipt / Invoice:</span>
                <p>
                  <a
                    href={payment.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0f5c3e] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>View Receipt</span>
                    <ExternalLink size={10} />
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Linked Order Record Link */}
          {linkedOrder && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShoppingBag size={13} className="text-[#0f5c3e]" />
                <span>Linked Purchase Order:</span>
                <span className="font-mono text-slate-800 font-semibold">{linkedOrder}</span>
              </div>
              <Link
                to={`/admin/orders?search=${encodeURIComponent(linkedOrder)}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f5c3e] hover:underline"
              >
                <span>View Order</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          )}
        </div>

        {/* Admin Audit Notes Timeline */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f5c3e] mb-2 flex items-center gap-1.5">
            <MessageSquare size={14} />
            Official Settlement Audit Notes ({payment.adminNotes?.length || 0})
          </h3>

          <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
            {!payment.adminNotes || payment.adminNotes.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-3 bg-[#f7faf8] rounded-xl border border-slate-200/80">
                No administrative audit notes attached to this transaction record yet.
              </p>
            ) : (
              payment.adminNotes.map((entry, idx) => (
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
              placeholder="Append official settlement audit note..."
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

