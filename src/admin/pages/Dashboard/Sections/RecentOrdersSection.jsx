import { Link } from "react-router-dom";
import { ReceiptText, Clock, ExternalLink } from "lucide-react";

/**
 * Recent Orders & Transactions Section for Admin Dashboard
 */
export default function RecentOrdersSection({ orders = [], loading = false }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold font-heading text-slate-900 flex items-center gap-2">
            <ReceiptText size={18} className="text-[#0f5c3e]" />
            Recent Transactions
          </h2>
          <Link
            to="/admin/orders"
            className="text-xs text-[#0f5c3e] hover:underline font-semibold flex items-center gap-1"
          >
            <span>View ledger</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Loading transactions...</div>
        ) : !orders || orders.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">No transaction records.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800">
                    ₹{order.amount || 0}
                    <span className="text-xs font-normal text-slate-500 ml-2">
                      {order.planName || "Subscription"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock size={11} />
                    <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"}</span>
                    {order.userName && <span>• {order.userName}</span>}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    order.status === "paid" || order.status === "success"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {order.status || "Completed"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
