import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import empty_thumb from "../../../assets/empty_thumb.png";
import premiumImg from "../../../assets/premium.png";
import QrPosterModal from "../../../components/QR/QrPosterModal.jsx";

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

  const scrollLeft = () => { ref.current.scrollBy({ left: -300, behavior: "smooth" }); setTimeout(check, 200); };
  const scrollRight = () => { ref.current.scrollBy({ left: 300, behavior: "smooth" }); setTimeout(check, 200); };

  return { ref, isLeftDisabled, isRightDisabled, hasOverflow, check, scrollLeft, scrollRight };
}

function ThumbnailStrip({ images, currentIndex, onSelect, scroll }) {
  const { ref, isLeftDisabled, isRightDisabled, hasOverflow, check, scrollLeft, scrollRight } = scroll;
  if (!images || images.length <= 1) return null;

  return (
    <div className="w-full flex items-center gap-2 sm:gap-3 shrink-0 py-1">
      {hasOverflow && (
        <button
          type="button"
          onClick={scrollLeft}
          disabled={isLeftDisabled}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary border border-white/20 text-text-on-dark flex items-center justify-center cursor-pointer text-xs sm:text-sm shrink-0 transition-transform hover:scale-105 hover:bg-primary-light ${isLeftDisabled ? "invisible" : ""}`}
          aria-label="Previous thumbnails"
        >
          ❮
        </button>
      )}
      <div
        className="flex items-center gap-2 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-14 sm:h-20"
        ref={ref}
        onScroll={check}
        style={{
          justifyContent: hasOverflow ? "flex-start" : "center",
        }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`thumbnail ${index + 1}`}
            className={`w-[74px] sm:w-[100px] lg:w-[120px] aspect-video object-cover rounded-lg cursor-pointer border-2 transition-all shrink-0 ${
              currentIndex === index
                ? "border-primary-lighter opacity-100 -translate-y-1 shadow-md relative z-10"
                : "border-white/20 opacity-80 hover:opacity-100 hover:border-primary-lighter hover:-translate-y-0.5"
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
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary border border-white/20 text-text-on-dark flex items-center justify-center cursor-pointer text-xs sm:text-sm shrink-0 transition-transform hover:scale-105 hover:bg-primary-light ${isRightDisabled ? "invisible" : ""}`}
          aria-label="Next thumbnails"
        >
          ❯
        </button>
      )}
    </div>
  );
}

function useShare(listing) {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    const url = window.location.href;
    const shareText = `Check the listing here:\n${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });
      } catch (_) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return { handleShare, copied };
}

function ShareButton({ onClick, copied, className = "" }) {
  return (
    <button
      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary border border-white/20 text-text-on-dark flex items-center justify-center cursor-pointer transition-all hover:bg-gray-900 hover:scale-105 shrink-0 relative text-xs sm:text-sm ${className}`}
      onClick={onClick}
      aria-label="Share listing"
    >
      <i className="fa-solid fa-share"></i>
      {copied && (
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-gray-900/90 text-text-on-dark text-[0.72rem] font-primary py-0.5 px-2 rounded whitespace-nowrap pointer-events-none">
          Copied!
        </span>
      )}
    </button>
  );
}

function FullscreenViewer({ images, startIndex, isPremium, onClose, listing }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const scroll = useThumbScroll(images);
  const { handleShare, copied } = useShare(listing);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrentIndex(i => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setCurrentIndex(i => Math.min(images.length - 1, i + 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-[#030c08]/95 backdrop-blur-sm flex items-center justify-center animate-[fadeIn_0.2s_ease]" onClick={onClose}>
      <div className="w-full h-full flex flex-col items-center justify-between p-4 gap-3 box-border">
        <div className="w-full flex items-center justify-end shrink-0">
          <button
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-text-on-dark text-lg sm:text-xl cursor-pointer flex items-center justify-center transition-all hover:bg-accent-red hover:rotate-90 shrink-0"
            onClick={onClose}
            aria-label="Close fullscreen"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="flex-1 w-full flex items-center justify-between gap-4 min-h-0 relative px-0 sm:px-12">
          <button
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary border border-white/20 text-text-on-dark text-base sm:text-lg cursor-pointer shrink-0 flex items-center justify-center transition-all hover:bg-primary-light active:bg-primary-surface active:text-primary max-sm:absolute max-sm:left-2 max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:z-10 ${currentIndex === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => Math.max(0, i - 1)); }}
            disabled={currentIndex === 0}
            aria-label="Previous image"
          >
            ❮
          </button>
          <img
            onClick={(e) => e.stopPropagation()}
            className="max-w-full sm:max-w-[calc(100%-120px)] max-h-full object-contain rounded-2xl block mx-auto"
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            loading="lazy"
          />
          <button
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary border border-white/20 text-text-on-dark text-base sm:text-lg cursor-pointer shrink-0 flex items-center justify-center transition-all hover:bg-primary-light active:bg-primary-surface active:text-primary max-sm:absolute max-sm:right-2 max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:z-10 ${currentIndex === images.length - 1 ? "opacity-40 cursor-not-allowed" : ""}`}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => Math.min(images.length - 1, i + 1)); }}
            disabled={currentIndex === images.length - 1}
            aria-label="Next image"
          >
            ❯
          </button>
        </div>
        <span className="text-sm font-semibold font-primary text-text-on-dark min-w-[72px] text-center bg-white/10 border border-white/15 rounded-full py-1 px-4 backdrop-blur-md">
          {currentIndex + 1} / {images.length}
        </span>
      </div>
    </div>,
    document.body
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function PreviewImage({ width = "100%", images = [empty_thumb], isPremium = false, listing = {} }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQrPoster, setShowQrPoster] = useState(false);
  const scroll = useThumbScroll(images);
  const { handleShare, copied } = useShare(listing);

  const imageList = images.length === 0 ? [empty_thumb] : images;

  return (
    <>
      <div
        onClick={() => setIsFullscreen(true)}
        className="relative w-full overflow-hidden rounded-2xl aspect-4/3 sm:aspect-video cursor-pointer bg-surface border border-border shadow-[0_4px_10px_rgba(15,92,63,0.15)] bg-cover bg-center"
        style={{
          width,
          backgroundImage: `url(${imageList[currentIndex]})`,
        }}
      >
        {isPremium && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-gradient-to-br from-accent-orange to-accent-yellow text-text-on-dark px-3 py-1.5 rounded-full text-xs font-bold font-heading tracking-wide shadow-md z-[2]">
            <img src={premiumImg} alt="premium" loading="lazy" className="w-[18px] h-[18px] object-contain bg-white rounded-full p-0.5" />
            <span>Premium</span>
          </div>
        )}

        <div onClick={(e) => e.stopPropagation()} className="absolute top-3 left-3 flex flex-col gap-1.5 z-[2]">
          <button
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary border border-white/20 text-text-on-dark flex items-center justify-center cursor-pointer transition-all hover:bg-gray-900 hover:scale-105 shrink-0 text-xs sm:text-sm"
            onClick={() => setIsFullscreen(true)}
            aria-label="View fullscreen"
          >
            <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
          </button>
          <ShareButton onClick={handleShare} copied={copied} />
          
          <button
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary border border-white/20 text-text-on-dark flex items-center justify-center cursor-pointer transition-all hover:bg-gray-900 hover:scale-105 shrink-0 text-xs sm:text-sm"
            onClick={(e) => { e.stopPropagation(); setShowQrPoster(true); }}
            aria-label="Generate QR poster"
          >
            <i className="fa-solid fa-qrcode"></i>
          </button>
        </div>

        {imageList.length > 1 && (
          <div onClick={(e) => e.stopPropagation()} className="w-full absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-between items-center gap-2 sm:gap-4 px-2 sm:px-4 py-3 bg-gradient-to-t from-black/90 via-black/55 to-transparent rounded-b-2xl">
            <ThumbnailStrip images={imageList} currentIndex={currentIndex} onSelect={setCurrentIndex} scroll={scroll} />
          </div>
        )}
      </div>

      {isFullscreen && (
        <FullscreenViewer images={imageList} startIndex={currentIndex} isPremium={isPremium} onClose={() => setIsFullscreen(false)} listing={listing} />
      )}

      {showQrPoster && (
        <QrPosterModal
          open={showQrPoster}
          onClose={() => setShowQrPoster(false)}
          listing={listing}
        />
      )}
    </>
  );
}
