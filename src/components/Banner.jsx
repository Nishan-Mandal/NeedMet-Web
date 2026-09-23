import { useNavigate } from "react-router-dom";

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
      className={`w-full overflow-hidden leading-none ${route ? "cursor-pointer" : "cursor-default"}`}
      onClick={route ? handleClick : undefined}
    >
      <picture>
        {phoneImage && phoneImage !== desktopImage && (
          <source media="(max-width: 768px)" srcSet={phoneImage} />
        )}
        <img
          src={desktopImage}
          alt={alt}
          className="w-full block object-fill aspect-16/9 min-[481px]:aspect-14/7 md:aspect-16/4 md:max-lg:h-[240px]"
          loading="lazy"
        />
      </picture>
    </div>
  );
}
