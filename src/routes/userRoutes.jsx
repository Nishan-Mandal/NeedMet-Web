import { lazy } from "react";
import { ListingDetails } from "../pages";

const AddListing = lazy(() => import("../pages/AddListing.jsx"));

export const userRoutes = [
  {
    path: "profile",
    element: (
      <div className="min-h-[50vh] flex items-center justify-center p-8 text-center text-lg font-medium text-slate-700">
        Profile Page
      </div>
    ),
  },
  {
    path: "contribute/listing",
    element: <AddListing />,
  },
  {
    path: "contribute/listing/preview",
    element: <ListingDetails />,
  },
];