import React, { useState } from "react";
import "../style/Hyperlocal.css";

const CITIES = [
  { id: "haldia", label: "Haldia", active: true },
  { id: "panskura", label: "Panskura", active: false },
  { id: "tamluk", label: "Tamluk", active: false },
  { id: "mecheda", label: "Mecheda", active: false },
  { id: "medinipur", label: "Medinipur", active: false },
  { id: "kharagpur", label: "Kharagpur", active: false },
];

const HALDIA_BUSINESSES = [
  { id: 1, label: "Rental Service", x: 28, y: 24, type: "yellow" },
  { id: 2, label: "The Curry Leaf", x: 70, y: 32, type: "teal" },
  { id: 3, label: "Tailors & Laundry", x: 20, y: 58, type: "teal" },
  { id: 4, label: "Salon", x: 52, y: 54, type: "teal" },
  { id: 5, label: "Vehicle Repair", x: 82, y: 60, type: "yellow" },
  { id: 6, label: "Car Booking", x: 50, y: 84, type: "yellow" },
];

const DOT_COLORS = {
  teal: "var(--primary-lighter)",
  yellow: "var(--accent-yellow)",
  orange: "var(--accent-orange)",
};

export default function Hyperlocal() {
  const [selectedCity, setSelectedCity] = useState("haldia");
  const [hoveredDot, setHoveredDot] = useState(null);
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
    <section className="local-area-section">
      <div className="background-grid" aria-hidden="true" />

      <div className="local-area-container">

        {/* Left Content */}
        <div className="local-area-content">

          <span className="section-tag">
            Hyperlocal
          </span>

          <h2 className="section-heading font-heading">
            Businesses Right
            <br />
            Around You
          </h2>

          <p className="section-description font-primary">
            NeedMet shows verified shops and services within walking distance.
            Switch cities to explore nearby businesses.
          </p>

          <div
            className="city-list"
            role="group"
            aria-label="Select city"
          >
            {CITIES.map((city) => (
              <button
                key={city.id}
                className={[
                  "city-button",
                  selectedCity === city.id
                    ? "city-button-active"
                    : "",
                  !city.active
                    ? "city-button-disabled"
                    : "",
                  comingSoonCity === city.id
                    ? "city-button-coming"
                    : "",
                ].join(" ")}
                onClick={() => handleCityClick(city)}
                aria-pressed={selectedCity === city.id}
              >
                {selectedCity === city.id && city.active && (
                  <span className="live-chip-dot" aria-hidden="true" />
                )}

                {comingSoonCity === city.id
                  ? "Coming Soon!"
                  : city.label}
              </button>
            ))}
          </div>

        </div>

        {/* Map Section */}
        <div className="map-wrapper">

          <div
            className="business-map"
            aria-label="Local business map for Haldia"
          >

            {/* Grid */}
            <svg
              className="map-grid"
              width="100%"
              height="100%"
              aria-hidden="true"
            >
              {[20, 40, 60, 80].map((x) => (
                <line
                  key={`v-${x}`}
                  x1={`${x}%`}
                  y1="0"
                  x2={`${x}%`}
                  y2="100%"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1"
                />
              ))}

              {[25, 50, 75].map((y) => (
                <line
                  key={`h-${y}`}
                  x1="0"
                  y1={`${y}%`}
                  x2="100%"
                  y2={`${y}%`}
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1"
                />
              ))}
            </svg>

            {/* Business Dots */}
            {HALDIA_BUSINESSES.map((biz) => (
              <div
                key={biz.id}
                className="business-point"
                style={{
                  left: `${biz.x}%`,
                  top: `${biz.y}%`,
                }}
                onMouseEnter={() => setHoveredDot(biz.id)}
                onMouseLeave={() => setHoveredDot(null)}
              >
                <span
                  className="business-point-ring"
                  style={{ background: DOT_COLORS[biz.type] }}
                />

                <span
                  className="business-point-dot"
                  style={{ background: DOT_COLORS[biz.type] }}
                />

                <span
                  className={`business-label ${
                    hoveredDot === biz.id
                      ? "business-label-active"
                      : ""
                  }`}
                >
                  {biz.label}
                </span>
              </div>
            ))}

            {/* Live Badge */}
            <div className="live-status-badge">
              <span className="live-status-dot" aria-hidden="true"/>
              Haldia Live
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}