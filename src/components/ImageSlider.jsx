import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ImageSlider({
  slide=false, 
  width = "600px",
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

  const navigate = useNavigate();

  useEffect(() => {
    if (!slide || !images.length) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [slide, images.length]);

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
      className="relative overflow-hidden rounded-[12px] max-md:!rounded-[10px] max-[530px]:!rounded-[8px] aspect-video max-md:!w-full max-md:!h-[260px] max-[530px]:!h-[200px]"
      style={{ width }}
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={() => {
        intervalRef.current = setInterval(() => {
          setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
          );
        }, 4000);
      }}
    >
      <div
        className="flex h-full transition-transform duration-600 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {images.map((img, index) => (
          <img
            src={img?.banner}
            alt={`slide-${index}`}
            key={index}
            className="w-full h-full object-fill shrink-0 cursor-pointer"
            onClick={() => {navigate(img?.route)}}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>

      <button
        className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-2.5 bg-black/35 hover:bg-[#1c8c8c] hover:text-black text-white border-none cursor-pointer w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-sm sm:text-base md:text-xl rounded-full transition-colors flex items-center justify-center"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-2.5 bg-black/35 hover:bg-[#1c8c8c] hover:text-black text-white border-none cursor-pointer w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-sm sm:text-base md:text-xl rounded-full transition-colors flex items-center justify-center"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        ❯
      </button>

      <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 bg-black/15 py-1 px-3 sm:py-1.5 sm:px-4 rounded-full">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full cursor-pointer transition-all ${
              index === currentIndex ? "bg-[#1c8c8c] scale-125" : "bg-white/40 hover:bg-white"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;