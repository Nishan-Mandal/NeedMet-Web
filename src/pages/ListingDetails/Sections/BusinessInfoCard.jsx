import { useState } from 'react';
import { TimeSlot } from '../../../data/model/listingModel.js';

/* ──────────────────────────────────────────────────────────────
   Social Links Configuration
   FontAwesome brand icons with curated brand color accents
─────────────────────────────────────────────────────────────── */
const SOCIAL_CONFIG = [
  {
    key: 'website',
    aliases: ['website', 'Website', 'web', 'Web', 'site', 'Site', 'url'],
    label: 'Website',
    iconClass: 'fa-solid fa-globe',
    colorClasses: 'bg-primary/5 text-primary border-primary/20 hover:bg-primary hover:text-white hover:border-primary',
  },
  {
    key: 'whatsapp',
    aliases: ['whatsapp', 'WhatsApp', 'wa'],
    label: 'WhatsApp',
    iconClass: 'fa-brands fa-whatsapp text-[#25D366] group-hover:text-white',
    colorClasses: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
  },
  {
    key: 'instagram',
    aliases: ['instagram', 'Instagram', 'insta', 'ig'],
    label: 'Instagram',
    iconClass: 'fa-brands fa-instagram text-[#E1306C] group-hover:text-white',
    colorClasses: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white hover:border-transparent',
  },
  {
    key: 'facebook',
    aliases: ['facebook', 'Facebook', 'fb'],
    label: 'Facebook',
    iconClass: 'fa-brands fa-facebook-f text-[#1877F2] group-hover:text-white',
    colorClasses: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
  },
  {
    key: 'linkedin',
    aliases: ['linkedin', 'LinkedIn'],
    label: 'LinkedIn',
    iconClass: 'fa-brands fa-linkedin-in text-[#0A66C2] group-hover:text-white',
    colorClasses: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
  },
  {
    key: 'youtube',
    aliases: ['youtube', 'YouTube', 'yt'],
    label: 'YouTube',
    iconClass: 'fa-brands fa-youtube text-[#FF0000] group-hover:text-white',
    colorClasses: 'bg-red-50 text-red-700 border-red-200 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]',
  },
  {
    key: 'twitter',
    aliases: ['twitter', 'Twitter', 'x', 'X'],
    label: 'Twitter / X',
    iconClass: 'fa-brands fa-x-twitter text-gray-800 group-hover:text-white',
    colorClasses: 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-black hover:text-white hover:border-black',
  },
];

function formatSocialLink(key, value) {
  if (!value || typeof value !== 'string') return '';
  const clean = value.trim();
  if (!clean) return '';
  if (key === 'whatsapp') {
    let number = clean.replace(/[^\d]/g, '');
    if (number.length === 10) number = '91' + number;
    return `https://wa.me/${number}`;
  }
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  return `https://${clean}`;
}

/* ──────────────────────────────────────────────────────────────
   BusinessInfoCard.jsx
   Refined business details card with clear visual hierarchy:
   - Category Badge
   - Listing Title (H1)
   - Rating & Live Availability Status
   - Address & Directions link
   - Social Media Links
   - Expandable About / Description
─────────────────────────────────────────────────────────────── */
export default function BusinessInfoCard({ listing = {}, className = '' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if listing is currently open
  const getOpenStatus = () => {
    if (!listing?.businessHours) return null;
    const now = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = dayNames[now.getDay()];
    const hours = listing.businessHours[today] || listing.businessHours[today.toLowerCase()];
    if (!hours || hours.isClosed) return { isOpen: false, label: 'Closed Today' };
    const slots = hours.slots || [];
    if (slots.length === 0) return null;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    let isCurrentlyOpen = false;
    let nextCloseTime = null;

    for (const slot of slots) {
      if (!slot?.open || !slot?.close) continue;
      const [oH, oM] = slot.open.split(':').map(Number);
      const [cH, cM] = slot.close.split(':').map(Number);
      const openMinutes = oH * 60 + (oM || 0);
      const closeMinutes = cH * 60 + (cM || 0);
      if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
        isCurrentlyOpen = true;
        nextCloseTime = TimeSlot.to12(slot.close);
        break;
      }
    }

    if (isCurrentlyOpen) {
      return { isOpen: true, label: nextCloseTime ? `Open · Closes ${nextCloseTime}` : 'Open Now' };
    }
    return { isOpen: false, label: 'Closed Now' };
  };

  const openStatus = getOpenStatus();

  // Only display configured social media links
  const activeSocials = SOCIAL_CONFIG.map((item) => {
    const rawVal =
      item.aliases.map((a) => listing.social?.[a]).find(Boolean) ||
      (item.key === 'website' ? (listing.website || listing.websiteUrl) : null);

    const hasLink = Boolean(rawVal && typeof rawVal === 'string' && rawVal.trim());

    return {
      ...item,
      hasLink,
      url: hasLink ? formatSocialLink(item.key, rawVal) : '',
    };
  }).filter((item) => item.hasLink);

  const isLongDescription = Boolean(listing.description && listing.description.length > 200);

  return (
    <div className={`bg-white border border-border/80 rounded-2xl shadow-xs sm:shadow-sm overflow-hidden font-primary transition-all ${className}`}>
      {/* Card body */}
      <div className="p-4 sm:p-5 lg:p-6 flex flex-col gap-3.5 sm:gap-4">

        {/* 1. Category Badge */}
        {listing.category && (
          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 bg-primary-surface text-primary border border-primary/20 text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-heading">
              <i className="fa-solid fa-tag text-[0.6rem]"></i>
              {listing.category}
            </span>
          </div>
        )}

        {/* 2. Listing Title */}
        <h1 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-[1.75rem] leading-snug text-text-accent m-0 capitalize tracking-tight break-words">
          {listing.name}
        </h1>

        {/* 3. Rating & Availability Status */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <div className="inline-flex items-center gap-1.5 bg-amber-50/80 border border-amber-200/60 px-2.5 sm:px-3 py-1 rounded-full shadow-2xs">
            <i className="fa-solid fa-star text-amber-500 text-xs"></i>
            <span className="text-xs sm:text-sm font-bold text-amber-950 font-heading">
              {listing.rating || 0}
            </span>
            <span className="text-[11px] sm:text-xs text-amber-800/80 font-medium">
              ({listing.reviews || 0} {listing.reviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          {openStatus && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full border shadow-2xs ${
                openStatus.isOpen
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  openStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'
                }`}
              ></span>
              {openStatus.label}
            </span>
          )}
        </div>

        {/* 4. Address */}
        {listing.address && (
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed bg-gray-50/80 p-3 rounded-xl border border-border/70">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary-surface text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <i className="fa-solid fa-location-dot text-xs"></i>
            </div>
            <span className="pt-0.5 font-medium break-words text-text/80">{listing.address}</span>
          </div>
        )}

        {/* 5. Social Media Links */}
        {activeSocials.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            {activeSocials.map((item) => (
              <a
                key={item.key}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                title={item.label}
                aria-label={item.label}
                className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full inline-flex items-center justify-center border text-xs sm:text-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs active:scale-95 cursor-pointer no-underline ${item.colorClasses}`}
              >
                <i className={`${item.iconClass} text-center shrink-0`}></i>
              </a>
            ))}
          </div>
        )}

        {/* 6. About / Description with Read more toggle */}
        {listing.description && (
          <div className="border-t border-border/70 pt-3.5 mt-0.5">
            <div className="flex items-center gap-2 mb-1.5">
              <i className="fa-solid fa-align-left text-xs text-primary"></i>
              <h3 className="text-xs sm:text-sm font-bold font-heading text-text-accent uppercase tracking-wider m-0">
                About This Business
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed m-0 whitespace-pre-line font-primary">
              {isLongDescription && !isExpanded
                ? `${listing.description.slice(0, 200).trim()}...`
                : listing.description}
            </p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors cursor-pointer select-none bg-transparent border-none p-0"
              >
                <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-[10px]`}></i>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
