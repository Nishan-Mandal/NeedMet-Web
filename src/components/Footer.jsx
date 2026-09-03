import { Link } from "react-router-dom";
import "../style/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">

        <div className="footer-bottom">

          <p className="footer-copyright">
            © 2026 NeedMet. All rights reserved.
          </p>

          <div className="footer-socials">

          <a href="/" className="footer-social-btn">
            <i className="fa-brands fa-facebook-f"></i>
          </a>

          <a href="/" className="footer-social-btn">
            <i className="fa-brands fa-instagram"></i>
          </a>

          <a href="/" className="footer-social-btn">
            <i className="fa-brands fa-youtube"></i>
          </a>

          <a href="/" className="footer-social-btn">
            <i className="fa-brands fa-linkedin-in"></i>
          </a>

        </div>

          <div className="footer-bottom-links">
            <Link to="/docs/privacy_policy">Privacy</Link>
            <Link to="/docs/safety">Safety</Link>
            <Link to="/docs/terms_service">Terms</Link>
            <Link to="/docs/community_guidelines">Guidelines</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}