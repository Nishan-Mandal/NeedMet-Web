import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../../../components/ImageSlider";

const CHIPS = [
  { label: "Room Rent", emoji: "🏠" },
  { label: "Salons", emoji: "💇" },
  { label: "Restaurants", emoji: "🍽️" },
  { label: "Auto Services", emoji: "🚗" },
  { label: "Pharmacies", emoji: "💊" },
  { label: "Fitness", emoji: "🏋️" },
];

/* ── Stats ── */
const Stats = () => (
  <div className="flex w-full overflow-hidden border border-white/15 rounded-xl sm:rounded-[14px] bg-white/[0.08] backdrop-blur-md">
    {[
      { num: "500+", label: "Businesses Listed" },
      { num: "50+", label: "Categories Covered" },
      { num: "4.8★", label: "Avg. User Rating" },
    ].map((s, i) => (
      <div
        key={i}
        className={`flex-1 text-center py-3.5 sm:py-4 px-2 sm:px-[18px] ${
          i !== 2 ? "border-r border-white/10" : ""
        }`}
      >
        <div className="font-heading font-extrabold text-lg sm:text-2xl text-white leading-none">
          {s.num}
        </div>
        <div className="mt-1 text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.08em] uppercase text-white/50">
          {s.label}
        </div>
      </div>
    ))}
  </div>
);

/* ── Slider Panel ── */
function SliderPanel({ images }) {
  return (
    <div className="flex justify-center w-full p-1 sm:p-2 md:p-[18px] border border-white/15 rounded-lg sm:rounded-xl md:rounded-[22px] bg-white/[0.08] backdrop-blur-[14px] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
      <ImageSlider width="100%" slide={true} images={images} />
    </div>
  );
}

export default function Hero({ data }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = (term = "") => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      const q = typeof term === "string" ? term.trim() : "";
      if (q) {
        navigate(`/search?q=${encodeURIComponent(q)}`);
      } else {
        navigate("/search");
      }
    }, 150);
  };

  const placeholders = [
    "Rooms near me",
    "Best restaurants",
    "Medical shops",
    "Salons in Haldia",
    "Car repair center",
  ];

  const [placeholder, setPlaceholder] = useState("");

  const images =
    data?.promoBanners?.map((banner) => ({
      banner: banner.imageUrl,
      route: banner.route,
    })) || [];

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentWord = placeholders[wordIndex];
      if (isDeleting) {
        setPlaceholder(currentWord.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setPlaceholder(currentWord.substring(0, charIndex + 1));
        charIndex++;
      }
      if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => {
          isDeleting = true;
        }, 1200);
      }
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % placeholders.length;
      }
    };

    const interval = setInterval(type, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex items-center overflow-hidden font-heading rounded-b-[20px] max-[860px]:rounded-b-[20px] min-[861px]:rounded-b-[28px] py-9 px-5 max-[860px]:py-12 max-[860px]:px-8 min-[861px]:py-[50px] min-[861px]:px-12 min-[1081px]:py-20 min-[1081px]:px-[70px] bg-gradient-to-br from-[#0d3d2e] from-0% via-[#0f5c3e] via-38% to-[#1a8a5a] to-72%">
      {/* Decorative blobs */}
      <div
        className="pointer-events-none rounded-full absolute -top-[60px] right-0 w-[260px] h-[260px] min-[481px]:-top-[100px] min-[481px]:right-40 min-[481px]:w-[420px] min-[481px]:h-[420px]"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 196, 122, 0.16) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none rounded-full absolute -bottom-[60px] left-[28%] w-[300px] h-[300px] hidden min-[481px]:block"
        style={{
          background:
            "radial-gradient(circle, rgba(13, 61, 46, 0.5) 0%, transparent 70%)",
        }}
      />

      {/* Inner layout */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col min-[861px]:flex-row items-stretch min-[861px]:items-center justify-between gap-0 min-[861px]:gap-16">
        {/* ── LEFT ── */}
        <div className="flex-1 w-full max-w-full min-[861px]:max-w-[540px] text-white flex flex-col items-center min-[861px]:items-start">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 w-max mb-6 py-[5px] px-4 rounded-full text-[11px] font-bold tracking-[0.08em] border border-white/22 bg-white/[0.08] text-[#cff0de] font-primary">
            <span className="w-[7px] h-[7px] shrink-0 rounded-full bg-accent animate-pulse" />
            Haldia, West Bengal
          </div>

          {/* Headline */}
          <h1 className="font-heading font-extrabold mb-5 leading-[1.12] tracking-[-0.025em] text-center min-[861px]:text-left text-[1.75rem] min-[481px]:text-[clamp(2.2rem,3.6vw,3.2rem)]">
            Find Every Shop &amp; Service{" "}
            <span className="text-accent">Near You</span>
          </h1>

          {/* Subtext */}
          <p className="mb-5 min-[861px]:mb-8 text-center min-[861px]:text-left text-white/70 font-primary text-[0.95rem] leading-[1.65]">
            Discover local businesses, book services, and connect with your
            city — all in one place. From groceries to garages, NeedMet has you
            covered.
          </p>

          {/* Mobile block — shows slider + stats between subtext & search on ≤860px */}
          <div className="flex min-[861px]:hidden w-full flex-col gap-4 mb-7">
            <div className="flex justify-center w-full p-1 sm:p-[5px] border border-white/15 rounded-lg sm:rounded-xl bg-white/[0.08] backdrop-blur-[14px]">
              <ImageSlider width="100%" slide={true} images={images} />
            </div>
            <Stats />
          </div>

          {/* Search */}
          <div
            className={`relative z-10 flex items-center gap-2 mb-5 p-[5px] pl-[18px] rounded-full cursor-pointer bg-white w-full border-[1.5px] border-transparent hover:border-[#16684c]/20 shadow-[0_6px_28px_rgba(0,0,0,0.18)] hover:shadow-[0_10px_32px_rgba(13,92,58,0.24)] hover:-translate-y-0.5 transition-all duration-200 ${
              isTransitioning
                ? "scale-[1.025] shadow-[0_12px_38px_rgba(22,104,76,0.35)] border-[#16684c] opacity-90"
                : ""
            }`}
            onClick={() => handleSearchClick()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleSearchClick();
            }}
          >
            <svg
              className="shrink-0 text-[#6b7280]"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="flex-1 min-w-0 bg-transparent outline-none border-none text-[0.9rem] text-[#111827] placeholder:text-[#6b7280] font-primary"
              placeholder={`Try "${placeholder}"`}
              readOnly
              tabIndex={-1}
            />
            <button
              type="button"
              className="whitespace-nowrap rounded-full font-bold text-[0.8rem] min-[481px]:text-[0.88rem] py-2.5 px-4 min-[481px]:py-[11px] min-[481px]:px-[22px] text-white bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary-lighter hover:scale-105 active:scale-95 transition-all shadow-[0_4px_14px_rgba(13,92,58,0.35)]"
              onClick={(e) => {
                e.stopPropagation();
                handleSearchClick();
              }}
            >
              Search Now
            </button>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 min-[481px]:gap-2.5 justify-center min-[861px]:justify-start">
            {CHIPS.map((c) => (
              <button
                key={c.label}
                className="flex items-center gap-1.5 cursor-pointer rounded-full text-[11.5px] min-[481px]:text-[12.5px] font-medium py-1.5 px-3.5 min-[481px]:py-[7px] min-[481px]:px-4 border border-white/20 bg-white/[0.11] hover:bg-white/[0.22] hover:border-white/40 active:scale-95 text-white transition-all font-primary"
                onClick={() => handleSearchClick(c.label)}
              >
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT — desktop only ── */}
        <div className="hidden min-[861px]:flex flex-1 flex-col items-center justify-center gap-4">
          <SliderPanel images={images} />
          <Stats />
        </div>
      </div>
    </section>
  );
}