import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import PosterTemplate from "./PosterTemplate";
import { generateSlug } from "../../utils/slugify.js";

export default function QrPosterModal({ open, onClose, listing }) {
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preparing, setPreparing] = useState(false); // pre-capture in progress
  const [error, setError] = useState(null);
  const [mainQr, setMainQr] = useState("");
  const [socialQrs, setSocialQrs] = useState({
    instagram: "",
    facebook: "",
    whatsapp: "",
    website: "",
    linkedin: "",
    maps: "",
  });

  const cachedBlobRef = useRef(null);

  // =========================================
  // GENERATE ALL QR CODES
  // =========================================

  useEffect(() => {
    if (!open) return;

    cachedBlobRef.current = null;

    const generateQrs = async () => {
      try {
        setLoading(true);
        setError(null);

        await new Promise((resolve) => requestAnimationFrame(resolve));

        const slug = generateSlug(listing.name);
        const reviewUrl = listing?.listingId
          ? `https://needmet.in/listing/${listing.listingId}/${slug}?show=review_modal`
          : "https://needmet.in";
        const instagramUrl = listing?.social?.instagram || "";
        const facebookUrl = listing?.social?.facebook || "";
        const whatsappUrl = listing?.phone
          ? `https://wa.me/${listing.phone}`
          : "";
        const websiteUrl = listing?.social?.website || "";
        const linkedinUrl = listing?.social?.linkedin || "";
        const mapsUrl =
          listing?.geo?.lat && listing?.geo?.lng
            ? `https://www.google.com/maps/dir/?api=1&destination=${listing.geo.lat},${listing.geo.lng}`
            : "";

        // Main QR
        const main = await QRCode.toDataURL(reviewUrl, {
          width: 1000,
          margin: 1,
          errorCorrectionLevel: "H",
        });

        const generateQrSafely = async (url) => {
          if (!url || url.trim() === "") return "";
          return await QRCode.toDataURL(url, {
            width: 400,
            margin: 1,
            errorCorrectionLevel: "H",
          });
        };

        // Social QRs
        const instagram = await generateQrSafely(instagramUrl);
        const facebook = await generateQrSafely(facebookUrl);
        const whatsapp = await generateQrSafely(whatsappUrl);
        const website = await generateQrSafely(websiteUrl);
        const linkedin = await generateQrSafely(linkedinUrl);
        const maps = await generateQrSafely(mapsUrl);

        setMainQr(main);
        setSocialQrs({ instagram, facebook, whatsapp, website, linkedin, maps });
      } catch (err) {
        console.error(err);
        setError("Failed to generate QR poster.");
      } finally {
        setLoading(false);
      }
    };

    generateQrs();
  }, [open, listing]);

  useEffect(() => {
    if (!mainQr || loading) return;

    const preCaptureBlob = async () => {
      try {
        setPreparing(true);

        await new Promise((r) => setTimeout(r, 400));

        const canvas = await capturePoster();
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );

        cachedBlobRef.current = blob;
      } catch (err) {
        console.error("Pre-capture failed:", err);
      } finally {
        setPreparing(false);
      }
    };

    preCaptureBlob();
  }, [mainQr, loading]);

  // =========================================
  // BODY SCROLL LOCK
  // =========================================

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const capturePoster = async () => {
    const source = document.getElementById("needmet-business-poster");

    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: -9999px;
      width: 1240px;
      height: auto;
      z-index: -1;
      background: #ffffff;
      pointer-events: none;
    `;

    const clone = source.cloneNode(true);
    clone.style.transform = "none";
    clone.style.width = "1240px";
    clone.style.minHeight = "1754px";
    clone.style.overflow = "visible";

    container.appendChild(clone);
    document.body.appendChild(container);

    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );

    const actualWidth = clone.scrollWidth;
    const actualHeight = clone.scrollHeight;

    const canvas = await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: actualWidth,
      height: actualHeight,
      windowWidth: actualWidth,
      windowHeight: actualHeight,
      scrollX: 0,
      scrollY: 0,
    });

    document.body.removeChild(container);

    return canvas;
  };

  // =========================================
  // DOWNLOAD PNG
  // =========================================

  const handleDownload = async () => {
    try {
      setDownloading(true);

      let blob = cachedBlobRef.current;
      if (!blob) {
        const canvas = await capturePoster();
        blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${listing.name
        .replace(/\s+/g, "-")
        .toLowerCase()}-poster.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setSharing(true);

      let blob = cachedBlobRef.current;
      if (!blob) {
        console.warn("Blob not pre-cached, capturing live (may fail on some browsers)");
        const canvas = await capturePoster();
        blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
      }

      if (!blob) throw new Error("Failed to create image blob");

      const file = new File([blob], "needmet-poster.png", {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: listing?.name,
          text: `Check out ${listing?.name} on NeedMet`,
          files: [file],
        });
      } else {
        // Fallback: trigger download if Web Share API unavailable
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "needmet-poster.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
      }
    } finally {
      setSharing(false);
    }
  };

  if (!open) return null;

  const isBusy = loading || downloading || sharing || !!error;
  const shareReady = !!cachedBlobRef.current && !preparing;

  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-black/80 flex justify-center items-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full h-[90%] max-w-[520px] bg-white rounded-3xl p-4 sm:p-5 flex flex-col overflow-hidden animate-[fadeIn_0.22s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <i className="fa-solid fa-qrcode text-xl text-primary"></i>
            <h2 className="m-0 text-lg sm:text-xl font-bold text-gray-900">Business QR Poster</h2>
          </div>

          <button
            className="w-10 h-10 border-none rounded-full bg-gray-100 hover:bg-gray-200 hover:rotate-90 cursor-pointer flex items-center justify-center text-gray-700 text-base transition-all shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* PREVIEW */}
        <div className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 sm:p-4 flex justify-center items-start overflow-y-auto min-h-0">
          {loading && (
            <div className="min-h-[260px] flex flex-col items-center justify-center gap-3 text-gray-600">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-primary"></i>
              <span>Generating poster...</span>
            </div>
          )}

          {error && (
            <div className="min-h-[260px] flex flex-col items-center justify-center gap-3 text-accent-red text-center">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && mainQr && (
            <div className="w-full flex justify-center items-start h-[calc(1754px*0.19)] sm:h-[calc(1754px*0.24)] md:h-[calc(1754px*0.32)]">
              <div className="w-[1240px] h-[1754px] shrink-0 origin-top flex justify-center items-start scale-[0.19] sm:scale-[0.24] md:scale-[0.32]">
                <div id="needmet-business-poster" className="w-[1240px] min-h-[1754px] bg-white overflow-hidden">
                  <PosterTemplate
                    listing={listing}
                    qrImage={mainQr}
                    socialQrs={socialQrs}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-3.5 shrink-0">
          {/* DOWNLOAD */}
          <button
            className="flex-1 h-[46px] sm:h-[52px] border-none rounded-[12px] sm:rounded-[14px] cursor-pointer text-sm sm:text-base font-semibold flex items-center justify-center gap-2 text-white bg-primary hover:bg-[#0a4530] disabled:opacity-45 disabled:cursor-not-allowed active:scale-95 transition-all"
            onClick={handleDownload}
            disabled={isBusy}
          >
            {downloading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Please wait...
              </>
            ) : (
              <>
                <i className="fa-solid fa-download"></i>
                Download
              </>
            )}
          </button>

          {/* SHARE */}
          <button
            className="flex-1 h-[46px] sm:h-[52px] border-none rounded-[12px] sm:rounded-[14px] cursor-pointer text-sm sm:text-base font-semibold flex items-center justify-center gap-2 text-white bg-primary hover:bg-[#0a4530] disabled:opacity-45 disabled:cursor-not-allowed active:scale-95 transition-all"
            onClick={handleShare}
            disabled={isBusy || !shareReady}
          >
            {sharing ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Please wait...
              </>
            ) : preparing || (!shareReady && !error && !loading) ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Preparing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-share-nodes"></i>
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}