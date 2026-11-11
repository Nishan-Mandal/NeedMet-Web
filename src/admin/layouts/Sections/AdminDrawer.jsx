import { NavLink, useLocation, useNavigate } from "react-router-dom";
import companyLogo from "../../../assets/companyLogo.png";
import { navTree } from "../../constants/navigation";
import { useAuth } from "../../../contexts/authContext";
import { X, ChevronDown, ChevronRight, LogOut } from "lucide-react";

/**
 * Mobile Drawer Tree Navigation for NeedMet Admin
 * Matches the desktop tree structure, smooth chevron animation, and visual hierarchy.
 */
export default function AdminDrawer({
  mobileMenuOpen,
  setMobileMenuOpen,
  openGroups,
  toggleGroup,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  if (!mobileMenuOpen) return null;

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

  const isRouteActive = (to) => {
    if (to === "/admin/listings") {
      return (
        location.pathname === "/admin/listings" ||
        location.pathname === "/admin/all_listings"
      );
    }
    return location.pathname === to;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0f5c3e]/20 backdrop-blur-xs lg:hidden flex animate-in fade-in duration-200"
      onClick={() => setMobileMenuOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      <div
        className="w-72 max-w-[85%] bg-white border-r border-slate-200 h-full p-4 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <img
              src={companyLogo}
              alt="NeedMet"
              className="w-8 h-8 rounded-xl object-cover shadow-xs"
            />
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-[#0f5c3e] text-base">
                NeedMet
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e8f5ee] text-[#0f5c3e] border border-[#d1fae5]">
                Admin
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-slate-400 hover:text-[#0f5c3e] hover:bg-[#e8f5ee] rounded-xl transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c3e]/30"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tree Navigation */}
        <nav
          className="flex-1 space-y-1 overflow-y-auto scrollbar-thin py-1"
          role="tree"
          aria-label="Administration navigation tree"
        >
          {navTree.map((item) => {
            // Case 1: Standalone Root Link
            if (item.type === "link") {
              const Icon = item.icon;
              const active = isRouteActive(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  role="treeitem"
                  aria-selected={active}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c3e]/40 ${
                    active
                      ? "bg-[#e8f5ee] text-[#0f5c3e] font-semibold border-l-[3px] border-[#0f5c3e] shadow-xs"
                      : "text-slate-600 font-medium hover:text-[#0f5c3e] hover:bg-[#f2f9f5]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors duration-200 ${
                        active ? "text-[#0f5c3e]" : "text-slate-400 group-hover:text-[#0f5c3e]"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f5c3e] ring-2 ring-[#0f5c3e]/20 shrink-0" />
                  )}
                </NavLink>
              );
            }

            // Case 2: Expandable Parent Group
            const GroupIcon = item.icon;
            const isGroupOpen = !!openGroups[item.id];
            const hasActiveChild = item.children.some((child) =>
              isRouteActive(child.to)
            );

            return (
              <div key={item.id} className="pt-0.5" role="treeitem" aria-expanded={isGroupOpen}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c3e]/40 ${
                    hasActiveChild
                      ? "text-slate-900 font-semibold bg-slate-50/90"
                      : isGroupOpen
                      ? "text-slate-800 font-medium bg-slate-50/60"
                      : "text-slate-600 font-medium hover:text-[#0f5c3e] hover:bg-[#f2f9f5]"
                  }`}
                  aria-expanded={isGroupOpen}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GroupIcon
                      size={18}
                      className={`shrink-0 transition-colors duration-200 ${
                        hasActiveChild ? "text-[#0f5c3e]" : "text-slate-400 group-hover:text-[#0f5c3e]"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {hasActiveChild && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0f5c3e]/80" />
                    )}
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 group-hover:text-[#0f5c3e] transition-transform duration-200 ease-in-out transform ${
                        isGroupOpen ? "rotate-0 text-slate-600" : "-rotate-90"
                      }`}
                    />
                  </div>
                </button>

                {/* Animated Nested Tree Children */}
                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isGroupOpen ? "grid-rows-[1fr] opacity-100 mt-0.5" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="relative ml-5 pl-3.5 my-1 space-y-1">
                      {/* Vertical Tree Stem */}
                      <div
                        className="absolute left-[3px] top-1 bottom-2 w-px bg-slate-200 pointer-events-none"
                        aria-hidden="true"
                      />

                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = isRouteActive(child.to);

                        return (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            role="treeitem"
                            aria-selected={isChildActive}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`group/child relative flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c3e]/40 ${
                              isChildActive
                                ? "bg-[#e8f5ee] text-[#0f5c3e] font-semibold border border-[#d1fae5] border-l-[3px] border-l-[#0f5c3e] shadow-2xs"
                                : "text-slate-600 font-medium hover:text-[#0f5c3e] hover:bg-[#f2f9f5] border border-transparent"
                            }`}
                          >
                            {/* Horizontal Branch Tick */}
                            <span
                              className={`absolute -left-[11px] top-1/2 -translate-y-1/2 w-2.5 h-px transition-colors duration-200 ${
                                isChildActive ? "bg-[#0f5c3e]" : "bg-slate-200"
                              }`}
                              aria-hidden="true"
                            />

                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* Node Indicator Cue */}
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200 ${
                                  isChildActive
                                    ? "bg-[#0f5c3e] ring-2 ring-[#0f5c3e]/20 scale-110"
                                    : "bg-slate-300 group-hover/child:bg-[#0f5c3e]/70"
                                }`}
                                aria-hidden="true"
                              />
                              <ChildIcon
                                size={14}
                                className={`shrink-0 transition-colors duration-200 ${
                                  isChildActive
                                    ? "text-[#0f5c3e]"
                                    : "text-slate-400 group-hover/child:text-[#0f5c3e]"
                                }`}
                              />
                              <span className="truncate">{child.label}</span>
                            </div>

                            {isChildActive && (
                              <ChevronRight
                                size={12}
                                className="text-[#0f5c3e] shrink-0"
                                aria-hidden="true"
                              />
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Drawer Footer with Sign Out */}
        <div className="pt-3 border-t border-slate-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100/70 border border-red-100 text-sm font-semibold transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
