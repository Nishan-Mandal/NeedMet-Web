import React from "react";
import { Link, useNavigate } from "react-router-dom";
import empty_thumb from "../assets/empty_thumb.png";
import { generateSlug } from "../utils/slugify.js";

/**
 * Calculates current open/closed status from businessHours mapping.
 */
function getScheduleInfo(businessHours) {
  if (!businessHours || typeof businessHours !== "object" || Object.keys(businessHours).length === 0) {
    return { isOpen: true, statusText: "Open", closeText: "" };
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const now = new Date();
  const currentDay = days[now.getDay()];
  const todaySchedule = businessHours[currentDay];

  if (!todaySchedule || todaySchedule.isClosed) {
    return { isOpen: false, statusText: "Closed", closeText: "Closed Today" };
  }

  const currentMin = now.getHours() * 60 + now.getMinutes();
  const slots = todaySchedule.slots || [];

  for (const slot of slots) {
    if (!slot.open || !slot.close) continue;
    const [oh, om] = slot.open.split(":").map(Number);
    const [ch, cm] = slot.close.split(":").map(Number);
    const openMin = oh * 60 + om;
    const closeMin = ch * 60 + cm;

    if (currentMin >= openMin && currentMin < closeMin) {
      const ch12 = ch % 12 || 12;
      const ampm = ch >= 12 ? "PM" : "AM";
      const formattedClose = `${ch12}:${cm < 10 ? "0" : ""}${cm} ${ampm}`;
      return { isOpen: true, statusText: "Open", closeText: `Closes ${formattedClose}` };
    }
  }

  return { isOpen: false, statusText: "Closed", closeText: "Closed Now" };
}

export default function SpotlightListingCard({ listing = {} }) {
  const navigate = useNavigate();

  const imageUrl =
    listing?.images?.length > 0
      ? typeof listing.images[0] === "string"
        ? listing.images[0]
        : listing.images[0]?.thumbUrl || listing.images[0]?.fullUrl
      : empty_thumb;

  const isVerified = Boolean(
    listing?.verifiedBy || listing?.isVerified || listing?.verified
  );

  const scheduleInfo = getScheduleInfo(listing?.businessHours);

  const detailUrl = `/listing/${listing?.listingId || ""}/${generateSlug(
    listing?.name || ""
  )}`;

  const distanceText =
    listing?.distanceText ||
    (listing?.distance ? `${listing.distance} km` : "") ||
    listing?.city ||
    listing?.area ||
    "";

  const phone = listing?.phone || listing?.alternatePhone;

  const handleCardClick = () => {
    navigate(detailUrl, { state: { listing } });
  };

  return (
    <article
      onClick={handleCardClick}
      className="group bg-surface-container-lowest rounded-2xl shadow-[0_8px_24px_-4px_rgba(15,92,62,0.12),0_4px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_35px_-8px_rgba(15,92,62,0.22),0_8px_16px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300 flex flex-col overflow-hidden h-full cursor-pointer border-0"
    >
      {/* Media & Overlay Badges */}
      <div className="relative h-36 sm:h-40 md:h-44 lg:h-48 w-full overflow-hidden bg-surface-container shrink-0">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={imageUrl || empty_thumb}
          alt={listing?.name || "Listing thumbnail"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = empty_thumb;
          }}
        />

        {/* Status / Hours Badge at Top Left */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 pointer-events-none">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-primary text-[10px] sm:text-[11px] font-semibold backdrop-blur-md shadow-xs ${scheduleInfo.isOpen
              ? "bg-surface-container-lowest/95 text-secondary"
              : "bg-surface-container-lowest/95 text-on-surface-variant"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${scheduleInfo.isOpen ? "bg-secondary" : "bg-on-surface-variant"
                }`}
            ></span>
            <span>
              {scheduleInfo.statusText}
              {scheduleInfo.closeText ? ` · ${scheduleInfo.closeText}` : ""}
            </span>
          </span>
        </div>

        {/* Distance / Location Badge */}
        {distanceText && (
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2 py-0.5 rounded-md bg-on-surface/70 backdrop-blur-sm text-surface-container-lowest font-primary text-[10px] sm:text-[11px] font-medium shadow-xs pointer-events-none">
            {distanceText}
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-primary text-[11px] text-secondary font-bold uppercase tracking-wider truncate">
              {listing?.category || "Local Business"}
            </span>
            <div className="flex items-center gap-1 font-primary text-[13px] text-on-surface font-bold shrink-0">
              <span
                className="material-symbols-outlined text-yellow-400 text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span>
                {listing?.rating ? Number(listing.rating).toFixed(1) : "New"}
              </span>
              <span className="text-on-surface-variant text-[12px] font-normal">
                ({listing?.reviews || 0})
              </span>
            </div>
          </div>

          {/* Business Name with Verified Checkmark */}
          <div className="flex items-center gap-1 mt-1">
            <h3 className="font-heading text-[17px] font-bold text-on-surface group-hover:text-primary transition-colors truncate capitalize m-0">
              {listing?.name || "Untitled Listing"}
            </h3>
            {/* {isVerified && (
              <span
                className="material-symbols-outlined text-[17px] text-primary shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
                title="Verified Business"
              >
                verified
              </span>
            )} */}
          </div>

          {/* Location */}
          <p className="font-primary text-[13px] text-on-surface-variant mt-1 flex items-center gap-1 m-0 truncate">
            <span
              style={{ fontVariationSettings: "'FILL' 1" }}
              className="material-symbols-outlined text-[16px] text-primary shrink-0"
            >
              location_on
            </span>
            <span className="truncate">
              {listing?.address || "Haldia, West Bengal"}
            </span>
          </p>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex items-center gap-2">
          {phone ? (
            <a
              href={`tel:${phone}`}
              onClick={(e) => e.stopPropagation()}
              title="Call Business"
              aria-label="Call Business"
              className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container text-secondary flex items-center justify-center shrink-0 transition-colors shadow-xs no-underline"
            >
              <span className="material-symbols-outlined text-[16px]">
                call
              </span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              onClick={(e) => e.stopPropagation()}
              title="No Phone Available"
              aria-label="No Phone Available"
              className="w-8 h-8 rounded-full bg-surface-container-low/60 text-outline-variant/60 flex items-center justify-center shrink-0 cursor-not-allowed shadow-none border-0"
            >
              <span className="material-symbols-outlined text-[16px]">
                call
              </span>
            </button>
          )}

          <Link
            to={detailUrl}
            state={{ listing }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 py-1.5 px-3 rounded-full bg-primary-container hover:bg-primary text-on-primary font-primary text-[12px] font-semibold text-center transition-all shadow-xs flex items-center justify-center gap-1.5 no-underline group/btn"
          >
            <span>View Details</span>
            <span className="material-symbols-outlined text-[15px] group-hover/btn:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
