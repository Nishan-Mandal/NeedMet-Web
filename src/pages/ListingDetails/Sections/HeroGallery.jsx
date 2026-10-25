import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import empty_thumb from "../../../assets/empty_thumb.png";
import premiumImg from "../../../assets/premium.png";

/* ──────────────────────────────────────────────────────────────
   Thumbnail scroll hook
─────────────────────────────────────────────────────────────── */
function useThumbScroll(images) {
  const ref = useRef(null);
  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const check = () => {
    const el = ref.current;
    if (!el) return;
    const buffer = 5;
    setIsLeftDisabled(el.scrollLeft <= buffer);
    setIsRightDisabled(el.scrollLeft + el.clientWidth >= el.scrollWidth - buffer);
    setHasOverflow(el.scrollWidth > el.clientWidth);
  };

  useEffect(() => { check(); }, [images]);

  const scrollLeft = () => { ref.current.scrollBy({ left: -260, behavior: "smooth" }); setTimeout(check, 200); };
  const scrollRight = () => { ref.current.scrollBy({ left: 260, behavior: "smooth" }); setTimeout(check, 200); };

  return { ref, isLeftDisabled, isRightDisabled, hasOverflow, check, scrollLeft, scrollRight };
}

/* ──────────────────────────────────────────────────────────────
   Fullscreen Viewer
─────────────────────────────────────────────────────────────── */
function FullscreenViewer({ images, startIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrentIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setCurrentIndex((i) => Math.min(images.length - 1, i + 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-[#030c08]/95 backdrop-blur-md flex items-center justify-center animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
    >
      <div className="w-full h-full flex flex-col items-center justify-between p-4 gap-3 box-border">
        {/* Top bar */}
        <div className="w-full flex items-center justify-between shrink-0 px-2 sm:px-6">
          <span className="text-xs sm:text-sm font-semibold font-primary text-white bg-white/10 border border-white/15 rounded-full py-1 px-3.5 backdrop-blur-md">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-base sm:text-lg cursor-pointer flex items-center justify-center transition-all hover:bg-rose-600 hover:rotate-90 active:scale-95"
            onClick={onClose}
            aria-label="Close fullscreen"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Main image viewer with chevrons */}
        <div className="flex-1 w-full flex items-center justify-between gap-4 min-h-0 relative px-0 sm:px-12">
          <button
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/90 border border-white/20 text-white text-sm sm:text-base cursor-pointer shrink-0 flex items-center justify-center transition-all hover:bg-primary max-sm:absolute max-sm:left-2 max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:z-10 shadow-lg ${
              currentIndex === 0 ? "opacity-30 cursor-not-allowed pointer-events-none" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((i) => Math.max(0, i - 1));
            }}
            disabled={currentIndex === 0}
            aria-label="Previous image"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <img
            onClick={(e) => e.stopPropagation()}
            className="max-w-full sm:max-w-[calc(100%-120px)] max-h-full object-contain rounded-2xl block mx-auto select-none shadow-2xl"
            src={images[currentIndex]}
            alt={`Listing Photo ${currentIndex + 1}`}
            loading="lazy"
          />

          <button
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/90 border border-white/20 text-white text-sm sm:text-base cursor-pointer shrink-0 flex items-center justify-center transition-all hover:bg-primary max-sm:absolute max-sm:right-2 max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:z-10 shadow-lg ${
              currentIndex === images.length - 1 ? "opacity-30 cursor-not-allowed pointer-events-none" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((i) => Math.min(images.length - 1, i + 1));
            }}
            disabled={currentIndex === images.length - 1}
            aria-label="Next image"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ──────────────────────────────────────────────────────────────
   Thumbnail Strip
─────────────────────────────────────────────────────────────── */
function ThumbnailStrip({ images, currentIndex, onSelect, scroll }) {
  const { ref, isLeftDisabled, isRightDisabled, hasOverflow, check, scrollLeft, scrollRight } = scroll;
  if (!images || images.length <= 1) return null;

  return (
    <div className="w-full flex items-center gap-1.5 sm:gap-2 shrink-0">
      {hasOverflow && (
        <button
          type="button"
          onClick={scrollLeft}
          disabled={isLeftDisabled}
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/50 backdrop-blur-md border border-white/25 text-white flex items-center justify-center cursor-pointer text-xs shrink-0 transition-all hover:bg-black/80 ${
            isLeftDisabled ? "invisible pointer-events-none" : ""
          }`}
          aria-label="Previous thumbnails"
        >
          <i className="fa-solid fa-chevron-left text-[8px] sm:text-[9px]"></i>
        </button>
      )}

      <div
        className="flex items-center gap-1.5 sm:gap-2 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-11 sm:h-13 py-0.5"
        ref={ref}
        onScroll={check}
        style={{ justifyContent: hasOverflow ? "flex-start" : "center" }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className={`h-full aspect-video object-cover rounded-lg cursor-pointer border-2 transition-all shrink-0 ${
              currentIndex === index
                ? "border-white opacity-100 shadow-md ring-2 ring-primary/60 scale-[1.03]"
                : "border-white/30 opacity-65 hover:opacity-95 hover:border-white/70"
            }`}
            onClick={() => onSelect(index)}
            onLoad={check}
            loading="lazy"
          />
        ))}
      </div>

      {hasOverflow && (
        <button
          type="button"
          onClick={scrollRight}
          disabled={isRightDisabled}
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/50 backdrop-blur-md border border-white/25 text-white flex items-center justify-center cursor-pointer text-xs shrink-0 transition-all hover:bg-black/80 ${
            isRightDisabled ? "invisible pointer-events-none" : ""
          }`}
          aria-label="Next thumbnails"
        >
          <i className="fa-solid fa-chevron-right text-[8px] sm:text-[9px]"></i>
        </button>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   HeroGallery Component
   - Larger responsive aspect ratio (aspect-[4/3] on mobile,
     aspect-[16/10] on desktop)
   - Only Expand/Fullscreen action on the photo
   - Premium badge & counter positioned cleanly
─────────────────────────────────────────────────────────────── */
export default function HeroGallery({ images = [], isPremium = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scroll = useThumbScroll(images);

  const imageList = images.length === 0 ? [empty_thumb] : images;

  return (
    <>
      {/* Main photo container */}
      <div
        className="relative w-full overflow-hidden rounded-2xl aspect-[4/3] min-[520px]:aspect-[16/10] max-h-[360px] min-[520px]:max-h-[420px] lg:max-h-[450px] cursor-pointer bg-surface border border-border/80 shadow-xs sm:shadow-sm bg-cover bg-center group select-none transition-all"
        style={{ backgroundImage: `url(${imageList[currentIndex]})` }}
        onClick={() => setIsFullscreen(true)}
      >
        {/* Navigation arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((i) => Math.max(0, i - 1));
              }}
              disabled={currentIndex === 0}
              className={`absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 z-10 w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-xs sm:text-sm shadow-md transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-black/75 hover:scale-105 active:scale-95 ${
                currentIndex === 0 ? "invisible pointer-events-none" : ""
              }`}
              aria-label="Previous image"
            >
              <i className="fa-solid fa-chevron-left text-[11px] sm:text-xs"></i>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((i) => Math.min(imageList.length - 1, i + 1));
              }}
              disabled={currentIndex === imageList.length - 1}
              className={`absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 z-10 w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-xs sm:text-sm shadow-md transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-black/75 hover:scale-105 active:scale-95 ${
                currentIndex === imageList.length - 1 ? "invisible pointer-events-none" : ""
              }`}
              aria-label="Next image"
            >
              <i className="fa-solid fa-chevron-right text-[11px] sm:text-xs"></i>
            </button>
          </>
        )}

        {/* Top-Left: ONLY Expand/Fullscreen button as requested */}
        <button
          className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/45 hover:bg-black/75 active:scale-95 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-xs shadow-md transition-all duration-200 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(true);
          }}
          aria-label="View fullscreen"
          title="Fullscreen"
        >
          <i className="fa-solid fa-expand text-[11px] sm:text-xs"></i>
        </button>

        {/* Top-Right: Premium badge & photo counter */}
        <div className="absolute top-3 sm:top-3.5 right-3 sm:right-3.5 z-10 flex items-center gap-1.5 sm:gap-2">
          {isPremium && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold font-heading tracking-wide shadow-md border border-amber-300/30 backdrop-blur-md">
              <img
                src={premiumImg}
                alt="Premium"
                loading="lazy"
                className="w-3.5 h-3.5 object-contain bg-white rounded-full p-0.5"
              />
              <span>Premium</span>
            </div>
          )}

          {imageList.length > 1 && (
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold font-primary px-2.5 py-1 rounded-full border border-white/20 shadow-md">
              <i className="fa-regular fa-image text-[10px] opacity-80"></i>
              <span>
                {currentIndex + 1} / {imageList.length}
              </span>
            </div>
          )}
        </div>

        {/* Bottom overlay thumbnail strip */}
        {imageList.length > 1 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2.5 sm:px-3.5 pt-6 pb-2 rounded-b-2xl z-10"
          >
            <ThumbnailStrip
              images={imageList}
              currentIndex={currentIndex}
              onSelect={setCurrentIndex}
              scroll={scroll}
            />
          </div>
        )}
      </div>

      {/* Fullscreen viewer */}
      {isFullscreen && (
        <FullscreenViewer
          images={imageList}
          startIndex={currentIndex}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </>
  );
}
