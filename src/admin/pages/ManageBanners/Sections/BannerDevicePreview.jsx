import React from "react";
import {
  Eye,
  Monitor,
  Smartphone,
  ExternalLink,
  Image as ImageIcon,
  Info,
} from "lucide-react";

export default function BannerDevicePreview({
  webUrl = "",
  imageUrl = "",
  route = "",
}) {
  const desktopSrc = webUrl || imageUrl;
  const mobileSrc = imageUrl || webUrl;

  return (
    <div className="bg-slate-100/70 p-4 rounded-3xl border border-slate-200 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Eye size={14} className="text-[#0f5c3e]" />
          Live Device Previews
        </h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#0f5c3e] font-semibold">
          Auto-Updates
        </span>
      </div>

      {/* 1. Desktop Browser Frame Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
        {/* Browser Chrome Header */}
        <div className="bg-slate-200/80 px-3 py-1.5 border-b border-slate-200 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
          </div>
          <div className="flex-1 bg-white rounded-md px-2 py-0.5 text-[10px] text-slate-500 font-mono truncate text-center">
            needmet.com
          </div>
          <Monitor size={12} className="text-slate-400" />
        </div>

        {/* Desktop Banner Viewport */}
        <div className="p-3 bg-slate-50">
          <div className="relative w-full aspect-16/4 rounded-xl overflow-hidden bg-slate-200 border border-slate-200/80 flex items-center justify-center group/desk">
            {desktopSrc ? (
              <img
                src={desktopSrc}
                alt="Desktop Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="text-center p-3">
                <ImageIcon size={22} className="mx-auto text-slate-400 mb-1" />
                <p className="text-[10px] text-slate-500 font-medium">Desktop Preview</p>
                <p className="text-[9px] text-slate-400">Enter desktop image URL</p>
              </div>
            )}

            {route && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/desk:opacity-100 transition flex items-center justify-center p-2 text-center">
                <span className="bg-white/90 text-slate-900 text-[10px] font-semibold px-2 py-1 rounded-md shadow-xs flex items-center gap-1">
                  <ExternalLink size={10} />
                  Redirects to: {route}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Mobile Smartphone Frame Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
            <Smartphone size={12} className="text-[#0f5c3e]" />
            Mobile Viewport (768px & below)
          </span>
          <span className="text-[10px] text-slate-400 font-mono">14:7 ratio</span>
        </div>

        {/* Smartphone Bezel */}
        <div className="max-w-[280px] mx-auto bg-slate-900 rounded-[28px] p-2.5 shadow-lg border-2 border-slate-800">
          {/* Notch / Speaker bar */}
          <div className="w-16 h-1.5 bg-slate-700 rounded-full mx-auto mb-2"></div>

          {/* Screen Container */}
          <div className="bg-slate-100 rounded-[18px] p-2 overflow-hidden">
            <div className="relative w-full aspect-14/7 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center group/mob">
              {mobileSrc ? (
                <img
                  src={mobileSrc}
                  alt="Mobile Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-center p-2">
                  <Smartphone size={20} className="mx-auto text-slate-400 mb-0.5" />
                  <p className="text-[9px] text-slate-500 font-medium">Mobile Preview</p>
                  <p className="text-[8px] text-slate-400">Enter mobile image URL</p>
                </div>
              )}

              {route && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/mob:opacity-100 transition flex items-center justify-center p-1 text-center">
                  <span className="bg-white/95 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs truncate max-w-[90%]">
                    {route}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Phone Home Bar */}
          <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-2"></div>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-1.5">
        <Info size={14} className="text-[#0f5c3e] shrink-0 mt-0.5" />
        <span>
          Storefront renders the mobile image on devices ≤ 768px, and desktop image on larger viewports.
        </span>
      </div>
    </div>
  );
}
