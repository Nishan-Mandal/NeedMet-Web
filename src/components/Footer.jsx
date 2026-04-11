import "../style/Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-quote">
        Shops & Services That Matter to You!
      </div>

      <div className="footer-container">

        {/* Column 1 */}
        <div className="footer-column">
          <h4>POPULAR LOCATIONS</h4>
          <ul>
            <li>Kolkata</li>
            <li>Mumbai</li>
            <li>Chennai</li>
            <li>Pune</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="footer-column">
          <h4>TRENDING LOCATIONS</h4>
          <ul>
            <li>Bhubaneswar</li>
            <li>Hyderabad</li>
            <li>Chandigarh</li>
            <li>Nashik</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <h4>ABOUT US</h4>
          <ul>
            <li>About NeedMet</li>
            <li>Careers</li>
            <li>Blog</li>
            <li>Help</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-column">
          <h4>FOLLOW US</h4>
          <div className="footer-social-icons">
            <i className="fa-brands fa-facebook-f"></i>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-youtube"></i>
            <i className="fa-brands fa-linkedin-in"></i>
          </div>

          <div className="store-buttons">
            <button className="store-btn"><i className="fa-brands fa-google-play"></i>Google Play</button>
            <button className="store-btn"><i className="fa-brands fa-apple"></i>App Store</button>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        © 2026 NeedMet. All rights reserved.
      </div>
    </footer>
  );
}