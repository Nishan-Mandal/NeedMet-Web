import { NavLink, useNavigate } from "react-router-dom";
import '../style/Header.css'
import companyLogo from '../assets/companyLogo.png';
import play_store from '../assets/play_store.png';

export default function Header() {
  const navigate = useNavigate();

  return (
    <>
      <header className="header">
        <div className="header-inner">

          <div className="header-inner-left">
            <div className="logo" onClick={() => navigate('/')}>
              <img src={companyLogo} alt="NeedMet logo" />
              <span className="logo-name">NeedMet</span>
            </div>

            {/* SEARCH */}
          </div>

          <div className="header-inner-right">
            <NavLink to="/search" className="search-pill">
              <i className="fa-solid fa-magnifying-glass"></i>
            </NavLink>
            {/* NAV */}
            <nav className="nav">
              <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
              <NavLink to="/all_categories" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Categories</NavLink>
              <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>About Us</NavLink>
              <NavLink to="/contact" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Contact</NavLink>
            </nav>

            {/* PLAY STORE */}
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

        {/* PLAY STORE */}
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
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
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

        {/* CENTER FAB */}
        <NavLink to="/search" className="bnav-fab">
          <div className="bnav-fab-inner">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </NavLink>

        <NavLink to="/about" className={({ isActive }) => `bnav-item${isActive ? ' active' : ''}`}>
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