import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import empty_thumb from "../assets/empty_thumb.png";
import premiumImg from "../assets/premium.png";
import "../style/PreviewImage.css";

// ─── Shared Hook ───────────────────────────────────────────────
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

// ─── Shared Thumbnail Strip ────────────────────────────────────
function ThumbnailStrip({ images, currentIndex, onSelect, scroll }) {
  const { ref, isLeftDisabled, isRightDisabled, hasOverflow, check, scrollLeft, scrollRight } = scroll;

  return (
    <div className="fs-strip-wrapper">
      <button onClick={scrollLeft} disabled={isLeftDisabled} className={`preview-image-arrow prev-img-arrow-left ${isLeftDisabled ? "prev-img-arrow-disabled" : ""}`}>❮</button>
      <div className="fs-strip" ref={ref} onScroll={check} style={hasOverflow ? { justifyContent: "flex-start" } : { justifyContent: "center" }}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="thumbnail"
            className={`preview ${currentIndex === index ? "preview-active" : ""}`}
            onClick={() => onSelect(index)}
            onLoad={check}
          />
        ))}
      </div>
      <button onClick={scrollRight} disabled={isRightDisabled} className={`preview-image-arrow prev-img-arrow-right ${isRightDisabled ? "prev-img-arrow-disabled" : ""}`}>❯</button>
    </div>
  );
}

// ─── Fullscreen Viewer ─────────────────────────────────────────
function FullscreenViewer({ images, startIndex, isPremium, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const scroll = useThumbScroll(images);

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
    <div className="fs-overlay" onClick={onClose}>
      <div className="fs-inner" onClick={(e) => e.stopPropagation()}>

        <div className="fs-topbar">
          <span className="fs-counter">{currentIndex + 1} / {images.length}</span>
          <button className="fs-close-btn" onClick={onClose} aria-label="Close fullscreen">✕</button>
        </div>

        <div className="fs-main-image-wrap">
          <button className={`fs-nav-btn fs-nav-left ${currentIndex === 0 ? "fs-nav-disabled" : ""}`} onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0} aria-label="Previous image">❮</button>
          <img className="fs-main-img" src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />
          <button className={`fs-nav-btn fs-nav-right ${currentIndex === images.length - 1 ? "fs-nav-disabled" : ""}`} onClick={() => setCurrentIndex(i => Math.min(images.length - 1, i + 1))} disabled={currentIndex === images.length - 1} aria-label="Next image">❯</button>
        </div>

        {images.length > 1 && <ThumbnailStrip images={images} currentIndex={currentIndex} onSelect={setCurrentIndex} scroll={scroll} />}
      </div>
    </div>,
    document.body
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function PreviewImage({ width = "100%", images = [empty_thumb], isPremium = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scroll = useThumbScroll(images);

  const imageList = images.length === 0 ? [empty_thumb] : images;

  return (
    <>
      <div className="main-image" style={{ width, backgroundImage: `url(${imageList[currentIndex]})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        {isPremium && (
          <div className="preview-img-premium-badge">
            <img src={premiumImg} alt="premium" />
            <span>Premium</span>
          </div>
        )}

        <button className="zoom-btn" onClick={() => setIsFullscreen(true)} aria-label="View fullscreen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>

        <div className="preview-container">
          <ThumbnailStrip images={imageList} currentIndex={currentIndex} onSelect={setCurrentIndex} scroll={scroll} />
        </div>
      </div>

      {isFullscreen && (
        <FullscreenViewer images={imageList} startIndex={currentIndex} isPremium={isPremium} onClose={() => setIsFullscreen(false)} />
      )}
    </>
  );
}