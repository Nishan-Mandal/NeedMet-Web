import React from "react";
import bgImage from "../../assets/poster-template.png";
import igIcon from "../../assets/instagram.svg";
import fbIcon from "../../assets/facebook.png";
import waIcon from "../../assets/whatsapp.svg";
import webIcon from "../../assets/website.svg";
import linkedinIcon from "../../assets/linkedin.svg";
import mapsIcon from "../../assets/maps.png";

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
  const nameH1Class =
    listing?.name?.length >= 30
      ? "text-[60px] font-black text-[#1a5c2e] tracking-tight leading-none text-center mb-6"
      : listing?.name?.length >= 19
      ? "text-[80px] font-black text-[#1a5c2e] tracking-tight leading-none text-center mb-6"
      : "text-[100px] font-black text-[#1a5c2e] tracking-tight leading-none text-center mb-6";

  const ownerClass =
    listing?.ownerName?.length >= 30
      ? "text-[1.2rem] font-bold text-[#111]"
      : "text-[1.5rem] font-bold text-[#111]";

  const addressClass =
    listing?.address?.length >= 50
      ? "text-[1rem] font-bold text-[#111]"
      : listing?.address?.length >= 30
      ? "text-[1.2rem] font-bold text-[#111]"
      : "text-[1.5rem] font-bold text-[#111]";

  return (
    <div className="relative w-[1240px] max-w-full bg-white inline-block font-sans">
      <img src={bgImage} alt="" className="block w-full h-auto select-none pointer-events-none" draggable={false} />
      <div className="absolute inset-0">
        <div className="absolute top-[14%] left-1/2 -translate-x-1/2 w-[88%] flex flex-col items-center gap-[3px]">
          <div className="flex items-center gap-3.5">
            <h1 className={nameH1Class}>
              {listing?.name}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <h2 className="font-extrabold text-[clamp(16px,2.9vw,26px)] text-[#1a5c2e] tracking-[3px] uppercase border-y-[2.5px] border-[#1a5c2e] px-8 py-1 whitespace-nowrap mb-4">
              {listing.category}
            </h2>
          </div>
        </div>

        <div className="absolute top-[52.5%] left-[49.7%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <img src={qrImage} alt="Scan to Review" className="w-[clamp(160px,70%,300px)] h-[clamp(160px,70%,300px)] object-contain rounded-[10px]" />
        </div>

        <div className="absolute top-[64%] left-[7.3%] w-[85%] flex items-stretch bg-[#e8f5eeaa] border-[1.5px] border-[#ddd] rounded-[13px] overflow-hidden py-3">
          <div className="flex items-start gap-3 flex-1 px-4">
            <div className="w-[55px] h-[55px] rounded-full bg-[#1a5c2e] flex items-center justify-center shrink-0">
              <IcUser />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[1.6rem] font-bold text-[#888] tracking-wider uppercase mb-[3px]">OWNER</p>
              <p className={ownerClass}>{listing?.ownerName}</p>
            </div>
          </div>

          <div className="w-[1.5px] self-stretch bg-[#ddd] shrink" />

          <div className="flex items-start gap-3 flex-1 px-4">
            <div className="w-[55px] h-[55px] rounded-full bg-[#1a5c2e] flex items-center justify-center shrink-0">
              <IcPhone />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[1.6rem] font-bold text-[#888] tracking-wider uppercase mb-[3px]">PHONE</p>
              <p className="text-[1.5rem] font-bold text-[#111]">+91 {listing.phone || listing.alternatePhone}</p>
            </div>
          </div>

          <div className="w-[1.5px] self-stretch bg-[#ddd] shrink" />

          <div className="flex items-start gap-3 flex-1 px-4">
            <div className="w-[55px] h-[55px] rounded-full bg-[#1a5c2e] flex items-center justify-center shrink-0">
              <IcLocation />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[1.6rem] font-bold text-[#888] tracking-wider uppercase mb-[3px]">LOCATION</p>
              <p className={addressClass}>{listing?.address}</p>
            </div>
          </div>
        </div>

        <div className="absolute top-[72.2%] left-[3.8%] w-[92.4%] flex flex-col items-center">
          <div className="w-full text-center text-[clamp(12px,1.6vw,16px)] font-extrabold tracking-wider text-[#1a5c2e] mb-3">
            <p className="text-[2rem] border-t-[2.5px] border-[#1a5c2e54] inline pt-1">FOLLOW US ON SOCIAL MEDIA</p>
          </div>

          <div className="relative w-full flex justify-center items-start gap-20">
            {socialQrs.instagram && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={igIcon}
                  alt="Instagram"
                  className="w-[30px] h-[30px] object-contain"
                />
                <img
                  src={socialQrs.instagram}
                  alt="Instagram QR"
                  className="w-[110px] h-[110px] object-contain rounded-lg border-[1.5px] border-[#e5e5e5] bg-white p-1"
                />
              </div>
            )}

            {socialQrs.facebook && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={fbIcon}
                  alt="Facebook"
                  className="w-[30px] h-[30px] object-contain"
                />
                <img
                  src={socialQrs.facebook}
                  alt="Facebook QR"
                  className="w-[110px] h-[110px] object-contain rounded-lg border-[1.5px] border-[#e5e5e5] bg-white p-1"
                />
              </div>
            )}

            {socialQrs.whatsapp && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={waIcon}
                  alt="WhatsApp"
                  className="w-[30px] h-[30px] object-contain"
                />
                <img
                  src={socialQrs.whatsapp}
                  alt="WhatsApp QR"
                  className="w-[110px] h-[110px] object-contain rounded-lg border-[1.5px] border-[#e5e5e5] bg-white p-1"
                />
              </div>
            )}

            {socialQrs.website && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={webIcon}
                  alt="Website"
                  className="w-[30px] h-[30px] object-contain"
                />
                <img
                  src={socialQrs.website}
                  alt="Website QR"
                  className="w-[110px] h-[110px] object-contain rounded-lg border-[1.5px] border-[#e5e5e5] bg-white p-1"
                />
              </div>
            )}

            {socialQrs.linkedin && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={linkedinIcon}
                  alt="LinkedIn"
                  className="w-[30px] h-[30px] object-contain"
                />
                <img
                  src={socialQrs.linkedin}
                  alt="LinkedIn QR"
                  className="w-[110px] h-[110px] object-contain rounded-lg border-[1.5px] border-[#e5e5e5] bg-white p-1"
                />
              </div>
            )}

            {socialQrs.maps && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={mapsIcon}
                  alt="Maps"
                  className="w-[30px] h-[30px] object-contain"
                />
                <img
                  src={socialQrs.maps}
                  alt="Maps QR"
                  className="w-[110px] h-[110px] object-contain rounded-lg border-[1.5px] border-[#e5e5e5] bg-white p-1"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}