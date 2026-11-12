import React from "react";
import { Eye, ExternalLink } from "lucide-react";

export default function PartnerMarqueePreviewSection({ partners = [] }) {
  const activeBrands = (Array.isArray(partners) && partners.length > 0 ? partners : [])
    .filter((b) => b.isActive !== false);

  let repeatedList = [...activeBrands];
  while (repeatedList.length > 0 && repeatedList.length < 12) {
    repeatedList = [...repeatedList, ...activeBrands];
  }
  const marqueeList = [...repeatedList, ...repeatedList];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 font-primary space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-heading font-bold text-slate-900 text-base flex items-center gap-2">
            <Eye size={18} className="text-[#0f5c3e]" />
            <span>Live Brand Partner & Dealer Marquee Preview</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time preview of the continuous infinite marquee displayed on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#0f5c3e] text-white">
            Active in Marquee: {activeBrands.length}
          </span>
        </div>
      </div>

      {/* Embedded Live Marquee */}
      <div className="bg-[#f7faf8] rounded-2xl p-6 border border-slate-100 shadow-inner overflow-hidden">
        {activeBrands.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No active partners found. Enable or add partners to preview the live marquee.
          </div>
        ) : (
          <div className="relative w-full overflow-hidden group">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#f7faf8] via-[#f7faf8]/80 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#f7faf8] via-[#f7faf8]/80 to-transparent z-10" />

            <div className="flex w-max animate-brand-marquee group-hover:[animation-play-state:paused] py-2 gap-3 sm:gap-4 select-none">
              {marqueeList.map((brand, index) => {
                const content = (
                  <div
                    className="w-[130px] sm:w-[160px] md:w-[175px] h-[72px] sm:h-[84px] md:h-[90px] rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 flex items-center justify-center p-3 sm:p-4 shrink-0 hover:scale-105 hover:border-[#0f5c3e]/40"
                    title={brand.name}
                  >
                    <img
                      src={brand.logo || brand.img}
                      alt={brand.name || "Brand Logo"}
                      className="max-h-full max-w-full object-contain filter contrast-105"
                      loading="lazy"
                    />
                  </div>
                );

                return brand.website ? (
                  <a
                    key={`${brand.id || index}-${index}`}
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={`${brand.id || index}-${index}`}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { PartnerMarqueePreviewSection as PartnerOrbitalPreviewSection };
