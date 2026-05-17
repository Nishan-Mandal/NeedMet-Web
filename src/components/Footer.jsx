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
            <a href="/privacy_policy">Privacy</a>
            <a href="/safety">Safety</a>
            <a href="/terms_service">Terms</a>
            <a href="/community_guidelines">Guidelines</a>
          </div>

        </div>

      </div>
    </footer>
  );
}