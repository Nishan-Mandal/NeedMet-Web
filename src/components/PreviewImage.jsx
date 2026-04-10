import { useState, useRef, useEffect } from "react";
import empty_thumb from "../assets/empty_thumb.png"
import "../style/PreviewImage.css";

export default function PreviewImage({ width="100%", images = [empty_thumb] }) {
  const previewRef = useRef(null);

  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);


const checkScrollPosition = () => {
  const el = previewRef.current;
  if (!el) return;

  const buffer = 5;

  const isAtStart = el.scrollLeft <= buffer;
  const isAtEnd =
    el.scrollLeft + el.clientWidth >= el.scrollWidth - buffer;

  setIsLeftDisabled(isAtStart);
  setIsRightDisabled(isAtEnd);

  const hasOverflow = el.scrollWidth > el.clientWidth;
  setHasOverflow(hasOverflow);
};

  useEffect(() => {
    checkScrollPosition()
  }, [images]);

  const scrollLeft = () => {
    previewRef.current.scrollBy({ left: -300, behavior: "smooth" });
    setTimeout(checkScrollPosition, 200); // wait for scroll
  };

  const scrollRight = () => {
    previewRef.current.scrollBy({ left: 300, behavior: "smooth" });
    setTimeout(checkScrollPosition, 200);
  };

  if(images.length == 0) {
    images = [empty_thumb]
  }

  return (
    <div 
      className="main-image" 
      style={{
        width: width,
        backgroundImage: `url(${images[currentIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="preview-container">

        <div>
          <button 
            onClick={scrollLeft}
            disabled={isLeftDisabled}
            className={`preview-image-arrow prev-img-arrow-left ${isLeftDisabled ? "prev-img-arrow-disabled" : ""}`}
          >
            ❮
          </button>
        </div>

        <div 
          className="preview-wrapper"
          style={
            hasOverflow
              ? { justifyContent: 'flex-start' }
              : { justifyContent: 'center' }
          }
          ref={previewRef}
          onScroll={checkScrollPosition}
        >
          {images.map((img, index) => (
            <img
            key={index}
            src={img}
            alt="preview"
            className={`preview ${currentIndex === index ? "preview-active" : ""}`}
            onClick={() => setCurrentIndex(index)}
            onLoad={checkScrollPosition}
            />
          ))}
        </div>

        <div>
          <button 
            onClick={scrollRight}
            disabled={isRightDisabled}
            className={`preview-image-arrow prev-img-arrow-right ${isRightDisabled ? "prev-img-arrow-disabled" : ""}`}
          >
            ❯
          </button>
        </div>

      </div>
    </div>

  );
}