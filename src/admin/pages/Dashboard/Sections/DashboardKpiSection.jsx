import { Store, Tag, Coins, Package, Handshake } from "lucide-react";
import { KpiCard } from "../../../components";

/**
 * KPI Metrics Section for Admin Dashboard
 */
export default function DashboardKpiSection({ stats }) {
  const kpis = [
    {
      label: "Listings",
      value: stats?.listings?.total ?? "—",
      subValue: `${stats?.listings?.verified ?? 0} verified`,
      icon: Store,
      variant: "primary",
      link: "/admin/listings",
    },
    {
      label: "Partners",
      value: stats?.partners?.total ?? 15,
      subValue: `${stats?.partners?.active ?? 15} on homepage`,
      icon: Handshake,
      variant: "emerald",
      link: "/admin/partners",
    },
    {
      label: "Coupons",
      value: stats?.coupons?.total ?? "—",
      subValue: `${stats?.coupons?.active ?? 0} active`,
      icon: Tag,
      variant: "amber",
      link: "/admin/coupons",
    },
    {
      label: "Cash Codes",
      value: stats?.cashCodes?.total ?? "—",
      subValue: `${stats?.cashCodes?.active ?? 0} active`,
      icon: Coins,
      variant: "teal",
      link: "/admin/cash-codes",
    },
    {
      label: "Plans",
      value: stats?.plans?.total ?? "—",
      subValue: `${stats?.plans?.active ?? 0} published`,
      icon: Package,
      variant: "indigo",
      link: "/admin/plans",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi, idx) => (
        <KpiCard
          key={idx}
          to={kpi.link}
          title={kpi.label}
          value={kpi.value}
          subtitle={kpi.subValue}
          icon={kpi.icon}
          variant={kpi.variant}
        />
      ))}
    </div>
  );
}
