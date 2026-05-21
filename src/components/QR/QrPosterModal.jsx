import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import PosterTemplate from "./PosterTemplate";
import "../../style/QR/QrPosterModal.css";

export default function QrPosterModal({open, onClose, listing}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mainQr, setMainQr] = useState("");
  const [socialQrs, setSocialQrs] =
    useState({
      instagram: "",
      facebook: "",
      whatsapp: "",
      maps: "",
    });

  // =========================================
	// GENERATE ALL QR CODES
	// =========================================

	useEffect(() => {
		if (!open) return;
		const generateQrs = async () => {

			try {
				setLoading(true);
        setError(null);

        // wait for next paint
        await new Promise((resolve) =>
          requestAnimationFrame(resolve)
        );

				// SAFE FALLBACKS
				const reviewUrl = listing?.listingId
          ? `https://needmet.in/listing/${listing.listingId}`
          : "https://needmet.in";
				const instagramUrl = listing?.social?.instagram || "";
				const facebookUrl = listing?.social?.facebook || "";
				const whatsappUrl = listing?.phone
          ? `https://wa.me/${listing.phone}`
          : "";
				const websiteUrl = listing?.social?.website || "";
				const linkedinUrl = listing?.social?.linkedin || "";
				const mapsUrl = listing?.geo?.lat && listing?.geo?.lng
            ? `https://www.google.com/maps/dir/?api=1&destination=${listing.geo.lat},${listing.geo.lng}`
            : "";

				// MAIN QR
				const main = await QRCode.toDataURL(reviewUrl, {width: 1000, margin: 1, errorCorrectionLevel: "H",});

				const generateQrSafely = async (url) => {
          if (!url || url.trim() === "") return "";

          return await QRCode.toDataURL(url, {
            width: 400,
            margin: 1,
            errorCorrectionLevel: "H",
          });
        };

        // SOCIAL QR
        const instagram = await generateQrSafely(instagramUrl);
        const facebook = await generateQrSafely(facebookUrl);
        const whatsapp = await generateQrSafely(whatsappUrl);
        const website = await generateQrSafely(websiteUrl);
        const linkedin = await generateQrSafely(linkedinUrl);
        const maps = await generateQrSafely(mapsUrl);

				setMainQr(main);

				setSocialQrs({
					instagram,
					facebook,
					whatsapp,
          website,
          linkedin,
					maps,
				});

			} catch (err) {
				console.error(err);
				setError(
					"Failed to generate QR poster."
				);

			} finally {
				setLoading(false);
			}
		};

		generateQrs();

	}, [open, listing]);

  // =========================================
  // BODY SCROLL LOCK
  // =========================================

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev;};

  }, [open]);

  // =========================================
  // CAPTURE HELPER
  // =========================================

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

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

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
      const canvas = await capturePoster();

      const link = document.createElement("a");
      link.download = `${listing.name
        .replace(/\s+/g, "-")
        .toLowerCase()}-poster.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

    } catch (err) {
      console.error(err);
    }
  };

  // =========================================
  // SHARE PNG
  // =========================================

  const handleShare = async () => {
    try {
      const canvas = await capturePoster();

      canvas.toBlob(async (blob) => {
        const file = new File([blob], "needmet-poster.png", {
          type: "image/png",
        });

        if (navigator.share) {
          await navigator.share({
            title: listing?.name,
            files: [file],
          });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "needmet-poster.png";
          a.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png");

    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return createPortal(

    <div className="qr-overlay" onClick={onClose}>
      <div
        className="qr-modal qr-business-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}
        <div className="qr-modal-header">
          <div className="qr-modal-title">
            <i className="fa-solid fa-qrcode"></i>
            <h2>Business QR Poster</h2>
          </div>

          <button
            className="qr-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* PREVIEW */}
        <div className="qr-preview-area">
          {loading && (
            <div className="qr-loading">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Generating poster...</span>
            </div>
          )}

          {error && (
            <div className="qr-error">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && mainQr && (
            <div className="qr-poster-preview-container">
							<div className="qr-poster-scale">
								<div id="needmet-business-poster">
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
        <div className="qr-modal-actions">
          <button
            className="qr-btn qr-btn-download"
            onClick={handleDownload}
            disabled={
              loading || !!error
            }
          >
            <i className="fa-solid fa-download"></i>
            Download
          </button>

          <button
            className="qr-btn qr-btn-share"
            onClick={handleShare}
            disabled={
              loading || !!error
            }
          >

            <i className="fa-solid fa-share-nodes"></i>
            Share
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}