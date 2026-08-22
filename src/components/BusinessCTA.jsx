import "../style/BusinessCTA.css";
import { useNavigate } from "react-router-dom";

export default function BusinessCTA() {
    const goToAddListing = () => {
        navigate("/contribute/listing");
    };
  
    const navigate = useNavigate();
    const goToContact = () => {
        navigate("/docs/contact_us");
    };

  return (
    <section className="business-cta-section">

      <div className="business-cta-container">

        {/* Grid Background */}
        <div className="business-cta-grid" />

        {/* Background Glow */}
        <div className="business-cta-glow" />

        {/* Content */}
        <div className="business-cta-content">

          <div className="business-cta-left">

            <h2 className="business-cta-title font-heading">
              List Your Business on NeedMet
            </h2>

            <p className="business-cta-description font-primary">
              Join 1,000+ businesses already on the platform.
              Reach thousands of local customers for free — no
              tech skills needed, get listed in minutes.
            </p>

          </div>

          <div className="business-cta-right">

            <button onClick={goToAddListing} className="business-cta-primary-btn">
              Add Your Business
            </button>

            <button onClick={goToContact} className="business-cta-secondary-btn">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}