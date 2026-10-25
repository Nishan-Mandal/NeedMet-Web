import { Link } from "react-router-dom";
import empty_thumb from "../assets/empty_thumb.png";
import premiumImg from "../assets/premium.png";
import { generateSlug } from "../utils/slugify.js";

export default function ListingCard({ listing }) {
  const imageUrl =
    listing?.images?.length > 0
      ? (typeof listing.images[0] === "string" ? listing.images[0] : listing.images[0]?.thumbUrl || listing.images[0]?.fullUrl)
      : empty_thumb;

  return (
    <Link
      to={`/listing/${listing?.listingId}/${generateSlug(listing?.name || "")}`}
      state={{ listing }}
      className="listing-card group w-full max-w-full h-full bg-surface rounded-lg overflow-hidden no-underline cursor-pointer transition-[transform,box-shadow,border-color] duration-250 shadow-[0_4px_10px_rgba(15,92,63,0.228),0_1px_2px_rgba(0,0,0,0.11)] hover:-translate-y-1 hover:border-[#0f5c3e]/20 hover:shadow-[0_10px_24px_rgba(15,92,62,0.08),0_4px_10px_rgba(0,0,0,0.04)] max-[480px]:hover:translate-y-0 max-[480px]:active:scale-[0.985] max-[480px]:active:opacity-90 flex flex-col box-border border-0"
    >
      {/* Image */}
      <div
        className="w-full aspect-[16/10] relative overflow-hidden bg-background-secondary bg-cover bg-center transition-transform duration-350 group-hover:scale-[1.015] shrink-0"
        style={{
          backgroundImage: `url(${imageUrl || empty_thumb})`,
        }}
      >
        {listing?.isPremium && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-gradient-to-br from-accent-orange to-accent-yellow text-white py-[5px] px-2.5 rounded-full text-[14px] font-bold tracking-[0.3px] shadow-[0_4px_10px_rgba(249,115,22,0.25)] z-[2] max-[480px]:top-2 max-[480px]:right-2 max-[480px]:py-1 max-[480px]:px-2 max-[480px]:text-[9px]">
            <img
              src={premiumImg}
              alt="premium"
              loading="lazy"
              className="w-[18px] h-[18px] max-[480px]:w-3 max-[480px]:h-3 object-contain bg-white rounded-full p-0.5"
            />
            <span>Premium</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-[14px] max-md:p-3 max-[480px]:p-[11px] flex flex-col flex-1">
        <p className="text-[11px] max-md:text-[10px] max-[480px]:text-[9px] font-bold text-primary opacity-80 uppercase tracking-[0.3px] truncate mb-1 min-h-[14px]">
          {listing?.category || "\u00A0"}
        </p>

        <h3 className="font-heading text-[16px] max-md:text-[15px] max-[480px]:text-[14px] font-bold text-text-accent leading-[1.35] truncate capitalize m-0 mb-2.5 max-[480px]:mb-2 min-h-[22px]">
          {listing?.name || "\u00A0"}
        </h3>

        <div className="flex items-center gap-[7px] max-[480px]:gap-[5px] text-[13px] max-md:text-[12px] max-[480px]:text-[11px] text-text-secondary truncate mb-1 min-h-[18px]">
          <i className="fa-solid fa-location-dot text-primary-light text-[13px] max-[480px]:text-[11px] shrink-0"></i>
          <span className="truncate">{listing?.address || "\u00A0"}</span>
        </div>

        <div className="flex items-center gap-[7px] max-[480px]:gap-[5px] text-[13px] max-md:text-[12px] max-[480px]:text-[11px] font-medium text-text-secondary mt-auto pt-1">
          <i className="fa-solid fa-star text-accent-yellow text-[13px] max-[480px]:text-[11px] shrink-0"></i>
          <span>
            {listing?.rating || 0} ({listing?.reviews || 0} reviews)
          </span>
        </div>
      </div>
    </Link>
  );
}