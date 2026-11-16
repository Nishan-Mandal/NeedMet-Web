import React, { useRef, useState } from "react";

export default function WhyDiscoverNeedMet({ bgColor = "" }) {
  const scrollRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Track active slide index during horizontal swipe on mobile
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const firstCard = container.firstElementChild;
    const cardWidth = firstCard ? firstCard.offsetWidth : container.clientWidth * 0.85;
    const gap = 24;
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    setActiveSlide(Math.min(Math.max(newIndex, 0), 3));
  };

  const scrollToSlide = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const targetChild = container.children[index];
    if (targetChild) {
      targetChild.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setActiveSlide(index);
    }
  };

  return (
    <section
      className="relative w-full px-[18px] sm:px-8 lg:px-[70px] py-[35px] sm:py-[45px] lg:py-[55px] overflow-hidden font-primary bg-[#F8FCF9]"
      style={{
        backgroundColor: bgColor || "#F8FCF9",
      }}
    >
      {/* ── Ambient Decorative Background Gradients ── */}
      <div className="absolute inset-0 pointer-events-none custom-gradient-mesh -z-10" />
      <div className="absolute top-12 right-20 w-96 h-96 rounded-full bg-[#B8E0AC]/30 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#DCFCE7]/50 blur-3xl -z-10 pointer-events-none" />

      <div className="w-full">
        {/* ── Header Section ── */}
        <header className="relative mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div className="max-w-2xl">
              {/* Kicker Tag */}
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-[1.5px] w-5 bg-[#02542D]/60 rounded-full" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#02542D]">
                  Built For Your Community
                </span>
                <span className="h-[1.5px] w-8 bg-[#02542D]/40 rounded-full" />
              </div>

              {/* Main Title */}
              <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.15] font-heading m-0">
                Why discover with <span className="text-[#02542D]">NeedMet?</span>
              </h2>

              {/* Subtitle Copy */}
              <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
                We cut out the middlemen and noise, delivering pure, verified local access.
              </p>
            </div>

            {/* Handwritten Annotation Badge */}
            <div className="hidden sm:block relative self-start md:self-auto pb-2 pr-6 select-none">
              <div className="text-right">
                <p
                  className="font-hand text-lg sm:text-xl font-bold text-slate-700 leading-tight rotate-[-4deg]"
                  style={{ fontFamily: "var(--font-hand, 'Caveat', cursive)" }}
                >
                  Real Businesses.<br />
                  Real People.<br />
                  <span className="text-[#02542D]">Real Nearby.</span>
                </p>
              </div>
              {/* Hand-drawn curved arrow indicator */}
              <svg
                className="absolute -bottom-6 right-8 w-20 h-10 text-[#02542D] stroke-current fill-none overflow-visible pointer-events-none"
                viewBox="0 0 100 45"
                aria-hidden="true"
              >
                <path
                  d="M 90 2 C 70 20, 30 25, 10 32"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="0"
                />
                <path
                  d="M 18 24 L 8 33 L 20 38"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* ── 4 Feature Cards Grid ──
            • Mobile (<sm): Horizontal Swiping Carousel with snap & indicator dots.
            • Desktop & Tablet (sm+): 2-Column Grid as defined in temp.html */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex sm:grid sm:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory no-scrollbar px-4 -mx-4 sm:px-0 sm:mx-0 pb-4 sm:pb-0 scroll-smooth"
        >
          {/* ── CARD 01: Verified Businesses ── */}
          <article className="relative bg-white rounded-3xl p-7 sm:p-9 border border-emerald-100/80 shadow-[0_10px_35px_-8px_rgba(2,84,45,0.06)] hover:shadow-[0_16px_40px_-10px_rgba(2,84,45,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden group w-[86vw] xs:w-[84vw] max-w-[360px] sm:max-w-none sm:w-auto shrink-0 snap-center sm:snap-align-none">
            {/* Background subtle glow & dots */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#DCFCE7]/40 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-6 top-6 w-32 h-32 bg-dot-pattern opacity-30 pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10 h-full">
              {/* Text Content */}
              <div className="sm:col-span-7 flex flex-col items-start justify-center h-full">
                <div>
                  {/* Badge Number */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold tracking-wider text-slate-700 mb-4">
                    <span className="font-bold text-[#02542D]">01</span>
                    <span className="text-slate-400">|</span>
                    <span className="uppercase text-[11px] font-bold text-[#02542D] tracking-wider">Trust First</span>
                  </div>

                  <h3 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-snug font-heading">
                    Verified Businesses
                  </h3>

                  <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed font-primary">
                    Every listing is vetted and community-reviewed for authenticity so you never call a dead line.
                  </p>
                </div>

                {/* Mobile-only illustration view */}
                <div className="sm:hidden w-full flex justify-center items-center mt-4">
                  <div className="relative w-44 h-44 aspect-square flex items-center justify-center">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgXPhZtaALZSEdIz1oEz81ZeJ2JhZbeLr5Ofg8PWQAA8ARYUW0WO0htiwzud-_-q_cWMJBcvdPGbAQ_lngDdvHAA1zlkASTLSkKmMoTllKPTormQYsI_3oPZIpbJs_WiIHSZzHYDdPHiMlRW2IqtV8GtXReK8E04ez0iCMPddIUWMN-acc9URdw4ZrJ5MZsYu_tLQtyxTh0l7Sr6Um4dum1SE0E0r4Ivm8oZsH5fOI0tC3tp_yXdlpGw"
                      alt="3D isometric verified business shield"
                      className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(2,84,45,0.12)] transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop 3D Isometric Illustration */}
              <div className="hidden sm:flex sm:col-span-5 justify-center items-center relative">
                <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgXPhZtaALZSEdIz1oEz81ZeJ2JhZbeLr5Ofg8PWQAA8ARYUW0WO0htiwzud-_-q_cWMJBcvdPGbAQ_lngDdvHAA1zlkASTLSkKmMoTllKPTormQYsI_3oPZIpbJs_WiIHSZzHYDdPHiMlRW2IqtV8GtXReK8E04ez0iCMPddIUWMN-acc9URdw4ZrJ5MZsYu_tLQtyxTh0l7Sr6Um4dum1SE0E0r4Ivm8oZsH5fOI0tC3tp_yXdlpGw"
                    alt="3D isometric verified business shield"
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(2,84,45,0.12)] transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </article>

          {/* ── CARD 02: Hyperlocal Discovery ── */}
          <article className="relative bg-white rounded-3xl p-7 sm:p-9 border border-emerald-100/80 shadow-[0_10px_35px_-8px_rgba(2,84,45,0.06)] hover:shadow-[0_16px_40px_-10px_rgba(2,84,45,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden group w-[86vw] xs:w-[84vw] max-w-[360px] sm:max-w-none sm:w-auto shrink-0 snap-center sm:snap-align-none">
            {/* Background subtle glow & dots */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-8 top-8 w-32 h-32 bg-dot-pattern opacity-30 pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10 h-full">
              {/* Text Content */}
              <div className="sm:col-span-7 flex flex-col items-start justify-center h-full">
                <div>
                  {/* Badge Number */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold tracking-wider text-slate-700 mb-4">
                    <span className="font-bold text-[#02542D]">02</span>
                    <span className="text-slate-400">|</span>
                    <span className="uppercase text-[11px] font-bold text-[#02542D] tracking-wider">Local Proximity</span>
                  </div>

                  <h3 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-snug font-heading">
                    Hyperlocal Discovery
                  </h3>

                  <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed font-primary">
                    Find essential services in your exact neighborhood within minutes, sorted by real street distance.
                  </p>
                </div>

                {/* Mobile-only illustration view */}
                <div className="sm:hidden w-full flex justify-center items-center mt-4">
                  <div className="relative w-44 h-44 aspect-square flex items-center justify-center">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh7tCLWhdRN9dssgMMqskkL4jwsn-TDlaurXqSB1oUw1fWOy_m936NuX3kJx8_FjlcpZRkEYu1DBcj5bXpzf2V7xsw7x2zZKuOG6LU7HlqMaHoaix_C0RT0KfaufmkynkK26V3F2P4oAH_F0Mj_nF8ZGMlcwHkKgXCIbwsS9CuRGj-Qfi5AuwHMqUZLHKzd-wjFg5GrS34XEHVcFchwXv5vcwdCw-rWEKgcS7Wz9nJPHnFLJFcX3TiCA"
                      alt="3D isometric neighborhood map pin"
                      className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(2,84,45,0.12)] transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop 3D Isometric Illustration */}
              <div className="hidden sm:flex sm:col-span-5 justify-center items-center relative">
                <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh7tCLWhdRN9dssgMMqskkL4jwsn-TDlaurXqSB1oUw1fWOy_m936NuX3kJx8_FjlcpZRkEYu1DBcj5bXpzf2V7xsw7x2zZKuOG6LU7HlqMaHoaix_C0RT0KfaufmkynkK26V3F2P4oAH_F0Mj_nF8ZGMlcwHkKgXCIbwsS9CuRGj-Qfi5AuwHMqUZLHKzd-wjFg5GrS34XEHVcFchwXv5vcwdCw-rWEKgcS7Wz9nJPHnFLJFcX3TiCA"
                    alt="3D isometric neighborhood map pin"
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(2,84,45,0.12)] transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </article>

          {/* ── CARD 03: Find What You Need, Faster ── */}
          <article className="relative bg-white rounded-3xl p-7 sm:p-9 border border-emerald-100/80 shadow-[0_10px_35px_-8px_rgba(2,84,45,0.06)] hover:shadow-[0_16px_40px_-10px_rgba(2,84,45,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden group w-[86vw] xs:w-[84vw] max-w-[360px] sm:max-w-none sm:w-auto shrink-0 snap-center sm:snap-align-none">
            {/* Background subtle glow & dots */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#DCFCE7]/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-10 bottom-6 w-32 h-32 bg-dot-pattern opacity-25 pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10 h-full">
              {/* Text Content */}
              <div className="sm:col-span-7 flex flex-col items-start justify-center h-full">
                <div>
                  {/* Badge Number */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold tracking-wider text-slate-700 mb-4">
                    <span className="font-bold text-[#02542D]">03</span>
                    <span className="text-slate-400">|</span>
                    <span className="uppercase text-[11px] font-bold text-[#02542D] tracking-wider">Lightning Fast Search</span>
                  </div>

                  <h3 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-snug font-heading">
                    Find What You Need, Faster
                  </h3>

                  <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed font-primary">
                    Instant autocomplete and smart filters get you the right results immediately without complex registrations.
                  </p>
                </div>

                {/* Mobile-only illustration view */}
                <div className="sm:hidden w-full flex justify-center items-center mt-4">
                  <div className="relative w-44 h-44 aspect-square flex items-center justify-center">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBd2D3qhqV5AKhCdVIWlCT9-K1_beKx5gn2PVlKpKSWF1pR-nKVn2QwD-JqOC9WkR51A_yDyQqzEft72nPFTKUQMXQ9ajcCff05quli7_cOIU2LV3nzLTyiUYQszD69dBnQe6SJAyu_jKGBI0hoSoEhIRZNYaE1KiIE3e7SBUuuMhjyDd0P7-iUWvb-_0c1dbXhlrStIa9zie1fO8Zc7YWkITUiNcUsyG9UvbcS9yVejPPEX1hzv2xctA"
                      alt="3D isometric search modal card"
                      className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(2,84,45,0.12)] transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop 3D Isometric Illustration */}
              <div className="hidden sm:flex sm:col-span-5 justify-center items-center relative">
                <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBd2D3qhqV5AKhCdVIWlCT9-K1_beKx5gn2PVlKpKSWF1pR-nKVn2QwD-JqOC9WkR51A_yDyQqzEft72nPFTKUQMXQ9ajcCff05quli7_cOIU2LV3nzLTyiUYQszD69dBnQe6SJAyu_jKGBI0hoSoEhIRZNYaE1KiIE3e7SBUuuMhjyDd0P7-iUWvb-_0c1dbXhlrStIa9zie1fO8Zc7YWkITUiNcUsyG9UvbcS9yVejPPEX1hzv2xctA"
                    alt="3D isometric search modal card"
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(2,84,45,0.12)] transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </article>

          {/* ── CARD 04: Direct Free Contact ── */}
          <article className="relative bg-white rounded-3xl p-7 sm:p-9 border border-emerald-100/80 shadow-[0_10px_35px_-8px_rgba(2,84,45,0.06)] hover:shadow-[0_16px_40px_-10px_rgba(2,84,45,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden group w-[86vw] xs:w-[84vw] max-w-[360px] sm:max-w-none sm:w-auto shrink-0 snap-center sm:snap-align-none">
            {/* Background subtle glow & dots */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-6 top-8 w-32 h-32 bg-dot-pattern opacity-30 pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10 h-full">
              {/* Text Content */}
              <div className="sm:col-span-7 flex flex-col items-start justify-center h-full">
                <div>
                  {/* Badge Number */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold tracking-wider text-slate-700 mb-4">
                    <span className="font-bold text-[#02542D]">04</span>
                    <span className="text-slate-400">|</span>
                    <span className="uppercase text-[11px] font-bold text-[#02542D] tracking-wider">Zero Fees</span>
                  </div>

                  <h3 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-snug font-heading">
                    Direct Free Contact
                  </h3>

                  <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed font-primary">
                    Connect directly via phone, WhatsApp, or get directions with zero hidden booking commissions.
                  </p>
                </div>

                {/* Mobile-only illustration view */}
                <div className="sm:hidden w-full flex justify-center items-center mt-4">
                  <div className="relative w-44 h-44 aspect-square flex items-center justify-center">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGPMLMnykuFSKKwUaI6rk9Cb1TvbcYT2Ukci0X_odq2WL94uUyXRQaQBUBaQGTLSHT0o_DjBFWKvJFkyB_Hi7l9P29_NjHp4xNtxFnI5YSQptIr7MemdzxsADRROxtaFZhuRLlIfxPQxjkxO3kT1fC5KPUHmPqYKoT3pYEwuAAQhGqjLgKFd68BsHki2k9Gbv0aHsOOswuYHzaWbzQ9Y2-1gPVsmBwHNBmzdxTyWMEZphfrsqx4j2PAg"
                      alt="3D isometric smartphone with WhatsApp and call badges"
                      className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(2,84,45,0.12)] transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop 3D Isometric Illustration */}
              <div className="hidden sm:flex sm:col-span-5 justify-center items-center relative">
                <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGPMLMnykuFSKKwUaI6rk9Cb1TvbcYT2Ukci0X_odq2WL94uUyXRQaQBUBaQGTLSHT0o_DjBFWKvJFkyB_Hi7l9P29_NjHp4xNtxFnI5YSQptIr7MemdzxsADRROxtaFZhuRLlIfxPQxjkxO3kT1fC5KPUHmPqYKoT3pYEwuAAQhGqjLgKFd68BsHki2k9Gbv0aHsOOswuYHzaWbzQ9Y2-1gPVsmBwHNBmzdxTyWMEZphfrsqx4j2PAg"
                    alt="3D isometric smartphone with WhatsApp and call badges"
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(2,84,45,0.12)] transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* ── Mobile Swipe Carousel Indicators (Dot navigation) ── */}
        <div className="flex sm:hidden justify-center items-center gap-2 mt-5">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === idx
                  ? "w-7 bg-[#02542D]"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
