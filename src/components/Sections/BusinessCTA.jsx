import { useNavigate } from "react-router-dom";

export default function BusinessCTA({ className = "", bgColor = "" }) {
  const navigate = useNavigate();

  const goToAddListing = () => {
    navigate("/contribute/listing");
  };

  const goToContact = () => {
    navigate("/docs/contact_us");
  };

  return (
    <section
      className={`font-primary py-[20px] pb-[45px] max-[576px]:pt-[10px] max-[576px]:pb-[35px] px-[18px] sm:px-8 lg:px-[70px] ${className}`}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <div className="relative overflow-hidden isolate bg-gradient-to-br from-primary to-primary-light rounded-[28px] p-[56px_35px] max-[992px]:rounded-3xl max-[992px]:p-[42px_18px] max-[576px]:rounded-[22px] max-[576px]:p-[32px_14px]">

        {/* Grid Background */}
        <div 
          className="business-cta-grid absolute inset-0 pointer-events-none z-0" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '34px 34px'
          }}
          aria-hidden="true"
        />

        {/* Background Glow */}
        <div 
          className="business-cta-glow absolute w-[380px] h-[380px] -right-[120px] -top-[120px] rounded-full pointer-events-none z-[1]" 
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)'
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="business-cta-content relative z-[2] flex flex-row items-center justify-between gap-10 max-[992px]:flex-col max-[992px]:items-start max-[992px]:gap-8 max-[576px]:gap-7">

          <div className="business-cta-left max-w-[520px]">
            <h2 className="business-cta-title m-0 mb-[18px] text-text-on-dark font-heading font-bold tracking-[-0.05em] text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] max-[992px]:text-[clamp(2rem,6vw,3rem)] max-[576px]:text-[2rem] max-[576px]:leading-[1.05] max-[576px]:mb-4">
              List Your Business on NeedMet
            </h2>

            <p className="business-cta-description m-0 font-primary text-text-light max-w-[500px] text-[17px] leading-[1.7] max-[992px]:text-[15px] max-[576px]:text-[14px] max-[576px]:leading-[1.65]">
              Join 1,000+ businesses already on the platform.
              Reach thousands of local customers for free — no
              tech skills needed, get listed in minutes.
            </p>
          </div>

          <div className="business-cta-right flex flex-row items-center gap-3.5 max-[576px]:flex-col max-[576px]:w-full max-[576px]:items-stretch max-[576px]:gap-3">
            <button 
              onClick={goToAddListing} 
              className="business-cta-primary-btn relative inline-flex items-center justify-center font-primary font-bold rounded-full cursor-pointer transition-all duration-200 ease-out bg-surface text-text-accent shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.18)] h-[54px] px-7 text-[15px] max-[576px]:h-[50px] max-[576px]:w-full max-[576px]:text-[14px]"
            >
              Add Your Business
            </button>

            <button 
              onClick={goToContact} 
              className="business-cta-secondary-btn inline-flex items-center justify-center font-primary font-bold rounded-full cursor-pointer transition-all duration-200 ease-out bg-white/[0.08] text-text-on-dark border border-white/20 backdrop-blur-[6px] hover:bg-white/[0.14] hover:-translate-y-0.5 h-[54px] px-7 text-[15px] max-[576px]:h-[50px] max-[576px]:w-full max-[576px]:text-[14px]"
            >
              Contact Us
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
