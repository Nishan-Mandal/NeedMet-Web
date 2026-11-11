import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { PAGE_META, DEFAULT_PAGE_META } from "../../constants/pageMeta";
import {
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
  LogOut,
} from "lucide-react";

export default function AdminNavbar({
  mobileMenuOpen,
  setMobileMenuOpen,
  sidebarCollapsed,
}) {
  const { currentUser, userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      if (logout) {
        await logout();
      }
      navigate("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const currentPage = PAGE_META[location.pathname] || DEFAULT_PAGE_META;
  const CurrentPageIcon = currentPage.icon;

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] px-4 sm:px-6 flex items-center justify-between shadow-xs transition-all duration-300 ease-in-out left-0 ${
        sidebarCollapsed ? "lg:left-20" : "lg:left-64"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Active Page Heading & Subtitle */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#e8f5ee] text-[#0f5c3e] border border-[#d1fae5] flex items-center justify-center shrink-0">
            <CurrentPageIcon size={19} />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-black font-heading text-slate-900 tracking-tight leading-tight truncate">
              {currentPage.title}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate leading-tight hidden md:block">
              {currentPage.description}
            </p>
          </div>
        </div>
      </div>

      {/* Security status and user profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1 text-xs text-slate-600 hover:text-[#0f5c3e] transition px-2.5 py-1 rounded-lg hover:bg-[#e8f5ee]/50 font-medium"
        >
          <span>Live Site</span>
          <ExternalLink size={12} />
        </a>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {userData?.fullName || userData?.name || currentUser?.phoneNumber || "Admin User"}
            </div>
            <div className="text-[10px] text-[#0f5c3e] font-semibold capitalize">
              {userData?.role || "superadmin"}
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
