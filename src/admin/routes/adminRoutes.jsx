import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard.jsx"));
const ManageListings = lazy(() => import("../pages/ManageListings/ManageListings.jsx"));
const CreateListing = lazy(() => import("../pages/CreateListing/CreateListing.jsx"));
const ManageCoupons = lazy(() => import("../pages/ManageCoupons/ManageCoupons.jsx"));
const ManageCashCodes = lazy(() => import("../pages/ManageCashCodes/ManageCashCodes.jsx"));
const ManagePlans = lazy(() => import("../pages/ManagePlans/Plans/planDashboard/AdminPlansDashboard.jsx"));
const PlanForm = lazy(() => import("../pages/ManagePlans/Plans/planform/PlanForm.jsx"));
const ManageOrders = lazy(() => import("../pages/ManageOrders/ManageOrders.jsx"));
const ManageTransactions = lazy(() => import("../pages/ManageTransactions/ManageTransactions.jsx"));
const ManageBanners = lazy(() => import("../pages/ManageBanners/ManageBanners.jsx"));
const ManagePartners = lazy(() => import("../pages/ManagePartners/ManagePartners.jsx"));
const ManageReviews = lazy(() => import("../pages/ManageReviews/ManageReviews.jsx"));

/**
 * Modular route manifests for NeedMet Admin Panel
 * Mounted inside the Admin sub-application shell (<Admin /> in src/admin/admin.jsx)
 */
export const adminRoutes = [
  {
    path: "admin",
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: "admin/dashboard",
    element: <Dashboard />,
  },
  {
    path: "admin/listings",
    element: <ManageListings />,
  },
  {
    path: "admin/all_listings",
    element: <ManageListings />,
  },
  {
    path: "admin/listings/new",
    element: <CreateListing />,
  },
  {
    path: "admin/coupons",
    element: <ManageCoupons />,
  },
  {
    path: "admin/cash-codes",
    element: <ManageCashCodes />,
  },
  {
    path: "admin/plans",
    element: <ManagePlans />,
  },
  {
    path: "admin/plans/new",
    element: <PlanForm />,
  },
  {
    path: "admin/plans/edit/:planId",
    element: <PlanForm />,
  },
  {
    path: "admin/plans/clone/:clonePlanId",
    element: <PlanForm />,
  },
  {
    path: "admin/orders",
    element: <ManageOrders />,
  },
  {
    path: "admin/transactions",
    element: <ManageTransactions />,
  },
  {
    path: "admin/banners",
    element: <ManageBanners />,
  },
  {
    path: "admin/home-banners",
    element: <ManageBanners />,
  },
  {
    path: "admin/posters",
    element: <ManageBanners />,
  },
  {
    path: "admin/partners",
    element: <ManagePartners />,
  },
  {
    path: "admin/home-partners",
    element: <ManagePartners />,
  },
  {
    path: "admin/reviews",
    element: <ManageReviews />,
  },
];
