import { Link } from "react-router-dom";
import { Store, CheckCircle2, ExternalLink } from "lucide-react";

/**
 * Recent Listings Summary Section for Admin Dashboard
 */
export default function RecentListingsSection({ listings = [], loading = false }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold font-heading text-slate-900 flex items-center gap-2">
            <Store size={18} className="text-[#0f5c3e]" />
            Recent Listings
          </h2>
          <Link
            to="/admin/listings"
            className="text-xs text-[#0f5c3e] hover:underline font-semibold flex items-center gap-1"
          >
            <span>View all</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Loading listings...</div>
        ) : !listings || listings.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">No listings found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {listings.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">
                    {item.name || "Untitled Listing"}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="capitalize">{item.category || "General"}</span>
                    {item.phone && <span>• {item.phone}</span>}
                  </div>
                </div>
                {item.verified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e8f5ee] text-[#0f5c3e] border border-[#d1fae5]">
                    <CheckCircle2 size={11} />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Unverified
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
