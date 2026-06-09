import { Dashboard, AllListings } from "../pages";

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