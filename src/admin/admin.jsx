import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import { Loader } from "../components";

/**
 * Admin Application Shell
 *
 * Dedicated entry point for the entire administration portal,
 * treated as an individual application inside the main NeedMet host app.
 */
function Admin({ children }) {
  return (
    <AdminLayout>
      <Suspense fallback={<Loader message="Loading admin workspace..." />}>
        {children || <Outlet />}
      </Suspense>
    </AdminLayout>
  );
}

export default Admin;
export { Admin as AdminApp };
