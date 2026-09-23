import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NoDataImg from "../assets/no_data.png";

export default function SystemState({
  imageSrc,
  title = "No Listings",
  highlight = "Found",
  message = "Be the first to contribute by adding a store or service related to this category!",
  actionType,
  actionLabel = "+ Contribute Now",
  actionTo = "/",
}) {

  const navigate = useNavigate();
  
  const refreshPage = () => {
    navigate(0);
  }

  const handleNavigate = () => {
    navigate(actionTo);
  }

  const handleRedirect = () => {
    if (actionTo.startsWith("http")) {
      window.open(actionTo, "_blank", "noopener,noreferrer");
    } else {
      navigate(actionTo);
    }
  };

  let onclickHandle = refreshPage;

  if(actionType === "refresh") {
    onclickHandle = refreshPage;
  } else if(actionType === "navigate") {
    onclickHandle = handleNavigate;
  } else if(actionType === "redirect") {
    onclickHandle = handleRedirect;
  } else {
    navigate('/');
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-[60px] px-6 sm:px-12 md:px-24 lg:px-40 py-8 bg-white overflow-hidden text-center md:text-left">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(28,140,140,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(28,140,140,0.07)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none" />

      <div className="flex justify-center items-center relative z-10 shrink-0">
        <img src={imageSrc} alt="image" loading="lazy" className="max-w-[280px] sm:max-w-[350px] w-full h-auto object-contain" />
      </div>

      <div className="max-w-[400px] w-full relative z-10 flex flex-col items-center md:items-start">
        <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-[#0f3a3a] tracking-tight leading-tight mb-4">
          {title} <span className="bg-gradient-to-br from-[#1c8c8c] to-[#2dbab0] bg-clip-text text-transparent">{highlight}</span>
        </h1>

        <p className="text-base leading-relaxed text-[#5a7575] mb-8">{message}</p>

        <div className="flex justify-center md:justify-start w-full">
          <button onClick={onclickHandle} className="inline-flex items-center gap-2 py-3 px-[22px] text-sm font-semibold rounded-xl bg-[#1c8c8c] text-white shadow-[0_8px_20px_-4px_rgba(28,140,140,0.45)] hover:-translate-y-0.5 transition-all cursor-pointer border-none">
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function InlineNoListingsFound({ actionType='redirect', actionTo='https://play.google.com/store/apps/details?id=com.findon.app' }) {
  const navigate = useNavigate();
  
  const handleRedirect = () => {
    if (actionTo.startsWith("http")) {
      window.open(actionTo, "_blank", "noopener,noreferrer");
    } else {
      navigate('/');
    }
  };

  return (
    <div className="w-full min-h-[88px] flex flex-col sm:flex-row items-center gap-3.5 p-4 sm:px-5 sm:py-0 bg-[#e9fdfd]/35 border border-[#1c8c8c]/15 rounded-2xl animate-[fadeIn_0.3s_ease_both] text-center sm:text-left">
      <div className="shrink-0">
        <img src={NoDataImg} alt="no_data" loading="lazy" className="w-20 sm:w-[100px] h-auto object-contain" />
      </div>
 
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-bold text-[#1a2e27]">No Listings Found</span>
        <span className="text-xs text-[#6b8f82]">Be the first to contribute by adding a store or service related to this category!</span>
      </div>
 
      <button className="shrink-0 w-full sm:w-auto bg-[#1c8c8c] hover:bg-[#0b8f6e] text-white rounded-lg py-2.5 px-[18px] text-xs font-semibold cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(15,163,127,0.28)] active:scale-95 border-none" onClick={handleRedirect}>
        + Contribute Now
      </button>
    </div>
  );
}

export { InlineNoListingsFound };