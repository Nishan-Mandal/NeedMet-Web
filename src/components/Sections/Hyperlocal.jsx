import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CITIES = [
  { id: "haldia",    label: "Haldia",    active: true },
  { id: "tamluk",    label: "Tamluk",    active: false },
  { id: "panskura",  label: "Panskura",  active: false },
  { id: "mecheda",   label: "Mecheda",   active: false },
  { id: "medinipur", label: "Medinipur", active: false },
  { id: "kharagpur", label: "Kharagpur", active: false },
];

// Real verified search categories available on NeedMet
const HALDIA_CATEGORIES = [
  {
    id: "cat-rent",
    label: "Room Rent",
    query: "Room Rent",
    category: "Accommodation",
    icon: "home",
    type: "yellow",
    x: 28,
    y: 22,
    rating: "4.8",
    distance: "350m",
  },
  {
    id: "cat-restaurant",
    label: "Restaurants",
    query: "Restaurants",
    category: "Food & Dining",
    icon: "restaurant",
    type: "teal",
    x: 70,
    y: 28,
    rating: "4.9",
    distance: "420m",
  },
  {
    id: "cat-laundry",
    label: "Tailors & Laundry",
    query: "Tailors & Laundry",
    category: "Services",
    icon: "local_laundry_service",
    type: "teal",
    x: 22,
    y: 52,
    rating: "4.7",
    distance: "280m",
  },
  {
    id: "cat-salon",
    label: "Salons",
    query: "Salons",
    category: "Beauty & Grooming",
    icon: "spa",
    type: "teal",
    x: 52,
    y: 48,
    rating: "4.8",
    distance: "180m",
  },
  {
    id: "cat-repair",
    label: "Vehicle Repair",
    query: "Mechanics & Vehicle Repair",
    category: "Automobile",
    icon: "build",
    type: "yellow",
    x: 80,
    y: 56,
    rating: "4.7",
    distance: "650m",
  },
  {
    id: "cat-pharmacy",
    label: "Pharmacies",
    query: "Pharmacies",
    category: "Healthcare",
    icon: "local_pharmacy",
    type: "yellow",
    x: 50,
    y: 78,
    rating: "4.9",
    distance: "250m",
  },
];

const DOT_COLORS = {
  teal:   { ring: "rgba(74, 222, 128, 0.4)", core: "#22c47a", glow: "#4ade80" },
  yellow: { ring: "rgba(245, 158, 11, 0.4)", core: "#f59e0b", glow: "#fbbf24" },
};

export default function Hyperlocal() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("haldia");
  const [comingSoonCity, setComingSoonCity] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const handleCityClick = (city) => {
    if (city.active) {
      setSelectedCity(city.id);
      setComingSoonCity(null);
    } else {
      setComingSoonCity(city.id);
      setTimeout(() => {
        setComingSoonCity((prev) => (prev === city.id ? null : prev));
      }, 2200);
    }
  };

  const handleCategorySearch = (cat) => {
    navigate(`/search?q=${encodeURIComponent(cat.query)}`);
  };

  return (
    <section className="relative bg-[var(--primary)] isolate overflow-hidden font-primary py-[48px] max-[992px]:py-[38px] max-[576px]:py-[32px] text-white ">
      <style>{`
        @keyframes mapPulseRing {
          0% { transform: scale(1); opacity: 0.7; }
          70% { transform: scale(3.2); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes radarUserWave {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.6); opacity: 0.25; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes liveBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
        .animate-map-pulse {
          animation: mapPulseRing 2.4s ease-out infinite;
        }
        .animate-radar-wave {
          animation: radarUserWave 3s cubic-bezier(0.2, 0.6, 0.35, 1) infinite;
        }
        .animate-live-dot {
          animation: liveBlink 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* Background Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="relative z-[1] mx-auto grid items-center justify-between grid-cols-1 lg:grid-cols-2 gap-[36px] max-[992px]:gap-[28px] max-[576px]:gap-[30px] px-[18px] sm:px-8 lg:px-[70px]">
        
        {/* Left Column: Context & City Selectors */}
        <div className="flex flex-col gap-[20px] max-w-[540px]">
          <span className="font-primary text-[11px] font-bold tracking-[0.22em] uppercase text-[var(--accent-emerald,#4ade80)]">
            Hyperlocal Discovery
          </span>

          <h2 className="font-heading m-0 text-white font-bold tracking-[-0.03em] text-[clamp(34px,4.5vw,54px)] leading-[1.12]">
            Businesses Right<br />Around You
          </h2>

          <p className="font-primary m-0 text-white/75 text-[15px] leading-[1.65] max-w-[440px]">
            NeedMet shows verified services and shops within walking distance. 
            Click any category tag on the map to search live verified listings instantly.
          </p>

          {/* City Buttons with Coming Soon State */}
          <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Select city">
            {CITIES.map((city) => {
              const isActive = selectedCity === city.id;
              const isComing = comingSoonCity === city.id;

              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCityClick(city)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[var(--primary)] border-white shadow-md font-bold scale-[1.03]"
                      : isComing
                      ? "bg-amber-500/20 border-amber-400 text-amber-300 font-bold animate-pulse"
                      : "bg-white/[0.08] hover:bg-white/[0.16] text-white/90 border-white/20 hover:border-white/40 opacity-80 hover:opacity-100"
                  }`}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald,#4ade80)] animate-live-dot" />
                  )}
                  <span>{isComing ? "Coming Soon!" : city.label}</span>
                
                </button>
              );
            })}
          </div>

          {/* Quick Search Hint */}
          <div className="flex items-center gap-2 text-xs text-white/70 pt-2 border-t border-white/10">
            <span className="material-symbols-outlined text-[17px] text-[var(--accent-emerald,#4ade80)]">
              near_me
            </span>
            <span>
              Click any category tag on the map to view real verified listings
            </span>
          </div>
        </div>

        {/* Right Column: Stylized Map Canvas with Graphics & Clickable Real Category Tags */}
        <div className="flex justify-center w-full">
          <div
            className="relative w-full max-w-[560px] aspect-[540/330] max-[992px]:aspect-[500/320] max-[576px]:aspect-[400/290] overflow-hidden rounded-[22px] border border-white/20 bg-[#0a442e]/90 shadow-[0_16px_40px_rgba(0,0,0,0.25)] select-none"
            aria-label="Interactive local business map for Haldia"
          >
            {/* REAL MAP GRAPHICS (Expressway, Roundabout, Arterial Grid, Waterfront, Parks) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 540 330"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* River water gradient */}
                <linearGradient id="haldiaWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#08382b" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0e5944" stopOpacity="0.95" />
                </linearGradient>

                {/* Park green gradient */}
                <linearGradient id="haldiaParkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#156649" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#1a7a58" stopOpacity="0.35" />
                </linearGradient>
              </defs>

              {/* Water Canal / Port Basin at bottom */}
              <path
                d="M -20,290 Q 140,250 280,285 T 560,260 L 560,350 L -20,350 Z"
                fill="url(#haldiaWaterGrad)"
              />
              <path
                d="M -20,290 Q 140,250 280,285 T 560,260"
                fill="none"
                stroke="rgba(74, 222, 128, 0.2)"
                strokeWidth="1.5"
              />

              {/* Green Parks & Open Grounds */}
              <path
                d="M 30,20 C 90,15 130,55 110,110 C 80,150 20,130 15,60 Z"
                fill="url(#haldiaParkGrad)"
              />
              <path
                d="M 400,30 C 470,25 520,70 500,130 C 460,170 380,140 390,70 Z"
                fill="url(#haldiaParkGrad)"
              />

              {/* Secondary Street Grid Lines */}
              <g stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2.5" strokeLinecap="round">
                <line x1="-20" y1="75" x2="560" y2="75" />
                <line x1="-20" y1="140" x2="560" y2="140" />
                <line x1="-20" y1="230" x2="560" y2="230" />
                <line x1="120" y1="-20" x2="120" y2="350" />
                <line x1="420" y1="-20" x2="420" y2="350" />
              </g>

              {/* Primary Expressway (NH 116 / Port Corridor) */}
              <g fill="none">
                <path
                  d="M -20,130 C 140,165 340,90 560,120"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M -20,130 C 140,165 340,90 560,120"
                  stroke="#083828"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M -20,130 C 140,165 340,90 560,120"
                  stroke="rgba(255, 255, 255, 0.45)"
                  strokeWidth="1.2"
                  strokeDasharray="5 5"
                />
              </g>

              {/* Central Roundabout & Arterial Corridors */}
              <g fill="none">
                <circle
                  cx="270"
                  cy="170"
                  r="26"
                  stroke="rgba(255, 255, 255, 0.18)"
                  strokeWidth="6"
                />
                <circle
                  cx="270"
                  cy="170"
                  r="26"
                  stroke="#083828"
                  strokeWidth="4"
                />
                <path
                  d="M 270,-20 L 270,144 M 270,196 L 270,350"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="7"
                />
                <path
                  d="M 270,-20 L 270,144 M 270,196 L 270,350"
                  stroke="#083828"
                  strokeWidth="4"
                />
                <path
                  d="M -20,170 L 244,170 M 296,170 L 560,170"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="7"
                />
                <path
                  d="M -20,170 L 244,170 M 296,170 L 560,170"
                  stroke="#083828"
                  strokeWidth="4"
                />
              </g>

              {/* Concentric Distance Rings */}
              <circle
                cx="270"
                cy="170"
                r="65"
                fill="none"
                stroke="rgba(74, 222, 128, 0.25)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle
                cx="270"
                cy="170"
                r="135"
                fill="none"
                stroke="rgba(74, 222, 128, 0.15)"
                strokeWidth="1"
                strokeDasharray="6 6"
              />

              {/* Distance Labels */}
              <text x="276" y="112" fill="rgba(74,222,128,0.7)" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">
                300m
              </text>
              <text x="276" y="44" fill="rgba(74,222,128,0.5)" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">
                800m
              </text>

              {/* Street Names */}
              <text x="25" y="120" fill="rgba(255,255,255,0.35)" fontSize="8" fontWeight="600" letterSpacing="0.8" fontFamily="sans-serif">
                MAIN LINK WAY
              </text>
              <text x="350" y="105" fill="rgba(255,255,255,0.35)" fontSize="8" fontWeight="600" letterSpacing="0.8" fontFamily="sans-serif">
                TOWNSHIP ARTERY
              </text>
              <text x="280" y="240" fill="rgba(255,255,255,0.35)" fontSize="8" fontWeight="600" letterSpacing="0.8" fontFamily="sans-serif">
                SECTOR 2 CORRIDOR
              </text>
              <text x="40" y="318" fill="rgba(74,222,128,0.5)" fontSize="8" fontWeight="700" letterSpacing="0.8" fontFamily="sans-serif">
                PORT BASIN
              </text>
            </svg>

            {/* Central "You Are Here" Location Marker */}
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: "50%", top: "51.5%" }}
            >
              <div className="absolute -inset-3.5 rounded-full bg-emerald-400/25 animate-radar-wave" />
              <div
                className="absolute -inset-7 rounded-full bg-emerald-400/15 animate-radar-wave"
                style={{ animationDelay: "1s" }}
              />
              <div className="relative w-3.5 h-3.5 rounded-full bg-white border-2 border-[var(--primary)] shadow-[0_0_10px_rgba(255,255,255,0.8)] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              </div>
            </div>

            {/* CLICKABLE REAL CATEGORY TAGS & PULSING DOTS */}
            {HALDIA_CATEGORIES.map((cat) => {
              const dotStyle = DOT_COLORS[cat.type] || DOT_COLORS.teal;
              const isHovered = hoveredCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  style={{ left: `${cat.x}%`, top: `${cat.y}%` }}
                >
                  {/* Clickable Category Pill Tag */}
                  <button
                    type="button"
                    onClick={() => handleCategorySearch(cat)}
                    onMouseEnter={() => setHoveredCategory(cat.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full transition-all duration-200 cursor-pointer shadow-md border py-1 px-3 text-[11px] max-[992px]:text-[10px] max-[992px]:px-2.5 max-[576px]:text-[9.5px] max-[576px]:px-2 max-[576px]:py-0.5 ${
                      isHovered
                        ? "bg-[var(--accent-emerald,#4ade80)] text-[var(--primary)] border-[var(--accent-emerald,#4ade80)] scale-110 font-bold shadow-[0_4px_16px_rgba(74,222,128,0.4)] z-30"
                        : "bg-white text-[var(--primary)] border-white/80 hover:bg-emerald-50 font-semibold"
                    }`}
                    title={`Search verified ${cat.label} in Haldia`}
                  >
                    <span>{cat.label}</span>
                    <span className="material-symbols-outlined text-[13px] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      north_east
                    </span>
                  </button>

                  {/* Pulsing Coordinate Dot under Tag */}
                  <button
                    type="button"
                    onClick={() => handleCategorySearch(cat)}
                    onMouseEnter={() => setHoveredCategory(cat.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className="relative w-4 h-4 flex items-center justify-center cursor-pointer border-0 bg-transparent p-0"
                    title={`Search ${cat.label}`}
                  >
                    <span
                      className="absolute inset-0 rounded-full animate-map-pulse"
                      style={{ background: dotStyle.ring }}
                    />
                    <span
                      className="relative w-2.5 h-2.5 rounded-full border-2 border-white/85 shadow-sm transition-transform duration-200 group-hover:scale-125"
                      style={{
                        background: dotStyle.core,
                        boxShadow: `0 0 8px ${dotStyle.glow}`,
                      }}
                    />
                  </button>

                  {/* Micro Tooltip on Hover showing rating & distance */}
                  {isHovered && (
                    <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 bg-[#092e21]/95 text-white text-[9.5px] px-2 py-0.5 rounded-md whitespace-nowrap border border-white/20 shadow-lg pointer-events-none flex items-center gap-1.5 z-40">
                      <span className="text-amber-400 font-bold">★ {cat.rating}</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/80">{cat.distance} away</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom-Left Radar Mode Pill */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#0a3525]/85 border border-white/15 py-1 px-2.5 rounded-full text-[10px] font-medium text-white/80 shadow-xs pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald,#4ade80)]" />
              <span>Street Grid Radar</span>
            </div>

            {/* Bottom-Right Live Badge for Haldia */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#0f5c3e]/90 border border-[#4ade80]/30 py-[5px] px-3 rounded-full font-primary text-[10px] font-semibold text-[var(--accent-emerald,#4ade80)] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald,#4ade80)] animate-live-dot" aria-hidden="true" />
              <span>Haldia Live</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
