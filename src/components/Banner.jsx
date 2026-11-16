import { useNavigate } from "react-router-dom";

export default function Banner({
  imageUrl,
  webUrl,
  route,
  image,
  weburl,
  redirectUrl,
  alt = "Banner",
}) {
  const navigate = useNavigate();
  const desktopImage = webUrl || weburl || imageUrl || image || "";
  const phoneImage = imageUrl || image || webUrl || weburl || "";
  const targetRoute = route || redirectUrl || "";

  if (!desktopImage && !phoneImage) return null;

  const handleClick = () => {
    if (!targetRoute) return;
    if (targetRoute.startsWith("http://") || targetRoute.startsWith("https://")) {
      window.open(targetRoute, "_blank", "noopener,noreferrer");
    } else {
      navigate(targetRoute);
    }
  };

  return (
    <div
      className={`w-full overflow-hidden leading-none px-[18px] sm:px-8 lg:px-[70px] py-4 bg-white transition-opacity ${
        targetRoute ? "cursor-pointer group hover:opacity-95" : "cursor-default"
      }`}
      onClick={targetRoute ? handleClick : undefined}
    >
      <picture>
        {phoneImage && phoneImage !== desktopImage && (
          <source media="(max-width: 768px)" srcSet={phoneImage} />
        )}
        <img
          src={desktopImage || phoneImage}
          alt={alt}
          className="w-full block object-cover aspect-16/9 min-[481px]:aspect-14/7 md:aspect-16/4 md:max-lg:h-[240px] rounded-2xl shadow-xs transition-transform duration-200 group-hover:scale-[1.005]"
          loading="lazy"
          onError={(e) => {
            // Gracefully hide broken image element to prevent broken layout
            e.currentTarget.style.display = "none";
          }}
        />
      </picture>
    </div>
  );
}
