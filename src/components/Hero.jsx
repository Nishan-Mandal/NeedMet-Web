import { useState, useEffect } from "react";
import ImageSlider from "./ImageSlider";
import "../style/Hero.css";

const CHIPS = [
  { label: "Room Rent", emoji: "🏠" },
  { label: "Salons", emoji: "💇" },
  { label: "Restaurants", emoji: "🍽️" },
  { label: "Auto Services", emoji: "🚗" },
  { label: "Pharmacies", emoji: "💊" },
  { label: "Fitness", emoji: "🏋️" },
];

const Stats = () => (
    <div className="hero-stats">
      {[
        { num: "100+", label: "Businesses Listed" },
        { num: "50+", label: "Categories Covered" },
        { num: "4.8★", label: "Avg. User Rating" },
      ].map((s, i) => (
        <div key={i} className="hero-stats__item">
          <div className="hero-stats__num">{s.num}</div>
          <div className="hero-stats__label">{s.label}</div>
        </div>
      ))}
    </div>
  );

  function SliderPanel({ images }) {
    return (
      <div className="hero-panel">
        <ImageSlider width="100%" slide={true} images={images} />
      </div>
    );
  }

export default function Hero({ data }) {
  const [query, setQuery] = useState("");

  const placeholders = [
  "Rooms near me",
  "Best restaurants",
  "Medical shops",
  "Salons in Haldia",
  "Car repair center",
];

const [placeholder, setPlaceholder] = useState("");

  const images = data?.promoBanners?.map(banner => ({
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
    <section className="hero">
      <div className="hero-blob hero-blob--1" />
      <div className="hero-blob hero-blob--2" />

      <div className="hero-inner">

        {/* ── LEFT ── */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge__dot" />
            Haldia, West Bengal
          </div>

          <h1 className="hero-headline">
            Find Every Shop &amp;
            Service <span className="hero-headline__accent">Near You</span>
          </h1>

          <p className="hero-subtext">
            Discover local businesses, book services, and connect with
            your city — all in one place. From groceries to garages,
            NeedMet has you covered.
          </p>

          {/* Panel + Stats shown here between subtext and search on mobile/tablet */}
          <div className="hero-mobile-block">
            <SliderPanel images={images}/>
            <Stats />
          </div>

          {/* Search */}
          <div className="hero-search">
            <svg className="hero-search__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="hero-search__input"
              placeholder={`Try "${placeholder}"`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="hero-search__btn">Search Now</button>
          </div>

          {/* Chips */}
          <div className="hero-chips">
            {CHIPS.map((c) => (
              <button key={c.label} className="hero-chip">
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT — desktop only ── */}
        <div className="hero-right">
          <SliderPanel images={images}/>
          <Stats />
        </div>

      </div>
    </section>
  );
}