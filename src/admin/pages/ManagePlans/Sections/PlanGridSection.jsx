import React from "react";
import { Package } from "lucide-react";
import PlanCardItem from "./PlanCardItem";

export default function PlanGridSection({
  loading = false,
  plans = [],
  onToggleStatus,
  onEdit,
  onArchive,
}) {
  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
        Loading plans...
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs text-slate-500">
        <Package size={40} className="mx-auto mb-3 text-slate-300" />
        <p className="font-semibold text-slate-800">No subscription plans found</p>
        <p className="text-xs text-slate-400 mt-1">
          Create merchant packages to enable monetization and premium perks.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 ${
        plans.length === 2
          ? "md:grid-cols-2"
          : plans.length === 1
          ? "max-w-2xl"
          : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      } gap-6 w-full`}
    >
      {plans.map((plan) => (
        <PlanCardItem
          key={plan.id}
          plan={plan}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}
