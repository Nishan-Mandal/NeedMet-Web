import {
  Home,
  ListingDetails,
  ListingsPage,
  AllCategory,
  LegalPage,
  SearchPage,
} from "../pages";
import { SystemState } from "../components";
import ErrorImg from '../assets/error.png'

export const publicRoutes = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "listing/:listingId",
    element: <ListingDetails />,
  },
  {
    path: "listings/similar/:listingId",
    element: <ListingsPage />,
  },
  {
    path: "listings/:type",
    element: <ListingsPage />,
  },
  {
    path: "listings/category/:category_name",
    element: <ListingsPage />,
  },
  {
    path: "all_categories",
    element: <AllCategory />,
  },
  {
    path: ":legalDocument",
    element: <LegalPage />,
  },
  {
    path: "search",
    element: <SearchPage />,
  },
  {
    path: "*",
    element: 
      <SystemState
        imageSrc={ErrorImg}
        title="404 - Page"
        highlight="Not Found"
        message="The page you're looking for doesn't exist or may have been moved. Please check the URL or go back to the homepage."
        actionType="navigate"
        actionLabel="Go Home"
      />,
  }
];