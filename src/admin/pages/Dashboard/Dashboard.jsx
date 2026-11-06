import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../services/adminApi";
import {
  DashboardKpiSection,
  QuickActionHub,
  RecentListingsSection,
  RecentOrdersSection,
} from "./Sections";
import { RefreshCw, PlusCircle, AlertTriangle } from "lucide-react";

/**
 * Modular Admin Dashboard Page
 */
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await adminApi.getDashboardStats();
      if (res?.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 w-full">
      {/* Page Actions Bar */}
      <div className="flex items-center justify-end gap-3 pb-1">
        <button
          onClick={fetchStats}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 transition shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw
            size={15}
            className={refreshing ? "animate-spin text-[#0f5c3e]" : ""}
          />
          <span>Refresh</span>
        </button>

        <Link
          to="/admin/listings/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f5c3e] hover:bg-[#1a8a5a] text-white text-sm font-semibold shadow-md shadow-emerald-900/10 transition"
        >
          <PlusCircle size={16} />
          <span>Add Listing</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-3 text-sm">
          <AlertTriangle size={18} className="shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Metrics Cards Section */}
      <DashboardKpiSection stats={stats} />

      {/* Quick Action Hub Operations */}
      <QuickActionHub />

      {/* Two Columns: Recent Listings & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentListingsSection
          listings={stats?.recentListings}
          loading={loading}
        />
        <RecentOrdersSection
          orders={stats?.recentOrders}
          loading={loading}
        />
      </div>
    </div>
  );
}
