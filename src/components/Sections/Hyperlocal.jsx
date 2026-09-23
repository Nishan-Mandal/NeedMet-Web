import React, { useState } from "react";

const CITIES = [
  { id: "haldia",    label: "Haldia",     active: true  },
  { id: "panskura",  label: "Panskura",   active: false },
  { id: "tamluk",    label: "Tamluk",     active: false },
  { id: "mecheda",   label: "Mecheda",    active: false },
  { id: "medinipur", label: "Medinipur",  active: false },
  { id: "kharagpur", label: "Kharagpur",  active: false },
];

const HALDIA_BUSINESSES = [
  { id: 1, label: "Rental Service",    x: 28, y: 24, type: "yellow" },
  { id: 2, label: "The Curry Leaf",    x: 70, y: 32, type: "teal"   },
  { id: 3, label: "Tailors & Laundry", x: 20, y: 58, type: "teal"   },
  { id: 4, label: "Salon",             x: 52, y: 54, type: "teal"   },
  { id: 5, label: "Vehicle Repair",    x: 82, y: 60, type: "yellow" },
  { id: 6, label: "Car Booking",       x: 50, y: 84, type: "yellow" },
];

const DOT_COLORS = {
  teal:   "var(--primary-lighter, #22c47a)",
  yellow: "var(--accent-yellow, #f59e0b)",
  orange: "var(--accent-orange, #f97316)",
};

export default function Hyperlocal() {
  const [selectedCity,   setSelectedCity]   = useState("haldia");
  const [hoveredDot,     setHoveredDot]     = useState(null);
  const [comingSoonCity, setComingSoonCity] = useState(null);

  const handleCityClick = (city) => {
    if (city.active) {
      setSelectedCity(city.id);
      setComingSoonCity(null);
    } else {
      setComingSoonCity(city.id);
      setTimeout(() => setComingSoonCity(null), 2000);
    }
  };

  return (
    <section className="local-area-section relative bg-primary isolate overflow-hidden font-primary py-[45px] max-[992px]:py-[35px] max-[576px]:py-[30px]">

      {/* Dot grid background */}
      <div
        className="background-grid absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
        aria-hidden="true"
      />

      {/* Main container */}
      <div className="local-area-container relative z-[1] mx-auto grid items-center justify-between grid-cols-2 max-[992px]:grid-cols-[1fr_0.9fr] max-[576px]:grid-cols-1 gap-[34px] max-[992px]:gap-[26px] max-[576px]:gap-[30px] px-[70px] max-[992px]:px-8 max-[576px]:px-[18px]">

        {/* Left content */}
        <div className="local-area-content flex flex-col gap-[18px]">

          <span className="section-tag font-primary text-[11px] font-bold tracking-[0.2em] uppercase text-accent">
            Hyperlocal
          </span>

          <h2 className="section-heading font-heading m-0 text-text-on-dark font-bold tracking-[-0.03em] text-[clamp(36px,5vw,58px)] leading-[1.1] max-[992px]:text-[clamp(32px,6vw,46px)] max-[576px]:text-[34px] max-[576px]:leading-[1.15]">
            Businesses Right<br />Around You
          </h2>

          <p className="section-description font-primary m-0 text-text-light max-w-[390px] text-[14.5px] leading-[1.65] max-[576px]:text-[14px]">
            NeedMet shows verified shops and services within walking distance.
            Switch cities to explore nearby businesses.
          </p>

          {/* City Buttons */}
          <div className="city-list flex flex-wrap gap-2.5" role="group" aria-label="Select city">
            {CITIES.map((city) => {
              const isActive = selectedCity === city.id;
              const isComing = comingSoonCity === city.id;

              return (
                <button
                  key={city.id}
                  className={[
                    "city-button inline-flex items-center gap-[7px] px-4 py-[7px] rounded-full border border-white/20 bg-white/[0.08] text-text-on-dark font-primary text-[13px] font-medium cursor-pointer transition duration-200 ease-out hover:bg-white/[0.14]",
                    isActive               ? "city-button-active !bg-white !text-primary font-semibold"  : "",
                    !city.active           ? "city-button-disabled opacity-55" : "",
                    isComing               ? "city-button-coming !bg-[rgba(245,158,11,0.15)] !border-accent-yellow !text-accent-yellow !opacity-100"  : "",
                  ].join(" ")}
                  onClick={() => handleCityClick(city)}
                  aria-pressed={isActive}
                >
                  {isActive && city.active && (
                    <span className="live-chip-dot w-[7px] h-[7px] rounded-full bg-accent shrink-0 animate-[livePulse_1.5s_infinite]" aria-hidden="true" />
                  )}
                  {isComing ? "Coming Soon!" : city.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Section */}
        <div className="map-wrapper flex justify-center">
          <div
            className="business-map relative w-full overflow-hidden backdrop-blur-[4px] bg-white/[0.05] border border-white/[0.14] rounded-[20px] max-w-[500px] aspect-[500/290] max-[992px]:aspect-[250/260] max-[576px]:max-w-full max-[576px]:aspect-[400/200]"
            aria-label="Local business map for Haldia"
          >
            {/* SVG Grid */}
            <svg className="map-grid absolute inset-0 w-full h-full" width="100%" height="100%" aria-hidden="true">
              {[20, 40, 60, 80].map((x) => (
                <line key={`v-${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              ))}
              {[25, 50, 75].map((y) => (
                <line key={`h-${y}`} x1="0" y1={`${y}%`} y2="100%" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              ))}
            </svg>

            {/* Business Dots */}
            {HALDIA_BUSINESSES.map((biz) => (
              <div
                key={biz.id}
                className="business-point absolute -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 flex items-center justify-center z-[2] cursor-pointer"
                style={{ left: `${biz.x}%`, top: `${biz.y}%` }}
                onMouseEnter={() => setHoveredDot(biz.id)}
                onMouseLeave={() => setHoveredDot(null)}
              >
                <span
                  className="business-point-ring absolute inset-0 m-auto w-2.5 h-2.5 rounded-full opacity-40 z-[1] animate-[mapDotPulse_2s_ease-out_infinite]"
                  style={{ background: DOT_COLORS[biz.type] }}
                />
                <span
                  className="business-point-dot relative w-2.5 h-2.5 rounded-full border-2 border-white/70 z-[2] shrink-0"
                  style={{ background: DOT_COLORS[biz.type] }}
                />
                <span className={`business-label absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 font-primary font-semibold whitespace-nowrap rounded-full transition duration-200 ease-out text-[10px] px-[9px] py-1 max-[992px]:text-[9px] max-[992px]:px-2 max-[576px]:text-[8.5px] max-[576px]:px-[7px] max-[576px]:py-[3px] ${
                  hoveredDot === biz.id ? 'business-label-active bg-accent text-primary' : 'bg-white text-primary'
                }`}>
                  {biz.label}
                </span>
              </div>
            ))}

            {/* Live Badge */}
            <div className="live-status-badge absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#0f5c3e]/85 border border-[#4ade80]/30 py-[5px] px-2.5 rounded-full font-primary text-[10px] font-semibold text-accent">
              <span className="live-status-dot w-1.5 h-1.5 rounded-full bg-accent animate-[livePulse_1.5s_infinite]" aria-hidden="true" />
              Haldia Live
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
