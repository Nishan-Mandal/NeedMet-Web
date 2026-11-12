import { Link } from "react-router-dom";
import { PlusCircle, Tag, Coins, Package, ReceiptText, TrendingUp, Handshake } from "lucide-react";

/**
 * Quick Action Hub Section for Admin Operations
 */
export default function QuickActionHub() {
  const actions = [
    {
      title: "New Listing",
      link: "/admin/listings/new",
      icon: PlusCircle,
      iconColor: "text-[#0f5c3e]",
      hoverBg: "hover:bg-[#e8f5ee]",
      hoverBorder: "hover:border-[#0f5c3e]/30",
    },
    {
      title: "Manage Partners",
      link: "/admin/partners",
      icon: Handshake,
      iconColor: "text-emerald-700",
      hoverBg: "hover:bg-emerald-50",
      hoverBorder: "hover:border-emerald-500/30",
    },
    {
      title: "Create Coupon",
      link: "/admin/coupons",
      icon: Tag,
      iconColor: "text-amber-600",
      hoverBg: "hover:bg-amber-50",
      hoverBorder: "hover:border-amber-500/30",
    },
    {
      title: "Issue Cash Code",
      link: "/admin/cash-codes",
      icon: Coins,
      iconColor: "text-teal-600",
      hoverBg: "hover:bg-teal-50",
      hoverBorder: "hover:border-teal-500/30",
    },
    {
      title: "Manage Plans",
      link: "/admin/plans",
      icon: Package,
      iconColor: "text-indigo-600",
      hoverBg: "hover:bg-indigo-50",
      hoverBorder: "hover:border-indigo-500/30",
    },
    {
      title: "Audit Ledger",
      link: "/admin/orders",
      icon: ReceiptText,
      iconColor: "text-blue-600",
      hoverBg: "hover:bg-blue-50",
      hoverBorder: "hover:border-blue-500/30",
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
      <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f5c3e] mb-4 flex items-center gap-2">
        <TrendingUp size={16} />
        Quick Actions & Operations
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Link
              key={idx}
              to={act.link}
              className={`p-3.5 rounded-xl bg-[#f7faf8] ${act.hoverBg} border border-slate-200/70 ${act.hoverBorder} transition text-center group ${act.className || ""}`}
            >
              <Icon
                size={20}
                className={`mx-auto mb-2 ${act.iconColor} group-hover:scale-110 transition`}
              />
              <div className="text-xs font-semibold text-slate-800">
                {act.title}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
