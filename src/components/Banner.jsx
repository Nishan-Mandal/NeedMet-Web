import "../style/Banner.css"

export default function Banner({ imageUrl, mobileImageUrl, alt = "Banner" }) {

  return (
    <div className="banner-section">
      <picture>
        {mobileImageUrl && (
          <source media="(max-width: 480px)" srcSet={mobileImageUrl} />
        )}
        <img src={imageUrl} alt={alt} className="banner-image" loading="lazy" />
      </picture>
    </div>
  );
}