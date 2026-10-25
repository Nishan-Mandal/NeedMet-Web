import { NavLink, useNavigate, useLocation } from "react-router-dom";
import companyLogo from '../../assets/companyLogo.png';
import play_store from '../../assets/play_store.png';
import play_store_icon from '../../assets/play_store_icon.png';
import { useAuth } from "../../contexts/authContext.jsx";
import Button from "../Common/Button.jsx";
import { useState, useEffect } from "react";
import { useToast } from "../../contexts/toastContext.jsx";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const { userLoggedIn, userData, logout } = useAuth();

  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const isHomePage = location.pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      // Scrolling very little (> 20px) turns navbar white
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  const isTransparent = isHomePage && !isScrolled;

  const handleLogout = async () => {
    try {
      await logout();
      setShowMenu(false);
      showToast("Logged out successfully", "regular");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* ── Desktop HEADER ── */}
      <header
        className={`sticky top-0 z-[9999] h-[68px] hidden md:flex items-center px-8 lg:px-[70px] transition-all duration-300 ease-in-out ${
          isHomePage ? "md:-mb-[68px]" : ""
        } ${
          isTransparent
            ? "bg-white/0 backdrop-blur-none border-b border-border/0 shadow-transparent"
            : "bg-white/95 backdrop-blur-md border-b border-border shadow-[0_1px_0_var(--color-border),0_4px_16px_rgba(15,92,62,0.06)]"
        }`}
      >
        <div className="w-full h-full flex items-center justify-between gap-4">

          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
              <img src={companyLogo} alt="NeedMet logo" className="w-9 h-9 rounded-[10px] shadow-[0_2px_8px_rgba(15,92,62,0.18)]" />
              <span className={`font-heading font-bold text-[1.35rem] tracking-[-0.02em] transition-colors duration-300 ease-in-out ${
                isTransparent ? "text-white" : "text-primary"
              }`}>
                NeedMet
              </span>
            </div>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link font-primary font-medium text-[0.9rem] flex items-center py-[7px] px-3.5 rounded-lg relative transition-all duration-300 ease-in-out ${
                    isTransparent
                      ? (isActive
                          ? 'text-white bg-white/15 font-semibold backdrop-blur-xs'
                          : 'text-white/80 hover:text-white hover:bg-white/10')
                      : (isActive
                          ? 'text-primary bg-primary-surface font-semibold'
                          : 'text-text-secondary hover:text-primary hover:bg-primary-surface')
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/all_categories"
                className={({ isActive }) =>
                  `nav-link font-primary font-medium text-[0.9rem] flex items-center py-[7px] px-3.5 rounded-lg relative transition-all duration-300 ease-in-out ${
                    isTransparent
                      ? (isActive
                          ? 'text-white bg-white/15 font-semibold backdrop-blur-xs'
                          : 'text-white/80 hover:text-white hover:bg-white/10')
                      : (isActive
                          ? 'text-primary bg-primary-surface font-semibold'
                          : 'text-text-secondary hover:text-primary hover:bg-primary-surface')
                  }`
                }
              >
                Categories
              </NavLink>
              <NavLink
                to="/articles"
                className={({ isActive }) =>
                  `nav-link font-primary font-medium text-[0.9rem] flex items-center py-[7px] px-3.5 rounded-lg relative transition-all duration-300 ease-in-out ${
                    isTransparent
                      ? (isActive
                          ? 'text-white bg-white/15 font-semibold backdrop-blur-xs'
                          : 'text-white/80 hover:text-white hover:bg-white/10')
                      : (isActive
                          ? 'text-primary bg-primary-surface font-semibold'
                          : 'text-text-secondary hover:text-primary hover:bg-primary-surface')
                  }`
                }
              >
                Blogs
              </NavLink>
              <NavLink
                to="/contribute/listing"
                className={({ isActive }) =>
                  `nav-link font-primary font-medium text-[0.9rem] flex items-center py-[7px] px-3.5 rounded-lg relative transition-all duration-300 ease-in-out ${
                    isTransparent
                      ? (isActive
                          ? 'text-white bg-white/15 font-semibold backdrop-blur-xs'
                          : 'text-white/80 hover:text-white hover:bg-white/10')
                      : (isActive
                          ? 'text-primary bg-primary-surface font-semibold'
                          : 'text-text-secondary hover:text-primary hover:bg-primary-surface')
                  }`
                }
              >
                Add Business
              </NavLink>
              {userLoggedIn && userData?.role === "admin" && (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `nav-link font-primary font-medium text-[0.9rem] flex items-center py-[7px] px-3.5 rounded-lg relative transition-all duration-300 ease-in-out ${
                      isTransparent
                        ? (isActive
                            ? 'text-white bg-white/15 font-semibold backdrop-blur-xs'
                            : 'text-white/80 hover:text-white hover:bg-white/10')
                        : (isActive
                            ? 'text-primary bg-primary-surface font-semibold'
                            : 'text-text-secondary hover:text-primary hover:bg-primary-surface')
                    }`
                  }
                >
                  DashBoard
                </NavLink>
              )}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center justify-center gap-[0.7rem]">
            {!isSearchPage && (
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `flex items-center justify-center w-[38px] h-[38px] rounded-[10px] text-[1.15rem] transition-all duration-300 ease-in-out ${
                    isTransparent
                      ? (isActive ? 'bg-white/20 text-white' : 'text-white/85 hover:text-white hover:bg-white/10')
                      : (isActive ? 'bg-primary-surface text-primary' : 'text-primary hover:bg-primary-surface')
                  }`
                }
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </NavLink>
            )}

            <button
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-base cursor-pointer transition-all duration-300 ease-in-out active:scale-110 shadow-sm mr-1.5 ${
                isTransparent
                  ? 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                  : 'bg-gradient-to-br from-primary to-primary-light text-text-on-dark'
              }`}
              onClick={() => setShowMenu(prev => !prev)}
              aria-label="User Profile"
            >
              {userLoggedIn ?
                userData?.name?.charAt(0)?.toUpperCase() || "U" :
                <i className="fa-solid fa-user text-sm"></i>
              }
            </button>

            <a
              className={`hidden lg:flex items-center rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:opacity-90 hover:-translate-y-0.5 ${
                isTransparent ? 'ring-1 ring-white/25' : ''
              }`}
              href="https://play.google.com/store/apps/details?id=com.findon.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={play_store} alt="Get it on Play Store" className="h-9" />
            </a>
          </div>

        </div>
      </header>

      {/* ── MOBILE TOP HEADER ── */}
      {!isSearchPage && (
        <header
          className={`md:hidden flex justify-between items-center h-[58px] sticky top-0 z-[9999] px-[18px] sm:px-8 transition-all duration-300 ease-in-out ${
            isHomePage ? "-mb-[58px]" : ""
          } ${
            isTransparent
              ? "bg-white/0 backdrop-blur-none border-b border-border/0 shadow-transparent"
              : "bg-white/95 backdrop-blur-md border-b border-border shadow-[0_1px_0_var(--color-border)]"
          }`}
        >
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src={companyLogo} alt="NeedMet logo" className="w-8 h-8 rounded-[9px] shadow-[0_2px_6px_rgba(15,92,62,0.15)]" />
            <span className={`font-heading font-bold text-[1.2rem] tracking-[-0.02em] transition-colors duration-300 ease-in-out ${
              isTransparent ? "text-white" : "text-primary"
            }`}>
              NeedMet
            </span>
          </div>

          <div className="flex items-center gap-[0.7rem]">
            <a
              href="https://play.google.com/store/apps/details?id=com.findon.app"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center p-1 rounded-lg transition-all duration-300 ease-in-out ${
                isTransparent ? "bg-white/15 border border-white/20" : ""
              }`}
              aria-label="Get it on Play Store"
            >
              <img src={play_store_icon} alt="Play Store" className="h-5 w-5 object-contain" />
            </a>
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-300 ease-in-out active:scale-110 shadow-sm ${
                isTransparent
                  ? "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                  : "bg-gradient-to-br from-primary to-primary-light text-text-on-dark"
              }`}
              onClick={() => setShowMenu(prev => !prev)}
              aria-label="User Profile"
            >
              {userLoggedIn ?
                userData?.name?.charAt(0)?.toUpperCase() || "U" :
                <i className="fa-solid fa-user text-xs"></i>
              }
            </button>
          </div>
        </header>
      )}

      {/* Profile / Side menu */}
      <div className={`fixed top-0 right-0 w-[290px] h-[100dvh] bg-surface z-[99999] border-l border-border shadow-[-8px_0_32px_rgba(15,92,62,0.12)] flex flex-col overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="flex items-center justify-between p-5 pb-4 border-b border-border shrink-0">
          <span className="font-bold text-[1.1rem] text-primary tracking-[-0.02em]">Menu</span>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[0.95rem] text-text-secondary hover:bg-red-50 hover:text-red-500 cursor-pointer transition-colors"
            onClick={() => setShowMenu(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">

          <div className="mx-2 my-1 p-3 bg-primary-surface rounded-[10px] border border-primary/10 flex items-center gap-2.5">
            <span className="w-[46px] h-[46px] shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-light text-text-on-dark flex items-center justify-center font-bold text-lg">
              {userData?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
            <div className="overflow-hidden">
              <h4 className="text-[0.9rem] font-semibold text-primary truncate m-0">{userData?.name || "Guest User"}</h4>
              <p className="text-[0.78rem] text-text-secondary truncate m-0">{userData?.email || "guest@example.com"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-text-accent px-5 pt-5 pb-1 after:content-[''] after:flex-1 after:h-[1px] after:bg-border">Navigation</div>

          {userLoggedIn && (
            <button
              onClick={() => { navigate("/profile"); setShowMenu(false); }}
              className="w-[calc(100%-16px)] mx-2 my-0.5 flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[0.875rem] font-medium text-text-secondary hover:text-primary hover:bg-primary-surface transition-colors cursor-pointer text-left"
            >
              <i className="fa-solid fa-user w-4 text-center"></i>
              <span>Profile</span>
            </button>
          )}

          {userLoggedIn && userData?.role === "admin" && (
            <button
              onClick={() => { navigate("/admin/dashboard"); setShowMenu(false); }}
              className="w-[calc(100%-16px)] mx-2 my-0.5 flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[0.875rem] font-medium text-text-secondary hover:text-primary hover:bg-primary-surface transition-colors cursor-pointer text-left"
            >
              <i className="fa-solid fa-gauge w-4 text-center"></i>
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            onClick={() => { navigate("/contribute/listing"); setShowMenu(false); }}
            className="w-[calc(100%-16px)] mx-2 my-0.5 flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[0.875rem] font-medium text-text-secondary hover:text-primary hover:bg-primary-surface transition-colors cursor-pointer text-left"
          >
            <i className="fa-solid fa-plus w-4 text-center"></i>
            <span>Add Business</span>
          </button>
          <button
            onClick={() => { navigate("/articles"); setShowMenu(false); }}
            className="w-[calc(100%-16px)] mx-2 my-0.5 flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[0.875rem] font-medium text-text-secondary hover:text-primary hover:bg-primary-surface transition-colors cursor-pointer text-left"
          >
            <i className="fa-solid fa-newspaper w-4 text-center"></i>
            <span>Blogs</span>
          </button>
          <button
            onClick={() => { navigate("/docs/about_us"); setShowMenu(false); }}
            className="w-[calc(100%-16px)] mx-2 my-0.5 flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[0.875rem] font-medium text-text-secondary hover:text-primary hover:bg-primary-surface transition-colors cursor-pointer text-left"
          >
            <i className="fa-solid fa-circle-info w-4 text-center"></i>
            <span>About Us</span>
          </button>
          <button
            onClick={() => { navigate("/docs/contact_us"); setShowMenu(false); }}
            className="w-[calc(100%-16px)] mx-2 my-0.5 flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[0.875rem] font-medium text-text-secondary hover:text-primary hover:bg-primary-surface transition-colors cursor-pointer text-left"
          >
            <i className="fa-solid fa-envelope w-4 text-center"></i>
            <span>Contact Us</span>
          </button>
          <button
            onClick={() => { navigate("/docs/terms_service"); setShowMenu(false); }}
            className="w-[calc(100%-16px)] mx-2 my-0.5 flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[0.875rem] font-medium text-text-secondary hover:text-primary hover:bg-primary-surface transition-colors cursor-pointer text-left"
          >
            <i className="fa-solid fa-file-contract w-4 text-center"></i>
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => { navigate("/docs/privacy_policy"); setShowMenu(false); }}
            className="w-[calc(100%-16px)] mx-2 my-0.5 flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[0.875rem] font-medium text-text-secondary hover:text-primary hover:bg-primary-surface transition-colors cursor-pointer text-left"
          >
            <i className="fa-solid fa-shield-halved w-4 text-center"></i>
            <span>Privacy Policy</span>
          </button>
        </div>

        {/* Auth action – pinned to bottom */}
        {userLoggedIn ? (
          <button
            className="shrink-0 flex items-center justify-center gap-2 w-full p-3.5 pb-[max(14px,env(safe-area-inset-bottom))] border-t border-border bg-red-500/5 text-red-600 hover:bg-red-50 text-[0.875rem] font-medium cursor-pointer transition-colors"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-sm"></i>
            Logout
          </button>
        ) : (
          <div className="flex flex-col gap-2 p-3 border-t border-border">
            <Button variant="primary" onClick={() => { navigate("/login"); setShowMenu(false); }}>Log In</Button>
            <Button variant="outline" onClick={() => { navigate("/signup"); setShowMenu(false); }}>Sign Up</Button>
          </div>
        )}
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#0f5c3e]/20 backdrop-blur-[2px] z-[99998] transition-opacity duration-300 ${
          showMenu ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setShowMenu(false)}
      >
        {showMenu && (
          <button
            className="md:hidden absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 text-gray-500 shadow flex items-center justify-center text-sm cursor-pointer"
            onClick={() => setShowMenu(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden flex fixed bottom-0 left-0 w-full h-[68px] bg-surface border-t border-border shadow-[0_-4px_20px_rgba(15,92,62,0.08)] justify-around items-center z-[9999] pb-[env(safe-area-inset-bottom,0)]">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `w-14 flex flex-col items-center justify-center gap-[3px] font-primary text-[0.62rem] font-medium py-1.5 rounded-xl transition-colors ${
              isActive ? 'text-primary bg-primary-surface font-bold' : 'text-text-secondary'
            }`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M25 3L2 21h3v26h14V30h12v17h14V21h3L25 3z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/all_categories"
          className={({ isActive }) =>
            `w-14 flex flex-col items-center justify-center gap-[3px] font-primary text-[0.62rem] font-medium py-1.5 rounded-xl transition-colors ${
              isActive ? 'text-primary bg-primary-surface font-bold' : 'text-text-secondary'
            }`
          }
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span>Categories</span>
        </NavLink>

        {/* Search FAB */}
        <NavLink to="/search" className="-translate-y-3.5 group">
          <div className="w-[54px] h-[54px] rounded-2xl bg-primary flex items-center justify-center shadow-[0_4px_14px_rgba(15,92,62,0.35),0_1px_3px_rgba(15,92,62,0.2)] transition-all group-hover:bg-primary-light group-hover:scale-105">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </NavLink>

        <NavLink
          to="/docs/about_us"
          className={({ isActive }) =>
            `w-14 flex flex-col items-center justify-center gap-[3px] font-primary text-[0.62rem] font-medium py-1.5 rounded-xl transition-colors ${
              isActive ? 'text-primary bg-primary-surface font-bold' : 'text-text-secondary'
            }`
          }
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span>About</span>
        </NavLink>

        <NavLink
          to="/docs/contact_us"
          className={({ isActive }) =>
            `w-14 flex flex-col items-center justify-center gap-[3px] font-primary text-[0.62rem] font-medium py-1.5 rounded-xl transition-colors ${
              isActive ? 'text-primary bg-primary-surface font-bold' : 'text-text-secondary'
            }`
          }
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Contact</span>
        </NavLink>
      </nav>
    </>
  );
}
