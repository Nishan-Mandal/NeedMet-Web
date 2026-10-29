import React, { useEffect, useState } from "react";

/**
 * ArticleProgressBar
 * Renders a reading progress indicator at the top of the screen.
 * Reaches 100% when the reader reaches the end of the guide (at the guide end marker),
 * rather than requiring the user to scroll through the footer / recommendations.
 */
export default function ArticleProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Find where the guide body ends (marked by #guide-end-marker or #guide-end-section or article)
      const marker =
        document.getElementById("guide-end-marker") ||
        document.getElementById("guide-end-section") ||
        document.querySelector("article");

      if (marker) {
        const markerRect = marker.getBoundingClientRect();
        const markerAbsoluteTop = markerRect.top + window.scrollY;
        // The guide reading progress reaches 100% when the end marker enters the viewport
        const endReadingScroll = Math.max(1, markerAbsoluteTop - window.innerHeight + 100);
        const currentScroll = window.scrollY;
        const progress = (currentScroll / endReadingScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      } else {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) {
          setScrollProgress(0);
          return;
        }
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-[99999] bg-transparent pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-primary-light to-accent-emerald transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
