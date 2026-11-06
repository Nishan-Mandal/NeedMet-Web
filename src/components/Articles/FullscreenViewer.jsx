import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Fullscreen Photo Viewer (Lightbox)
 * Rendered at root level via createPortal. Supports single or multiple photos,
 * keyboard controls (Esc, Left, Right), body scroll lock, and touch-friendly controls.
 * Clicking outside the photo closes the fullscreen view.
 */
export default function FullscreenViewer({
  images = [],
  startIndex = 0,
  title = "",
  onClose,
}) {
  const imageList = Array.isArray(images)
    ? images.filter(Boolean)
    : [images].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(0, startIndex), Math.max(0, imageList.length - 1))
  );

  // Lock background scroll when viewer is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((i) => Math.min(imageList.length - 1, i + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageList.length, onClose]);

  if (!imageList.length) return null;

  const currentImage = imageList[currentIndex];

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-[#030c08]/95 backdrop-blur-md flex items-center justify-center animate-[fadeIn_0.2s_ease] select-none cursor-zoom-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image Fullscreen Viewer"
    >
      <div className="w-full h-full flex flex-col items-center justify-between p-3 sm:p-6 gap-3 box-border">
        {/* Top Header Bar */}
        <div
          className="w-full flex items-center justify-between shrink-0 px-2 sm:px-4 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            {imageList.length > 1 && (
              <span className="text-xs sm:text-sm font-semibold text-white bg-white/10 border border-white/15 rounded-full py-1 px-3.5 backdrop-blur-md">
                {currentIndex + 1} / {imageList.length}
              </span>
            )}
            {title && (
              <span className="hidden sm:inline-block text-xs font-medium text-white/80 truncate max-w-[320px] md:max-w-[480px]">
                {title}
              </span>
            )}
          </div>

          <button
            type="button"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-base sm:text-lg cursor-pointer flex items-center justify-center transition-all hover:bg-rose-600 hover:rotate-90 active:scale-95 shadow-md ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close fullscreen"
            title="Close (Esc)"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Center Image Display Area */}
        <div className="flex-1 w-full flex items-center justify-between gap-3 sm:gap-6 min-h-0 relative px-0 sm:px-8">
          {/* Previous Button (if multiple images) */}
          {imageList.length > 1 && (
            <button
              type="button"
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/90 border border-white/20 text-white text-sm sm:text-base cursor-pointer shrink-0 flex items-center justify-center transition-all hover:bg-primary shadow-lg z-20 active:scale-95 ${
                currentIndex === 0
                  ? "opacity-30 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((i) => Math.max(0, i - 1));
              }}
              disabled={currentIndex === 0}
              aria-label="Previous image"
              title="Previous (Left Arrow)"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          {/* Active Image Container (Clicking empty space bubbles to backdrop and closes viewer) */}
          <div className="flex-1 h-full flex items-center justify-center p-2 min-h-0">
            <img
              key={currentImage}
              src={currentImage}
              alt={title || `Photo ${currentIndex + 1}`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (!e.target.dataset.tried) {
                  e.target.dataset.tried = "true";
                  e.target.src = `https://wsrv.nl/?url=${encodeURIComponent(
                    currentImage
                  )}`;
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[82vh] object-contain rounded-xl sm:rounded-2xl block mx-auto shadow-2xl transition-transform duration-300 pointer-events-auto cursor-default"
            />
          </div>

          {/* Next Button (if multiple images) */}
          {imageList.length > 1 && (
            <button
              type="button"
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/90 border border-white/20 text-white text-sm sm:text-base cursor-pointer shrink-0 flex items-center justify-center transition-all hover:bg-primary shadow-lg z-20 active:scale-95 ${
                currentIndex === imageList.length - 1
                  ? "opacity-30 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((i) => Math.min(imageList.length - 1, i + 1));
              }}
              disabled={currentIndex === imageList.length - 1}
              aria-label="Next image"
              title="Next (Right Arrow)"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>

        {/* Bottom hint */}
        <div
          className="shrink-0 text-[11px] text-white/50 text-center pb-1 pointer-events-none"
          aria-hidden="true"
        >
          Click anywhere outside or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-mono text-[10px]">Esc</kbd> to exit
        </div>
      </div>
    </div>,
    document.body
  );
}
