import React from "react";
import { Star, Check, Edit2, Archive } from "lucide-react";

export default function PlanCardItem({
  plan,
  onToggleStatus,
  onEdit,
  onArchive,
}) {
  const isActive = plan.status === "active";

  return (
    <div
      className={`rounded-2xl bg-white border ${
        plan.isPopular
          ? "border-[#0f5c3e] shadow-md shadow-emerald-900/10 ring-1 ring-[#0f5c3e]/30"
          : "border-slate-200/80 shadow-xs"
      } p-6 flex flex-col justify-between relative group transition`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#0f5c3e] to-[#1a8a5a] text-[11px] font-bold text-white shadow-xs flex items-center gap-1">
          <Star size={11} fill="white" />
          Popular Tier
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold font-heading text-slate-900">{plan.name}</h3>
          <span
            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
              isActive
                ? "bg-[#e8f5ee] text-[#0f5c3e] border-[#d1fae5]"
                : "bg-slate-100 text-slate-500 border-slate-200"
            }`}
          >
            {plan.status}
          </span>
        </div>

        {plan.tagline && (
          <p className="text-xs text-slate-500 mb-4">{plan.tagline}</p>
        )}

        <div className="mb-5 pb-5 border-b border-slate-100">
          <span className="text-3xl font-black font-heading text-slate-900">₹{plan.price}</span>
          <span className="text-xs text-slate-500 ml-1">
            / {plan.billingCycle || "month"} ({plan.durationDays} days)
          </span>
        </div>

        <div className="space-y-2 mb-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Included Features:
          </div>
          {(plan.features || []).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
              <Check size={14} className="text-[#0f5c3e] shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onToggleStatus(plan.id, plan.status)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
            isActive
              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              : "bg-[#e8f5ee] hover:bg-[#d1fae5] text-[#0f5c3e] border-[#d1fae5]"
          }`}
        >
          {isActive ? "Deactivate" : "Activate"}
        </button>

        <button
          type="button"
          onClick={() => onEdit(plan)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
          title="Edit Plan"
        >
          <Edit2 size={15} />
        </button>

        <button
          type="button"
          onClick={() => onArchive(plan.id, plan.name)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 transition cursor-pointer"
          title="Archive Plan"
        >
          <Archive size={15} />
        </button>
      </div>
    </div>
  );
}
