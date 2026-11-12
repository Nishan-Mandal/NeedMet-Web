import React from "react";
import { Eye, X, Monitor, Smartphone, ExternalLink } from "lucide-react";

export default function BannerStandalonePreviewModal({
  previewItem,
  onClose,
}) {
  if (!previewItem) return null;

  const desktopSrc = previewItem.webUrl || previewItem.weburl || previewItem.imageUrl || previewItem.image;
  const mobileSrc = previewItem.imageUrl || previewItem.image || previewItem.webUrl || previewItem.weburl;
  const route = previewItem.route || previewItem.redirectUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold font-heading text-slate-900 text-base flex items-center gap-2">
              <Eye size={18} className="text-[#0f5c3e]" />
              Live Preview: {previewItem.title || "Banner"}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Destination: {route || "None"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Desktop Showcase */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Monitor size={15} className="text-[#0f5c3e]" />
                Desktop Banner (Wide Viewport)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {previewItem.webUrl || previewItem.weburl ? "Custom Desktop Asset" : "Fallback Asset"}
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={desktopSrc}
                alt="Desktop Banner Preview"
                className="w-full aspect-16/4 object-cover"
              />
            </div>
          </div>

          {/* Mobile Showcase */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Smartphone size={15} className="text-[#0f5c3e]" />
                Mobile Banner (Narrow Viewport)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {previewItem.imageUrl || previewItem.image ? "Mobile Optimized Asset" : "Fallback Asset"}
              </span>
            </div>
            <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={mobileSrc}
                alt="Mobile Banner Preview"
                className="w-full aspect-14/7 object-cover"
              />
            </div>
          </div>

          {/* Test Navigation Action */}
          {route && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="text-xs text-slate-600 truncate max-w-lg">
                <span className="font-semibold text-slate-800">Target: </span>
                <span className="font-mono">{route}</span>
              </div>
              <a
                href={route}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#e8f5ee] text-[#0f5c3e] rounded-full text-xs font-semibold hover:bg-emerald-100 transition"
              >
                <span>Test Link</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
