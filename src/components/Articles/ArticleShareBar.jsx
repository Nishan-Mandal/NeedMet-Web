import React, { useState } from "react";
import { useToast } from "../../contexts/toastContext.jsx";

export default function ArticleShareBar({
  title = "",
  url = typeof window !== "undefined" ? window.location.href : "",
  vertical = false,
  layout = "horizontal", // "horizontal" | "vertical" | "grid"
  showLabels = false,
}) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const cleanUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = `${title} - Read more on NeedMet: ${cleanUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cleanUrl);
      setCopied(true);
      showToast("Article link copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast("Failed to copy link", "error");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this article on NeedMet: ${title}`,
          url: cleanUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(cleanUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cleanUrl)}`;

  if (layout === "grid") {
    return (
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white transition-all duration-200 text-xs font-bold shadow-xs no-underline"
          title="Share on WhatsApp"
        >
          <i className="fa-brands fa-whatsapp text-sm"></i>
          <span>WhatsApp</span>
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white transition-all duration-200 text-xs font-bold shadow-xs no-underline"
          title="Share on X (Twitter)"
        >
          <i className="fa-brands fa-x-twitter text-xs"></i>
          <span>X / Twitter</span>
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white transition-all duration-200 text-xs font-bold shadow-xs no-underline"
          title="Share on Facebook"
        >
          <i className="fa-brands fa-facebook-f text-xs"></i>
          <span>Facebook</span>
        </a>
        <button
          onClick={handleNativeShare}
          className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 text-xs font-bold shadow-xs cursor-pointer ${
            copied
              ? "bg-accent-emerald text-white"
              : "bg-primary text-white hover:bg-primary-hover"
          }`}
          title={copied ? "Link Copied!" : "Share / Copy Link"}
        >
          <i className={`fa-solid ${copied ? "fa-check" : "fa-share-nodes"} text-xs`}></i>
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>
    );
  }

  if (vertical || layout === "vertical") {
    return (
      <div className="flex flex-col items-center gap-2.5">
        <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1 font-heading">
          Share
        </span>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all shadow-xs hover:-translate-y-0.5 no-underline"
          title="Share on WhatsApp"
        >
          <i className="fa-brands fa-whatsapp text-lg"></i>
        </a>

        {/* Twitter / X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white hover:bg-neutral-800 transition-all shadow-xs hover:-translate-y-0.5 no-underline"
          title="Share on X (Twitter)"
        >
          <i className="fa-brands fa-x-twitter text-base"></i>
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0077b5] text-white hover:bg-[#006396] transition-all shadow-xs hover:-translate-y-0.5 no-underline"
          title="Share on LinkedIn"
        >
          <i className="fa-brands fa-linkedin-in text-base"></i>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xs hover:-translate-y-0.5 cursor-pointer ${
            copied
              ? "bg-accent-emerald text-white"
              : "bg-primary text-white hover:bg-primary-hover"
          }`}
          title="Copy Link"
        >
          <i className={`fa-solid ${copied ? "fa-check" : "fa-link"} text-sm`}></i>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {showLabels && (
        <span className="hidden sm:inline text-xs font-semibold text-text-secondary mr-1">
          Share:
        </span>
      )}

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] hover:scale-105 active:scale-95 transition-all duration-200 text-xs font-semibold shadow-xs no-underline shrink-0 ${
          showLabels
            ? "w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5"
            : "w-8 h-8 sm:w-9 sm:h-9"
        }`}
        title="Share on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp text-sm sm:text-base"></i>
        {showLabels && <span className="hidden sm:inline">WhatsApp</span>}
      </a>

      {/* Twitter / X */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-black text-white hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all duration-200 text-xs font-semibold shadow-xs no-underline shrink-0 ${
          showLabels
            ? "w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5"
            : "w-8 h-8 sm:w-9 sm:h-9"
        }`}
        title="Share on X (Twitter)"
      >
        <i className="fa-brands fa-x-twitter text-xs sm:text-sm"></i>
        {showLabels && <span className="hidden sm:inline">X / Twitter</span>}
      </a>

      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1877F2] text-white hover:bg-[#166fe5] hover:scale-105 active:scale-95 transition-all duration-200 text-xs font-semibold shadow-xs no-underline shrink-0 ${
          showLabels
            ? "w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5"
            : "w-8 h-8 sm:w-9 sm:h-9"
        }`}
        title="Share on Facebook"
      >
        <i className="fa-brands fa-facebook-f text-xs sm:text-sm"></i>
        {showLabels && <span className="hidden sm:inline">Facebook</span>}
      </a>

      {/* Copy or Native Share */}
      <button
        onClick={handleNativeShare}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full transition-all duration-200 text-xs font-semibold shadow-xs cursor-pointer shrink-0 hover:scale-105 active:scale-95 ${
          copied
            ? "bg-accent-emerald text-white"
            : "bg-primary text-white hover:bg-primary-hover"
        } ${
          showLabels
            ? "w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5"
            : "w-8 h-8 sm:w-9 sm:h-9"
        }`}
        title={copied ? "Link Copied!" : "Share / Copy Link"}
      >
        <i className={`fa-solid ${copied ? "fa-check" : "fa-share-nodes"} text-xs sm:text-sm`}></i>
        {showLabels && (
          <span className="hidden sm:inline">
            {copied ? "Link Copied!" : "Share / Copy"}
          </span>
        )}
      </button>
    </div>
  );
}
