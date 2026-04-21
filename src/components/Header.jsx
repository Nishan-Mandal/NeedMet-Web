import { NavLink, useNavigate } from "react-router-dom";
import '../style/Header.css'
import companyLogo from '../assets/companyLogo.png';
import play_store from '../assets/play_store.png';

export default function Header() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Desktop HEADER ── */}
      <header className="header">
        <div className="header-inner">

          <div className="header-inner-left">
            <div className="logo" onClick={() => navigate('/')}>
              <img src={companyLogo} alt="NeedMet logo" />
              <span className="logo-name">NeedMet</span>
            </div>
          </div>

          <div className="header-inner-right">
            <NavLink to="/search" className={({ isActive }) => isActive ? "search-pill active" : "search-pill"}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </NavLink>

            <nav className="nav">
              <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
              <NavLink to="/all_categories" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Categories</NavLink>
              <NavLink to="/about_us" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>About Us</NavLink>
              <NavLink to="/contact" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Contact</NavLink>
            </nav>

            <a
              className="play-store-btn"
              href="https://play.google.com/store/apps/details?id=com.findon.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={play_store} alt="Get it on Play Store" />
            </a>
          </div>

        </div>
      </header>

      {/* ── MOBILE TOP HEADER ── */}
      <header className="mobile-header">
        <div className="mobile-logo" onClick={() => navigate('/')}>
          <img src={companyLogo} alt="logo" />
          <span>NeedMet</span>
        </div>

        <a
          className="play-store-btn"
          href="https://play.google.com/store/apps/details?id=com.findon.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={play_store} alt="Get it on Play Store" />
        </a>
        
      </header>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => `bnav-item${isActive ? ' active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M25 3L2 21h3v26h14V30h12v17h14V21h3L25 3z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Home</span>
        </NavLink>

        <NavLink to="/all_categories" className={({ isActive }) => `bnav-item${isActive ? ' active' : ''}`}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span>Categories</span>
        </NavLink>

        <NavLink to="/search" className="bnav-fab">
          <div className="bnav-fab-inner">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </NavLink>

        <NavLink to="/about_us" className={({ isActive }) => `bnav-item${isActive ? ' active' : ''}`}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span>About</span>
        </NavLink>

        <NavLink to="/contact" className={({ isActive }) => `bnav-item${isActive ? ' active' : ''}`}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Contact</span>
        </NavLink>
      </nav>
    </>
  );
}