import React from "react";

const PILLARS = [
  {
    step: "01",
    tag: "Trust First",
    icon: "verified_user",
    title: "Verified Businesses",
    description:
      "Every listing is vetted and community-reviewed for authenticity so you never call a dead line.",
  },
  {
    step: "02",
    tag: "Proximity",
    icon: "distance",
    title: "Hyperlocal Discovery",
    description:
      "Find essential services in your exact neighborhood within minutes, sorted by real street distance.",
  },
  {
    step: "03",
    tag: "Speed",
    icon: "bolt",
    title: "Lightning Fast Search",
    description:
      "Instant autocomplete and category filters get you answers immediately without complex registrations.",
  },
  {
    step: "04",
    tag: "Zero Fees",
    icon: "chat",
    title: "Direct Free Contact",
    description:
      "Connect directly via phone, WhatsApp, or directions with zero hidden booking commissions.",
  },
];

export default function WhyDiscoverNeedMet({ bgColor = "var(--background, #ffffff)" }) {
  return (
    <section
      className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-16 font-primary bg-white transition-colors"
      style={{ backgroundColor: bgColor || "#ffffff" }}
    >
      <div className="max-w-8xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-5 sm:mb-8">
          <span className="font-primary text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase text-[#0f5c3e] mb-1.5 sm:mb-2 block">
            Built for Community
          </span>
          <h2 className="font-heading font-extrabold text-gray-900 tracking-tight leading-[1.2] text-xl sm:text-2xl lg:text-3xl m-0">
            Why discover with NeedMet?
          </h2>
          <p className="font-primary text-[13px] sm:text-[15px] text-gray-600 mt-1.5 sm:mt-2 max-w-2xl leading-relaxed m-0">
            We cut out the middlemen and noise, delivering pure, verified local access.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.step}
              className="group p-4 sm:p-5 lg:p-6 rounded-2xl bg-white sm:bg-[#0f5c3e]/[0.03] hover:bg-[#0f5c3e]/[0.06] border border-[#0f5c3e]/15 hover:border-[#0f5c3e]/30 shadow-[0_2px_12px_rgba(15,92,62,0.04)] sm:shadow-none hover:shadow-[0_10px_28px_rgba(15,92,62,0.08)] sm:hover:-translate-y-1 transition-all duration-300 flex flex-row sm:flex-col items-start gap-3.5 sm:gap-4"
            >
              {/* Icon Badge */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0f5c3e]/8 text-[#0f5c3e] flex items-center justify-center shrink-0 border border-[#0f5c3e]/15 group-hover:bg-[#0f5c3e] group-hover:text-white group-hover:border-[#0f5c3e] transition-all duration-300">
                <span className="material-symbols-outlined text-[23px] sm:text-[26px]">
                  {pillar.icon}
                </span>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                <div>
                  {/* Step & Tag Pills */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider bg-[#0f5c3e]/10 text-[#0f5c3e]">
                      {pillar.step}
                    </span>
                    <span className="text-[11px] sm:text-[12px] font-semibold text-[#0f5c3e]/80 uppercase tracking-wide">
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-[15px] sm:text-[17px] font-bold text-gray-900 group-hover:text-[#0f5c3e] transition-colors duration-200 m-0 leading-snug">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="font-primary text-[12.5px] sm:text-[13.5px] text-gray-600 mt-1 sm:mt-2 leading-relaxed m-0">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
