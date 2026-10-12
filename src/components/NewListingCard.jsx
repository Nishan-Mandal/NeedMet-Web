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

export default function NewListingCard({ listing = {} }) {
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

  const isTopRated = Boolean(
    listing?.isPremium ||
    (Number(listing?.rating || 0) >= 4.5 && Number(listing?.reviews || 0) > 0)
  );

  const scheduleInfo = getScheduleInfo(listing?.businessHours);

  const detailUrl = `/listing/${listing?.listingId || ""}/${generateSlug(
    listing?.name || ""
  )}`;

  const displayTags =
    Array.isArray(listing?.tags) && listing.tags.length > 0
      ? listing.tags.slice(0, 3)
      : listing?.category
        ? [listing.category]
        : [];

  const handleCardClick = () => {
    navigate(detailUrl, { state: { listing } });
  };

  const phone = listing?.phone || listing?.alternatePhone;

  return (
    <article
      onClick={handleCardClick}
      className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 flex flex-col cursor-pointer    border-outline-variant/30 h-full"
    >
      {/* Card Media & Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-surface-container-low shrink-0">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={imageUrl || empty_thumb}
          alt={listing?.name || "Listing thumbnail"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = empty_thumb;
          }}
        />

        {/* Status Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 z-10 pointer-events-none">
          {isVerified && (
            <span className="inline-flex items-center gap-0.5 bg-surface-container-lowest/95 backdrop-blur-sm text-secondary font-primary text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
              <span
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              Verified
            </span>
          )}
          {isTopRated && (
            <span className="inline-flex items-center bg-primary-container text-on-primary font-primary text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
              {listing?.isPremium ? "Top Rated" : "Popular"}
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 font-primary text-[11px] text-on-surface shadow-xs z-10 pointer-events-none">
          <span className="text-secondary font-bold">★</span>
          <span className="font-bold">
            {listing?.rating ? Number(listing.rating).toFixed(1) : "New"}
          </span>
          <span className="text-on-surface-variant font-medium">
            ({listing?.reviews || 0})
          </span>
        </div>
      </div>

      {/* Card Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Title & Availability */}
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="font-heading text-lg font-semibold text-on-surface group-hover:text-primary transition-colors truncate capitalize m-0">
              {listing?.name || "Untitled Listing"}
            </h3>
            <span
              className={`inline-flex items-center gap-1 font-primary text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${scheduleInfo.isOpen
                  ? "text-secondary bg-secondary-container/40"
                  : "text-on-surface-variant bg-surface-container-high"
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${scheduleInfo.isOpen ? "bg-secondary" : "bg-on-surface-variant"
                  }`}
              ></span>
              {scheduleInfo.statusText}
            </span>
          </div>

          {/* Distance & Location */}
          <p className="font-primary text-[13px] text-on-surface-variant flex items-center gap-1 m-0 truncate">
            <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">
              near_me
            </span>
            <span className="truncate">
              {listing?.address || "Haldia, West Bengal"}
            </span>
          </p>

          {/* Category & Schedule */}
          <p className="font-primary text-[11px] text-on-surface-variant font-medium m-0 truncate">
            {listing?.category || "Local Service"}
            {scheduleInfo.closeText ? ` · ${scheduleInfo.closeText}` : ""}
          </p>

          {/* Tags / Amenities */}
          <div className="flex flex-wrap gap-1 pt-1 min-h-[26px]">
            {displayTags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-surface-container-low text-on-surface font-primary px-2 py-0.5 rounded-md text-[11px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        { phone &&
          <div className="pt-2 flex items-center gap-2">
            {phone ? (
              <a
                href={`tel:${phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 py-2 px-3 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-primary text-[12px] font-medium text-center transition-colors flex items-center justify-center gap-1 no-underline"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  call
                </span>
                <span>Call Now</span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                onClick={(e) => e.stopPropagation()}
                className="flex-1 py-2 px-3 rounded-lg bg-surface-container-low/50 text-on-surface-variant/50 font-primary text-[12px] font-medium text-center flex items-center justify-center gap-1 cursor-not-allowed border-none"
              >
                <span className="material-symbols-outlined text-[16px]">
                  call_off
                </span>
                <span>No Phone</span>
              </button>
            )}

            <Link
              to={detailUrl}
              state={{ listing }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 py-2 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-primary text-[12px] font-semibold text-center transition-all shadow-xs flex items-center justify-center gap-1 no-underline"
            >
              <span>View Details</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>
        }
      </div>
    </article>
  );
}
