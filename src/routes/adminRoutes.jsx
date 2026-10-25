import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/admin/Dashboard.jsx"));
const AllListings = lazy(() => import("../pages/admin/AllListings.jsx"));

export const adminRoutes = [
  {
    path: "admin/dashboard",
    element: <Dashboard />,
  },
  {
    path: "admin/all_listings",
    element: <AllListings />,
  },
];