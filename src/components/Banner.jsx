import { useNavigate } from "react-router-dom";
import "../style/Banner.css";

export default function Banner({ imageUrl, webUrl, route, alt = "Banner" }) {
  const navigate = useNavigate();

  const desktopImage = webUrl;
  const phoneImage = imageUrl;

  if (!desktopImage && !phoneImage) return null;

  const handleClick = () => {
    if (!route) return;
    if (route.startsWith("http://") || route.startsWith("https://")) {
      window.open(route, "_blank", "noopener,noreferrer");
    } else {
      navigate(route);
    }
  };

  return (
    <div
      className="banner-section"
      onClick={route ? handleClick : undefined}
      style={{ cursor: route ? "pointer" : "default" }}
    >
      <picture>
        {phoneImage && phoneImage !== desktopImage && (
          <source media="(max-width: 768px)" srcSet={phoneImage} />
        )}
        <img src={desktopImage} alt={alt} className="banner-image" loading="lazy" />
      </picture>
    </div>
  );
}
