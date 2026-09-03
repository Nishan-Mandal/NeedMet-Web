import { NavLink, useNavigate, useLocation } from "react-router-dom";
import '../style/Header.css'
import companyLogo from '../assets/companyLogo.png';
import play_store from '../assets/play_store.png';
import play_store_icon from '../assets/play_store_icon.png';
import { useAuth } from "../contexts/authContext.jsx";
import { Button } from "../components";
import { useState } from "react";
import { useToast } from "../contexts/toastContext.jsx";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const { userLoggedIn, userData, logout } = useAuth();

  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isSearchPage = location.pathname === '/search';

  const handleLogout = async () => {
    try {
      await logout();
      setShowMenu(false);
      showToast("Logged out successfully", "regular")
      navigate("/login");
      
    } catch (error) {
      console.error(error);
    }
  };

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

          <div className="header-inner-middle">
            <nav className="nav">
              <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
              <NavLink to="/all_categories" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Categories</NavLink>
              <NavLink to="/contribute/listing" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Add Business</NavLink>
              {
                userLoggedIn && userData?.role === "admin" && (
                  <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>DashBoard</NavLink>
                )
              }
            </nav>
          </div>

          <div className="header-inner-right">

            {
              !isHomePage && !isSearchPage && (
                <NavLink to="/search" className={({ isActive }) => isActive ? "search-pill active" : "search-pill"}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </NavLink>
              )
            }

            <div>
              <button
                className="profileButton profileButton-desktop"
                onClick={() =>
                  setShowMenu(prev => !prev)
                }
              >
                {
                  userLoggedIn ? 
                    userData?.name?.charAt(0)?.toUpperCase() || "U" :
                    <i className="fa-solid fa-user" style={{height: '9px', width: '7px', padding: '10px 6px',display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'}}></i>
                }
              </button>
            </div>

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

        <div className="mobile-header-right">
          <a
            className="play-store-btn"
            href="https://play.google.com/store/apps/details?id=com.findon.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={play_store_icon} alt="Get it on Play Store" />
          </a>

          <div>
            <button
              className="profileButton profileButton-desktop"
              onClick={() =>
                setShowMenu(prev => !prev)
              }
            >
              {
                userLoggedIn ? 
                  userData?.name?.charAt(0)?.toUpperCase() || "U" :
                  <i className="fa-solid fa-user" style={{height: '9px', width: '7px', padding: '10px 6px',display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'}}></i>
              }
            </button>
          </div>
        </div>
      </header>

        {/* sidebar component */}
        <>
          <div
            className={`menu-overlay ${showMenu ? "show" : ""}`}
            onClick={() => setShowMenu(false)}
          />

          <div className={`side-menu ${showMenu ? "open" : ""}`}>
            <div className="sidebar-content">
              <div className="side-menu-header"> 
                <span>Menu</span> 
                <button 
                  className="menu-close" 
                  onClick={() => setShowMenu(false)} 
                > 
                  <i className="fa-solid fa-xmark"></i> 
                </button> 
              </div>

              <div className="sidebar-section-title">
                Profile
              </div>

              {userLoggedIn ? ( 
                <div className="sidebar-section profile-section"> 
                  <div className="profileButton">
                    <i className="fa-solid fa-user" style={{height: '9px', width: '7px', padding: '10px 6px',display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'}}></i>
                  </div>
                  <div className="sidebar-user-info"> 
                    <h4>{userData?.name}</h4> 
                    <p>{userData?.phone}</p> 
                  </div> 
                </div> 
              ) : (
                <button
                  className="sidebar-login-btn"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/login");
                  }}
                >
                  Log In / Sign Up
                </button>
              )}

              {
                userLoggedIn && userData?.role === "admin" && (
                  <>
                    <div className="sidebar-section-title">
                      Admin
                    </div>

                    <NavLink to="/admin/dashboard" onClick={() => setShowMenu(false)}>
                      DashBoard
                    </NavLink>
                  </>
                )
              }

              <div className="sidebar-section-title">
                Navigation
              </div>

              <NavLink to="/" onClick={() => setShowMenu(false)}>
                Home
              </NavLink>

              <NavLink to="/all_categories" onClick={() => setShowMenu(false)}>
                Categories
              </NavLink>

              <NavLink to="/contribute/listing" onClick={() => setShowMenu(false)}>
                Add Business
              </NavLink>

              <NavLink to="/docs/about_us" onClick={() => setShowMenu(false)}>
                About Us
              </NavLink>

              <NavLink to="/docs/contact_us" onClick={() => setShowMenu(false)}>
                Contact Us
              </NavLink>


              <div className="sidebar-section-title">
                Terms & Conditions
              </div>

              <NavLink to="/docs/community_guidelines" onClick={() => setShowMenu(false)}>
                Community Guidelines
              </NavLink>

              <NavLink to="/docs/listing_policy" onClick={() => setShowMenu(false)}>
                Listing Policy
              </NavLink>

              <NavLink to="/docs/privacy_policy" onClick={() => setShowMenu(false)}>
                Privacy Policy
              </NavLink>

              <NavLink to="/docs/safety" onClick={() => setShowMenu(false)}>
                Safety
              </NavLink>

              <NavLink to="/docs/terms_service" onClick={() => setShowMenu(false)}>
                Terms of Service
              </NavLink>

            </div>

            {userLoggedIn && (
              <button
                className="sidebar-logout-btn"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </button>
            )}

          </div>
        </>

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
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </NavLink>

        <NavLink to="/docs/about_us" className={({ isActive }) => `bnav-item${isActive ? ' active' : ''}`}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span>About</span>
        </NavLink>

        <NavLink to="/docs/contact_us" className={({ isActive }) => `bnav-item${isActive ? ' active' : ''}`}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Contact</span>
        </NavLink>
      </nav>
    </>
  );
}