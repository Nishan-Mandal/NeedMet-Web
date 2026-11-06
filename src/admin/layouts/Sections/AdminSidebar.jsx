import { NavLink, useLocation } from "react-router-dom";
import companyLogo from "../../../assets/companyLogo.png";
import { navTree } from "../../constants/navigation";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export default function AdminSidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  openGroups,
  toggleGroup,
  setOpenGroups,
}) {
  const location = useLocation();

  // Helper to determine if a route is currently active
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
    <aside
      className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-slate-200 shadow-xs transition-all duration-200 ease-in-out select-none ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
      aria-label="Admin Navigation Sidebar"
    >
      {/* ── Brand & App Header ── */}
      <div
        className={`h-16 shrink-0 flex items-center border-b border-slate-200 bg-white transition-all duration-200 ${
          sidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        {!sidebarCollapsed ? (
          <>
            <a
              href="/"
              className="flex items-center gap-2.5 min-w-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c3e]/30 rounded-xl p-1"
              title="Return to NeedMet Host Application"
            >
              <img
                src={companyLogo}
                alt="NeedMet"
                className="w-8 h-8 rounded-xl shadow-xs object-cover shrink-0 group-hover:scale-105 transition-transform duration-200"
              />
              <div className="flex items-center gap-2 truncate">
                <span className="font-heading font-extrabold tracking-tight text-[#0f5c3e] text-lg">
                  NeedMet
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e8f5ee] text-[#0f5c3e] border border-[#d1fae5]">
                  Admin
                </span>
              </div>
            </a>

            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-[#0f5c3e] hover:bg-[#e8f5ee] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c3e]/30"
              title="Collapse sidebar to icons"
              aria-label="Collapse sidebar to icon-only mode"
            >
              <ChevronLeft size={18} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-[#0f5c3e] hover:bg-[#e8f5ee] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c3e]/30"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>


      {/* ── Tree Navigation Container ── */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1.5 scrollbar-thin"
        role="tree"
        aria-label="Administration sections"
      >
        {navTree.map((item) => {
          // ── Case 1: Standalone Root Link (Dashboard, Orders & Transactions) ──
          if (item.type === "link") {
            const Icon = item.icon;
            const active = isRouteActive(item.to);

            // Collapsed (Icon-Only) View
            if (sidebarCollapsed) {
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  role="treeitem"
                  aria-selected={active}
                  className={`w-full flex items-center justify-center py-2.5 my-1 rounded-xl transition-all duration-200 group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c3e]/40 ${
                    active
                      ? "bg-[#e8f5ee] text-[#0f5c3e] font-bold border-l-4 border-[#0f5c3e] rounded-l-none shadow-xs"
                      : "text-slate-500 hover:text-[#0f5c3e] hover:bg-[#f2f9f5]"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 transition-colors duration-200 ${
                      active ? "text-[#0f5c3e]" : "text-slate-400 group-hover:text-[#0f5c3e]"
                    }`}
                  />
                  {active && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0f5c3e] ring-2 ring-white" />
                  )}
                </NavLink>
              );
            }

            // Expanded Full Row View
            return (
              <NavLink
                key={item.to}
                to={item.to}
                role="treeitem"
                aria-selected={active}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c3e]/40 ${
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

                {active ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0f5c3e] ring-2 ring-[#0f5c3e]/20 shrink-0" />
                ) : (
                  <ChevronRight
                    size={13}
                    className="text-slate-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0"
                  />
                )}
              </NavLink>
            );
          }

          // ── Case 2: Expandable Parent Group (Manage Listing, Offers & Plans, etc.) ──
          const GroupIcon = item.icon;
          const isGroupOpen = !!openGroups[item.id];
          const hasActiveChild = item.children?.some((child) => isRouteActive(child.to));

          // Collapsed (Icon-Only) View
          if (sidebarCollapsed) {
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSidebarCollapsed(false);
                  setOpenGroups((prev) => ({ ...prev, [item.id]: true }));
                }}
                title={`${item.label} (${item.children.map((c) => c.label).join(", ")})`}
                role="treeitem"
                aria-expanded={isGroupOpen}
                className={`w-full flex items-center justify-center py-2.5 my-1 rounded-xl transition-all duration-200 relative group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c3e]/40 ${
                  hasActiveChild
                    ? "bg-[#e8f5ee] text-[#0f5c3e] font-bold border-l-4 border-[#0f5c3e] rounded-l-none shadow-xs"
                    : "text-slate-500 hover:text-[#0f5c3e] hover:bg-[#f2f9f5]"
                }`}
              >
                <GroupIcon
                  size={20}
                  className={`shrink-0 transition-colors duration-200 ${
                    hasActiveChild ? "text-[#0f5c3e]" : "text-slate-400 group-hover:text-[#0f5c3e]"
                  }`}
                />
                {hasActiveChild && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0f5c3e] ring-2 ring-white" />
                )}
              </button>
            );
          }

          // Expanded Tree Parent & Children View
          return (
            <div key={item.id} className="pt-0.5" role="treeitem" aria-expanded={isGroupOpen}>
              {/* Parent Node Row Button */}
              <button
                type="button"
                onClick={() => toggleGroup(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c3e]/40 ${
                  hasActiveChild
                    ? "text-slate-900 font-semibold bg-slate-50/90 hover:bg-[#f2f9f5]"
                    : isGroupOpen
                    ? "text-slate-800 font-medium bg-slate-50/60 hover:bg-[#f2f9f5]"
                    : "text-slate-600 font-medium hover:text-[#0f5c3e] hover:bg-[#f2f9f5]"
                }`}
                aria-expanded={isGroupOpen}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <GroupIcon
                    size={18}
                    className={`shrink-0 transition-colors duration-200 ${
                      hasActiveChild
                        ? "text-[#0f5c3e]"
                        : "text-slate-400 group-hover:text-[#0f5c3e]"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {hasActiveChild && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#0f5c3e]/80"
                      title="Active child page inside"
                    />
                  )}
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 group-hover:text-[#0f5c3e] transition-transform duration-200 ease-in-out transform ${
                      isGroupOpen ? "rotate-0 text-slate-600" : "-rotate-90"
                    }`}
                  />
                </div>
              </button>

              {/* Nested Children with Continuous Tree Stem & Node Indicators */}
              <div
                className={`grid transition-all duration-200 ease-in-out ${
                  isGroupOpen ? "grid-rows-[1fr] opacity-100 mt-0.5" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="relative ml-5 pl-3.5 my-1 space-y-1">
                    {/* Vertical Connector Stem */}
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
                          className={`group/child relative flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c3e]/40 ${
                            isChildActive
                              ? "bg-[#e8f5ee] text-[#0f5c3e] font-semibold border border-[#d1fae5] border-l-[3px] border-l-[#0f5c3e] shadow-2xs"
                              : "text-slate-600 font-medium hover:text-[#0f5c3e] hover:bg-[#f2f9f5] border border-transparent"
                          }`}
                        >
                          {/* Horizontal Tree Branch Connector Stem */}
                          <span
                            className={`absolute -left-[11px] top-1/2 -translate-y-1/2 w-2.5 h-px transition-colors duration-200 ${
                              isChildActive
                                ? "bg-[#0f5c3e]"
                                : "bg-slate-200 group-hover/child:bg-[#0f5c3e]/50"
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

                          {/* Active Marker Cue */}
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
    </aside>
  );
}
