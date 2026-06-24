import { AddListing, ListingDetails } from "../pages";

export const userRoutes = [
  {
    path: "profile",
    element: <div>Profile Page</div>,
  },
  {
    path: "contribute/listing",
    element: <AddListing />
  }, 
  {
    path: "contribute/listing/preview", 
    element: <ListingDetails />
  }
];