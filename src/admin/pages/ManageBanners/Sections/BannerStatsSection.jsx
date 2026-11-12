import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { KpiCard } from "../../../components";

export default function BannerStatsSection({
  totalCount = 0,
  activeCount = 0,
  inactiveCount = 0,
  tabMeta,
  activeTab,
}) {
  const Icon = tabMeta?.icon || CheckCircle2;
  const label = tabMeta?.label || "Banners";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KpiCard
        title={`Total ${label}`}
        value={totalCount}
        subtitle={`Managed in Firestore 'home.${activeTab}'`}
        icon={Icon}
        variant="primary"
      />
      <KpiCard
        title="Active & Displayed"
        value={activeCount}
        subtitle="Visible to visitors on web & mobile"
        icon={CheckCircle2}
        variant="emerald"
      />
      <KpiCard
        title="Inactive Drafts"
        value={inactiveCount}
        subtitle="Hidden from storefront rendering"
        icon={AlertCircle}
        variant="slate"
      />
    </div>
  );
}
