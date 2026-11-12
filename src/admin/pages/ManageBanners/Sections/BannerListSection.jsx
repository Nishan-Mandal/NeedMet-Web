import React from "react";
import { RefreshCw, Plus } from "lucide-react";
import BannerItemCard from "./BannerItemCard";

export default function BannerListSection({
  loading = false,
  items = [],
  tabMeta,
  searchQuery = "",
  onOpenCreate,
  onMove,
  onToggleStatus,
  onPreview,
  onEdit,
  onDelete,
}) {
  const Icon = tabMeta?.icon || Plus;
  const label = tabMeta?.label || "Banners";
  const singularLabel = label.slice(0, -1) || "Banner";

  if (loading) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="animate-spin text-[#0f5c3e] mx-auto mb-3" size={28} />
        <p className="text-sm font-medium text-slate-600">Loading {label}...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-8">
        <Icon size={44} className="mx-auto mb-3 text-slate-300" />
        <h3 className="text-base font-semibold text-slate-800">
          No {label} found
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          {searchQuery
            ? `No items match "${searchQuery}". Clear your search query or reset the filter.`
            : `You haven't configured any ${label.toLowerCase()} yet. Click "Add ${singularLabel}" to create your first one.`}
        </p>
        <button
          type="button"
          onClick={onOpenCreate}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e8f5ee] text-[#0f5c3e] font-semibold text-xs border border-[#d1fae5] hover:bg-[#d5ede0] transition cursor-pointer"
        >
          <Plus size={14} />
          <span>Create {singularLabel}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <BannerItemCard
          key={item.id || index}
          item={item}
          index={index}
          totalItems={items.length}
          onMove={onMove}
          onToggleStatus={onToggleStatus}
          onPreview={onPreview}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
