import React from "react";
import { Link, useNavigate } from "react-router-dom";
import empty_thumb from "../../../assets/empty_thumb.png";
import { generateSlug } from "../../../utils/slugify";

export default function SearchListItemCard({ listing }) {
  const navigate = useNavigate();

  if (!listing) return null;

  const img =
    listing?.images?.[0]?.thumbUrl ||
    listing?.images?.[0]?.fullUrl ||
    listing?.images?.[0] ||
    empty_thumb;
  const phone = listing?.phone || listing?.alternatePhone;
  const detailUrl = `/listing/${listing.listingId || listing.id}/${generateSlug(
    listing.name || ""
  )}`;

  return (
    <article
      onClick={() => navigate(detailUrl, { state: { listing } })}
      className="group bg-white rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(15,92,62,0.08),0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(15,92,62,0.16),0_4px_8px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 cursor-pointer"
    >
      <div className="relative w-full sm:w-44 h-36 rounded-xl overflow-hidden bg-surface-container shrink-0">
        <img
          src={img}
          alt={listing.name || "Business"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-xs text-secondary text-[10px] font-bold">
          Verified
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-primary text-[11px] text-secondary font-bold uppercase tracking-wider">
            {listing.category || "Local Business"}
          </span>
          <div className="flex items-center gap-1 font-primary text-[13px] text-on-surface font-bold shrink-0">
            <span className="text-secondary">★</span>
            <span>{listing.rating ? Number(listing.rating).toFixed(1) : "New"}</span>
          </div>
        </div>

        <h3 className="font-heading text-[17px] font-bold text-on-surface group-hover:text-primary transition-colors m-0 truncate">
          {listing.name}
        </h3>

        <p className="font-primary text-[13px] text-on-surface-variant flex items-center gap-1 m-0 truncate">
          <span className="material-symbols-outlined text-[15px] text-secondary">
            location_on
          </span>
          <span>{listing.address || "Haldia, West Bengal"}</span>
        </p>

        {listing.description && (
          <p className="font-primary text-[12px] text-on-surface-variant/80 line-clamp-2 m-0">
            {listing.description}
          </p>
        )}
      </div>

      <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 sm:w-32 py-2 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-primary font-semibold text-[12px] text-center transition-all shadow-[0_2px_8px_rgba(15,92,62,0.08)] flex items-center justify-center gap-1 no-underline"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">
              call
            </span>
            <span>Call</span>
          </a>
        )}
        <Link
          to={detailUrl}
          state={{ listing }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 sm:w-32 py-2 px-3 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-primary font-bold text-[12px] text-center transition-all shadow-xs flex items-center justify-center gap-1 no-underline"
        >
          <span>View</span>
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </Link>
      </div>
    </article>
  );
}
