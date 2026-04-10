import "../style/Hero.css";
import ImageSlider from "./ImageSlider";

export default function Hero({ data }) {
  const tags = [
    "Saloon",
    "Spa",
    "Rental Services",
    "Gas/LPG Cylinder",
    "Tutors",
    "Garage",
    "Fitness / Yoga Instructors"
  ];

  const images = data?.banners?.map(banner => {
    return {
      'banner': banner.imageUrl, 
      'route': banner.route}
  }) || [];

  return (
    <section className="hero">
      <div className="hero-inner">

        {/* LEFT SIDE */}
        <div className="hero-left">
          <div className="hero-location">
            <i className="fa-solid fa-location-dot"></i>
            <span>Haldia, West Bengal</span>
          </div>

          <div className="hero-search">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              placeholder='Search for "Room Rent"'
            />
          </div>

          <div className="hero-tags">
            {tags.map((tag, index) => (
              <button key={index} className="tag-btn">
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-right">
          <ImageSlider width="90%" slide={true} images={images}/>
        </div>

      </div>
    </section>
  );
}