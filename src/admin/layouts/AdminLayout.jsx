import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./Sections/AdminSidebar";
import AdminNavbar from "./Sections/AdminNavbar";
import AdminDrawer from "./Sections/AdminDrawer";

/**
 * Admin Root Layout Shell
 * Coordinates fixed full-height sidebar, fixed top navbar, responsive mobile drawer,
 * and isolated scrollable main work area.
 */
export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Tree expansion state - all groups collapsed by default
  const [openGroups, setOpenGroups] = useState({});

  // Ensure relevant group is opened only if user navigates to a child route
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/admin/listings") || path === "/admin/all_listings") {
      setOpenGroups((prev) => ({ ...prev, listings: true }));
    } else if (
      path.startsWith("/admin/coupons") ||
      path.startsWith("/admin/cash-codes") ||
      path.startsWith("/admin/plans")
    ) {
      setOpenGroups((prev) => ({ ...prev, offers: true }));
    } else if (
      path.startsWith("/admin/orders") ||
      path.startsWith("/admin/transactions")
    ) {
      setOpenGroups((prev) => ({ ...prev, ordersAndTransactions: true }));
    } else if (
      path.startsWith("/admin/banners") ||
      path.startsWith("/admin/home-banners") ||
      path.startsWith("/admin/posters")
    ) {
      setOpenGroups((prev) => ({ ...prev, promoBanner: true }));
    }
  }, [location.pathname]);

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f7faf8] text-[#111827] flex font-primary relative">
      {/* ── Fixed Desktop Sidebar ── */}
      <AdminSidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        openGroups={openGroups}
        toggleGroup={toggleGroup}
        setOpenGroups={setOpenGroups}
      />

      {/* ── Fixed Top Navbar ── */}
      <AdminNavbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* ── Mobile Navigation Drawer ── */}
      <AdminDrawer
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        openGroups={openGroups}
        toggleGroup={toggleGroup}
      />

      {/* ── Main Scrollable Work Area ── */}
      <div className="flex-1 flex overflow-hidden pt-16">
        <main
          className={`flex-1 w-full overflow-y-auto min-w-0 p-4  bg-[#f7faf8] transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
        >
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
