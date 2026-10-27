import { useEffect, useState } from "react";
import blueTick from "../../../assets/blueTick.svg";
import useInfo from "../../../contexts/infoContext.jsx";
import { getHomeDetails } from "../../../services/firebase/firestore/homeService.js";
import { useQuery } from "@tanstack/react-query";
import QrPosterModal from "../../../components/QR/QrPosterModal.jsx";

/* ──────────────────────────────────────────────────────────────
   ActionBar.jsx
   - Desktop (>=sm): Single unified horizontal bar using full width:
     Left: Contributor Profile
     Right: Likes, Views, Phone, Direction, Share, Help, QR
   - Mobile (<sm): 2-Row Stack with Transparent Background:
     Row 1: Contributor Profile (Left) | Likes & Views, Share, Help, QR (Right)
     Row 2: Phone Number and Direction (2-Column Grid CTA)
─────────────────────────────────────────────────────────────── */
function getOwnerLogo(fullName) {
  const parts = (fullName || '').trim().split(/\s+/);
  const firstChar = parts[0] ? parts[0][0] : '';
  if (parts.length === 1) return firstChar.toUpperCase();
  const lastChar = parts[parts.length - 1] ? parts[parts.length - 1][0] : '';
  return (firstChar + lastChar).toUpperCase();
}

export default function ActionBar({ listing = {} }) {
  const [copied, setCopied] = useState(false);
  const [showQrPoster, setShowQrPoster] = useState(false);

  const hasPhone = Boolean(listing?.phone || listing?.alternatePhone);
  const phoneNumber = listing?.phone || listing?.alternatePhone || '';
  const hasGeo = Boolean(listing?.geo?.lat && listing?.geo?.lng);

  const { contactNo, setContactNo } = useInfo();

  const { data: homeData } = useQuery({
    queryKey: ['homeDetails'],
    queryFn: () => getHomeDetails(),
    enabled: !contactNo,
  });

  useEffect(() => {
    if (homeData?.whatsappSupport) {
      setContactNo(homeData.whatsappSupport);
    }
  }, [homeData, setContactNo]);

  const handleHelp = () => {
    if (contactNo) {
      const whatsappLink = `https://wa.me/${contactNo.replace(/[^\d]/g, '')}`;
      window.open(whatsappLink, '_blank');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareTitle = listing?.name ? `${listing.name} on NeedMet` : 'NeedMet Listing';
    const shareText = `Check out ${listing?.name || 'this business'} on NeedMet:`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url,
        });
      } catch (_) {
        // User dismissed share dialog
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (_) {}
    }
  };

  /* ── 1. Contributor Profile ── */
  const renderContributorProfile = () => (
    <div className="flex min-w-0 items-center gap-2 sm:gap-2.5 shrink-0">
      <div
        className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-bold text-white shadow-xs select-none ring-2 ring-primary/20"
        style={{
          background: "linear-gradient(135deg, #0f5c3e 0%, #1a8a5a 100%)",
        }}
      >
        {getOwnerLogo(listing.ownerName || "U")}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <p
            className="m-0 truncate max-w-[95px] min-[400px]:max-w-[130px] sm:max-w-none text-xs sm:text-sm font-bold text-text font-heading"
            title={listing.ownerName || "Community Contributor"}
          >
            {listing.ownerName || "Community Contributor"}
          </p>
          <img
            src={blueTick}
            alt="Verified"
            className="h-3.5 w-3.5 shrink-0"
            title="Verified Contributor"
          />
        </div>
        <p className="m-0 text-[11px] text-text-secondary font-medium tracking-tight">
          Contributor
        </p>
      </div>
    </div>
  );

  /* ── 2. Likes & Views ── */
  const renderLikesAndViews = () => (
    <>
      {/* Likes */}
      <button
        type="button"
        className="flex h-8 sm:h-8.5 items-center gap-1.5 rounded-full border border-border/80 bg-white sm:bg-gray-50/90 hover:bg-gray-100 hover:border-gray-300 px-2 sm:px-2.5 text-xs font-semibold text-text transition-all duration-150 active:scale-95 shrink-0 cursor-pointer shadow-2xs"
        aria-label={`${listing.likes ?? 0} likes`}
        title={`${listing.likes ?? 0} likes`}
      >
        <i className="fa-solid fa-thumbs-up text-primary text-[11px] sm:text-xs" />
        <span>{listing.likes ?? 0}</span>
      </button>

      {/* Views */}
      <div
        className="flex h-8 sm:h-8.5 items-center gap-1.5 rounded-full border border-border/80 bg-white sm:bg-gray-50/90 px-2 sm:px-2.5 text-xs font-semibold text-text select-none shrink-0 shadow-2xs"
        title={`${listing.views ?? 0} views`}
      >
        <i className="fa-regular fa-eye text-primary text-[11px] sm:text-xs" />
        <span>{listing.views ?? 0}</span>
      </div>
    </>
  );

  /* ── 3. Secondary Utility Icons: Share, Help, QR ── */
  const renderSecondaryIcons = () => (
    <>
      {/* Share */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share listing"
          title="Share"
          className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border border-border/80 bg-white sm:bg-gray-50 hover:bg-primary-surface hover:text-primary hover:border-primary/40 text-text flex items-center justify-center transition-all duration-150 active:scale-95 shadow-2xs cursor-pointer shrink-0"
        >
          <i className="fa-solid fa-share-nodes text-[11px] sm:text-xs text-primary" />
        </button>

        {copied && (
          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded-md shadow-lg whitespace-nowrap pointer-events-none z-30">
            Link copied!
          </span>
        )}
      </div>

      {/* Help */}
      <button
        type="button"
        onClick={handleHelp}
        aria-label="Help on WhatsApp"
        title="Need help? Chat on WhatsApp"
        className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border border-border/80 bg-white sm:bg-gray-50 hover:bg-primary-surface hover:text-primary hover:border-primary/40 text-text flex items-center justify-center transition-all duration-150 active:scale-95 shadow-2xs cursor-pointer shrink-0"
      >
        <i className="fa-regular fa-circle-question text-[11px] sm:text-xs text-primary" />
      </button>

      {/* QR Poster */}
      <button
        type="button"
        onClick={() => setShowQrPoster(true)}
        aria-label="Generate QR poster"
        title="QR Code Poster"
        className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border border-border/80 bg-white sm:bg-gray-50 hover:bg-primary-surface hover:text-primary hover:border-primary/40 text-text flex items-center justify-center transition-all duration-150 active:scale-95 shadow-2xs cursor-pointer shrink-0"
      >
        <i className="fa-solid fa-qrcode text-[11px] sm:text-xs text-primary" />
      </button>
    </>
  );

  /* ── 4. Phone Button (Row 2 on Mobile, Inline on Desktop) ── */
  const renderPhoneButton = (isMobile = false) => {
    if (!hasPhone) {
      return isMobile ? (
        <span className="text-xs text-text-secondary italic self-center text-center">No contact</span>
      ) : null;
    }

    return (
      <a
        href={`tel:${phoneNumber}`}
        aria-label={`Call: ${phoneNumber}`}
        title={`Call: ${phoneNumber}`}
        className={`flex h-8.5 sm:h-9 px-3.5 sm:px-4 items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-all duration-150 active:scale-95 shadow-xs text-xs sm:text-sm font-bold no-underline ${
          isMobile ? "w-full" : "shrink-0"
        }`}
      >
        <i className="fa-solid fa-phone text-[11px] sm:text-xs shrink-0" />
        <span className="truncate">{phoneNumber}</span>
      </a>
    );
  };

  /* ── 5. Directions Button (Row 2 on Mobile, Inline on Desktop) ── */
  const renderDirectionsButton = (isMobile = false) => {
    if (!hasGeo) {
      return isMobile ? (
        <span className="text-xs text-text-secondary italic self-center text-center">No location</span>
      ) : null;
    }

    return (
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${listing.geo.lat},${listing.geo.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get directions"
        title="Directions on Google Maps"
        className={`flex h-8.5 sm:h-9 px-3.5 sm:px-4 items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-primary/25 bg-primary-surface text-primary hover:bg-primary hover:text-white transition-all duration-150 active:scale-95 shadow-2xs text-xs sm:text-sm font-bold no-underline ${
          isMobile ? "w-full" : "shrink-0"
        }`}
      >
        <i className="fa-solid fa-location-arrow text-[11px] sm:text-xs text-primary group-hover:text-white shrink-0" />
        <span className="truncate">Direction</span>
      </a>
    );
  };

  return (
    <>
      <div className="w-full min-w-0 rounded-2xl bg-white border border-border shadow-sm p-3.5 sm:px-5 lg:px-6 font-primary transition-all">
        
        {/* ── Mobile Layout (<sm): 2-Row Stack with Transparent Background ── */}
        <div className="flex flex-col gap-2.5 sm:hidden w-full">
          {/* Row 1: Contributor Profile (Left) | Likes & Views, Share, Help, QR (Right) */}
          <div className="flex items-center justify-between gap-2 min-w-0 w-full">
            {renderContributorProfile()}

            <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 py-0.5 max-w-[62%] justify-end">
              {renderLikesAndViews()}
              {renderSecondaryIcons()}
            </div>
          </div>

          {/* Row 2: Phone Number and Direction (2-Column Grid CTA) */}
          <div className={`grid ${hasPhone && hasGeo ? "grid-cols-2" : "grid-cols-1"} gap-2 min-w-0 w-full`}>
            {renderPhoneButton(true)}
            {renderDirectionsButton(true)}
          </div>
        </div>

        {/* ── Desktop Layout (>=sm): Single Unified Horizontal Row Spanning Full Width ── */}
        <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-4 min-w-0 w-full">
          {/* Left: Contributor Profile */}
          {renderContributorProfile()}

          {/* Right: Unified Actions Row Spanning the Card */}
          <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 shrink-0 ml-auto flex-nowrap">
            {renderLikesAndViews()}
            {renderPhoneButton(false)}
            {renderDirectionsButton(false)}
            {renderSecondaryIcons()}
          </div>
        </div>
      </div>

      {/* QR Poster Modal */}
      {showQrPoster && (
        <QrPosterModal
          open={showQrPoster}
          onClose={() => setShowQrPoster(false)}
          listing={listing}
        />
      )}
    </>
  );
}
