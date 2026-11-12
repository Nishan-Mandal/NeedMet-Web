import React from "react";
import {
  ArrowUp,
  ArrowDown,
  Monitor,
  Smartphone,
  Link as LinkIcon,
  ToggleLeft,
  ToggleRight,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";

export default function BannerItemCard({
  item,
  index,
  totalItems,
  onMove,
  onToggleStatus,
  onPreview,
  onEdit,
  onDelete,
}) {
  const isActive = item.isActive !== false;
  const mobileImg = item.imageUrl || item.image;
  const desktopImg = item.webUrl || item.weburl;
  const route = item.route || item.redirectUrl;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#0f5c3e]/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 group">
      {/* Left: Reorder + Thumbnails + Details */}
      <div className="flex items-start sm:items-center gap-4 w-full lg:w-auto">
        {/* Reorder Buttons */}
        <div className="flex flex-col items-center gap-1 shrink-0 bg-slate-50 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => onMove(index, "up")}
            disabled={index === 0}
            className="p-1 text-slate-400 hover:text-[#0f5c3e] disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer"
            title="Move up in order"
          >
            <ArrowUp size={14} />
          </button>
          <span className="text-[11px] font-bold text-slate-600">#{index + 1}</span>
          <button
            type="button"
            onClick={() => onMove(index, "down")}
            disabled={index === totalItems - 1}
            className="p-1 text-slate-400 hover:text-[#0f5c3e] disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer"
            title="Move down in order"
          >
            <ArrowDown size={14} />
          </button>
        </div>

        {/* Dual Thumbnails (Desktop & Mobile) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop Thumbnail */}
          <div className="relative group/thumb w-24 h-14 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
            {desktopImg ? (
              <img
                src={desktopImg}
                alt="Desktop banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <Monitor size={18} className="text-slate-400" />
            )}
            <span className="absolute bottom-0.5 right-0.5 px-1 bg-black/60 text-[9px] text-white rounded font-mono">
              Web
            </span>
          </div>

          {/* Mobile Thumbnail */}
          <div className="relative group/thumb w-10 h-14 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
            {mobileImg ? (
              <img
                src={mobileImg}
                alt="Mobile banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <Smartphone size={16} className="text-slate-400" />
            )}
            <span className="absolute bottom-0.5 right-0.5 px-1 bg-black/60 text-[8px] text-white rounded font-mono">
              Mob
            </span>
          </div>
        </div>

        {/* Banner Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-slate-900 text-sm truncate max-w-xs">
              {item.title || "Untitled Banner"}
            </h4>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                isActive
                  ? "bg-[#e8f5ee] text-[#0f5c3e] border-[#d1fae5]"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
            {route ? (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80 text-slate-700">
                <LinkIcon size={11} className="text-slate-400" />
                <span className="truncate max-w-[220px]">{route}</span>
              </span>
            ) : (
              <span className="text-slate-400 italic">No destination set</span>
            )}

            {item.updatedAt && (
              <span className="text-[11px] text-slate-400">
                Updated {new Date(item.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
        <button
          type="button"
          onClick={() => onToggleStatus(item)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
            isActive
              ? "bg-[#e8f5ee] text-[#0f5c3e] border-[#d1fae5] hover:bg-emerald-100/60"
              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70"
          }`}
          title={isActive ? "Deactivate banner" : "Activate banner"}
        >
          {isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          <span>{isActive ? "Active" : "Disabled"}</span>
        </button>

        <button
          type="button"
          onClick={() => onPreview(item)}
          className="p-2 rounded-xl text-slate-600 hover:text-[#0f5c3e] hover:bg-[#e8f5ee] border border-slate-200 transition cursor-pointer"
          title="Live Viewport Previews"
        >
          <Eye size={16} />
        </button>

        <button
          type="button"
          onClick={() => onEdit(item)}
          className="p-2 rounded-xl text-slate-600 hover:text-[#0f5c3e] hover:bg-[#e8f5ee] border border-slate-200 transition cursor-pointer"
          title="Edit banner details"
        >
          <Edit2 size={16} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(item)}
          className="p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition cursor-pointer"
          title="Delete banner"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
