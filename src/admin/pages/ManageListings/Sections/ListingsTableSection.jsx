import React from "react";
import { Store } from "lucide-react";
import ListingItemRow from "./ListingItemRow";

export default function ListingsTableSection({
  loading = false,
  listings = [],
  searchQuery = "",
  actionLoadingId = null,
  onToggleVerify,
  onDeleteListing,
}) {
  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
        Loading listings...
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs text-slate-500">
        <Store size={40} className="mx-auto mb-3 text-slate-300" />
        <p className="font-semibold text-slate-800">No listings found</p>
        <p className="text-xs text-slate-400 mt-1">
          {searchQuery
            ? "Try searching with different terms."
            : "Create your first business listing to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-[#f7faf8] text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
          <tr>
            <th className="px-5 py-3.5">Business Name</th>
            <th className="px-5 py-3.5">Category</th>
            <th className="px-5 py-3.5">Contact & Location</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Verification & Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {listings.map((item) => (
            <ListingItemRow
              key={item.id}
              item={item}
              isActionLoading={actionLoadingId === item.id}
              onToggleVerify={onToggleVerify}
              onDeleteListing={onDeleteListing}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
