import React from "react";
import {
  Edit2,
  Trash2,
  Sparkles,
  Power,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function PartnerTableSection({
  partners = [],
  loading = false,
  onEdit,
  onDelete,
  onToggleStatus,
  onMove,
}) {
  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="w-8 h-8 border-3 border-[#0f5c3e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600">Loading partners directory...</p>
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <Sparkles size={32} className="text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-700">No partners found</p>
        <p className="text-xs text-slate-500 mt-1">
          Add partners with a logo and name to populate the live marquee on the homepage.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden font-primary">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4">Partner</th>
              <th className="py-3.5 px-4 text-center">Display Order</th>
              <th className="py-3.5 px-4">Homepage Visibility</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {partners.map((partner, index) => {
              return (
                <tr
                  key={partner.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Partner Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <img
                          src={partner.logo || partner.img}
                          alt={partner.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/48?text=?";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 text-sm truncate block">
                          {partner.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {partner.id?.slice(0, 10)}...
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Display Order with Up/Down Buttons */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/70">
                      <span className="font-mono font-bold text-slate-700 text-xs min-w-[20px]">
                        #{index + 1}
                      </span>
                      {onMove && (
                        <div className="flex flex-col -space-y-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => onMove(index, "up")}
                            className="text-slate-400 hover:text-[#0f5c3e] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed p-0.5"
                            title="Move Up"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={index === partners.length - 1}
                            onClick={() => onMove(index, "down")}
                            className="text-slate-400 hover:text-[#0f5c3e] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed p-0.5"
                            title="Move Down"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Active Toggle Status */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(partner.id, partner.isActive !== false)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                        partner.isActive !== false
                          ? "bg-emerald-50 text-[#0f5c3e] border-[#d1fae5] hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                      }`}
                      title={partner.isActive !== false ? "Visible on home page (Click to hide)" : "Hidden from home page (Click to show)"}
                    >
                      <Power size={10} />
                      <span>{partner.isActive !== false ? "Active on Home" : "Hidden"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(partner)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0f5c3e] hover:bg-[#e8f5ee] transition cursor-pointer"
                        title="Edit Partner"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(partner.id, partner.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Partner"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
