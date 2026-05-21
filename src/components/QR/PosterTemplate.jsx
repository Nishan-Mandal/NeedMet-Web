import React from "react";
import "../../style/QR/PosterTemplate.css";
import bgImage   from "../../assets/poster-template.png";
import igIcon    from "../../assets/instagram.svg";
import fbIcon    from "../../assets/facebook.png";
import waIcon    from "../../assets/whatsapp.svg";
import webIcon   from "../../assets/website.svg";
import linkedinIcon  from "../../assets/linkedin.svg";
import mapsIcon  from "../../assets/maps.png";

const IcUser = () => (
  <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
    <path d="M12 12c2.65 0 4.8-2.15 4.8-4.8S14.65 2.4 12 2.4 7.2 4.55 7.2 7.2 9.35 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);
const IcPhone = () => (
  <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.27.2 2.5.57 3.65.1.33.02.7-.24.97L6.6 10.8z"/>
  </svg>
);
const IcLocation = () => (
  <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
  </svg>
);

export default function SriSaiPoster({listing = {}, qrImage, socialQrs = {}}) {
  return (
    <div className="sp-root">
      <img src={bgImage} alt="" className="sp-bg" draggable={false} />
      <div className="sp-overlay">
        <div className="sp-block sp-name">
          <div className="sp-name-main-row">
            <h1
              className={
                listing?.name?.length >= 30
                  ? "sp-name-h1-long"
                  : listing?.name?.length >= 19
                  ? "sp-name-h1-mid"
                  : "sp-name-h1"
              }
            >
              {listing?.name}
            </h1>
          </div>

          <div className="sp-name-sub-row">
            <h2 className="sp-name-h2">{listing.category}</h2>
          </div>
        </div>

        <div className="sp-block sp-main-qr">
          <img src={qrImage} alt="Scan to Review" className="sp-main-qr-img" />
        </div>

        <div className="sp-block sp-contact">
          <div className="sp-contact-cell">
            <div className="sp-contact-circle"><IcUser /></div>
            <div>
              <p className="sp-clabel">OWNER</p>
              <p 
                className={
                  listing?.ownerName?.length >= 30
                    ? "sp-cval-long"
                    : "sp-cval"
                }
              >
                {listing?.ownerName}
              </p>
            </div>
          </div>
          <div className="sp-contact-sep" />
          <div className="sp-contact-cell">
            <div className="sp-contact-circle"><IcPhone /></div>
            <div>
              <p className="sp-clabel">PHONE</p>
              <p className="sp-cval">+91 {listing.phone || listing.alternatePhone}</p>
            </div>
          </div>
          <div className="sp-contact-sep" />
          <div className="sp-contact-cell">
            <div className="sp-contact-circle"><IcLocation /></div>
            <div>
              <p className="sp-clabel">LOCATION</p>
              <p 
                className={
                  listing?.address?.length >= 50
                    ? "sp-cval-long-long"
                    : listing?.address?.length >= 30
                    ? "sp-cval-long"
                    : "sp-cval"
                }
              >
                {listing?.address}
              </p>
            </div>
          </div>
        </div>

        <div className="sp-social">
          <div className="sp-social-container">
            <p>FOLLOW US ON SOCIAL MEDIA</p>
          </div>
          <div className="sp-block">
            {socialQrs.instagram && (
              <div className="sp-social-item">
                <img
                  src={igIcon}
                  alt="Instagram"
                  className="sp-social-icon"
                />
                <img
                  src={socialQrs.instagram}
                  alt="Instagram QR"
                  className="sp-social-qr"
                />
              </div>
            )}

            {socialQrs.facebook && (
              <div className="sp-social-item">
                <img
                  src={fbIcon}
                  alt="Facebook"
                  className="sp-social-icon"
                />
                <img
                  src={socialQrs.facebook}
                  alt="Facebook QR"
                  className="sp-social-qr"
                />
              </div>
            )}

            {socialQrs.whatsapp && (
              <div className="sp-social-item">
                <img
                  src={waIcon}
                  alt="WhatsApp"
                  className="sp-social-icon"
                />
                <img
                  src={socialQrs.whatsapp}
                  alt="WhatsApp QR"
                  className="sp-social-qr"
                />
              </div>
            )}

            {socialQrs.website && (
              <div className="sp-social-item">
                <img
                  src={webIcon}
                  alt="Website"
                  className="sp-social-icon"
                />
                <img
                  src={socialQrs.website}
                  alt="Website QR"
                  className="sp-social-qr"
                />
              </div>
            )}

            {socialQrs.linkedin && (
              <div className="sp-social-item">
                <img
                  src={linkedinIcon}
                  alt="LinkedIn"
                  className="sp-social-icon"
                />
                <img
                  src={socialQrs.linkedin}
                  alt="LinkedIn QR"
                  className="sp-social-qr"
                />
              </div>
            )}

            {socialQrs.maps && (
              <div className="sp-social-item">
                <img
                  src={mapsIcon}
                  alt="Maps"
                  className="sp-social-icon"
                />
                <img
                  src={socialQrs.maps}
                  alt="Maps QR"
                  className="sp-social-qr"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}