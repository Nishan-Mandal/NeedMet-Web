import { useState, useEffect, useRef } from "react";
import "../style/ImageSlider.css";
import { useNavigate } from "react-router-dom";

function ImageSlider({
  slide=false, 
  width = "600px",
  height = "400px",
  images = [
    'https://firebasestorage.googleapis.com/v0/b/startup20-5eaa7.firebasestorage.app/o/listings%2FSALEFTRkbVNN1SI4yGQT%2Ffull_719c5166-7702-4770-9f97-5be90964cb29.jpg?alt=media&token=4e8885a1-78bd-4b78-9de8-9a99d83c1450', 
    'https://firebasestorage.googleapis.com/v0/b/startup20-5eaa7.firebasestorage.app/o/listings%2FSALEFTRkbVNN1SI4yGQT%2Ffull_0785d585-a979-4539-8b2a-e4a4a57e2551.jpg?alt=media&token=9ef49997-cd6a-4727-a9d1-0dba5fdc16b8', 
    'https://firebasestorage.googleapis.com/v0/b/startup20-5eaa7.firebasestorage.app/o/listings%2FSALEFTRkbVNN1SI4yGQT%2Ffull_5d4c2553-3763-4bd5-bc41-429895a58d06.jpg?alt=media&token=cb53dd94-a3db-4e0d-9e4e-d1ed8ba08982',
    'https://firebasestorage.googleapis.com/v0/b/startup20-5eaa7.firebasestorage.app/o/listings%2FSALEFTRkbVNN1SI4yGQT%2Ffull_0785d585-a979-4539-8b2a-e4a4a57e2551.jpg?alt=media&token=9ef49997-cd6a-4727-a9d1-0dba5fdc16b8',
    'https://firebasestorage.googleapis.com/v0/b/startup20-5eaa7.firebasestorage.app/o/listings%2FSALEFTRkbVNN1SI4yGQT%2Ffull_37025f58-fa86-4a00-8ac8-edcf5dcbd4e5.jpg?alt=media&token=75f59793-c1bb-4529-b775-9553e03f41d7'
  ]
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const navigate = useNavigate()

  const startAutoSlide = () => {
    if(!slide) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 2000);
  };

  const stopAutoSlide = () => {
    if(!slide) return;

    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!images.length) return;

    startAutoSlide();

    return () => stopAutoSlide();
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  if (!images.length) return null;

  return (
    <div
      className="carousel-container"
      style={{ width, height }}
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <div
        className="carousel-track"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {images.map((img, index) => (
          <img
            src={img?.banner}
            alt={`slide-${index}`}
            key={index}
            className="carousel-image"
            onClick={() => {navigate(img?.route)}}
          />
        ))}
      </div>

      <button className="carousel-btn prev" onClick={prevSlide}>
        ❮
      </button>
      <button className="carousel-btn next" onClick={nextSlide}>
        ❯
      </button>

      <div className="slides-counter">
        {images.map((_, index) => (
          <div
            key={index}
            className={`single-counter ${
              index === currentIndex ? "active-dot" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;