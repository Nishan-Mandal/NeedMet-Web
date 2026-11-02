import { lazy } from "react";
import { Navigate } from "react-router-dom";
import {
  Home,
  ListingDetails,
  ListingsPage,
  AllCategory,
  SearchPage,
  ArticlesPage,
  ArticleDetails,
} from "../pages";
import { SystemState } from "../components";
import NoDataImg from "../assets/no_data.png";

const LegalPage = lazy(() => import("../pages/LegalPage.jsx"));

export const publicRoutes = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "blogs",
    element: <ArticlesPage />,
  },
  {
    path: "blog/:articleId/:slug?",
    element: <ArticleDetails />,
  },
  {
    path: "listing/:listingId/:slug?",
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
    path: "listings/category/:category_slug",
    element: <ListingsPage />,
  },
  {
    path: "all_categories",
    element: <AllCategory />,
  },
  {
    path: "categories",
    element: <Navigate to="/all_categories" replace />,
  },
  {
    path: "docs/:legalDocument",
    element: <LegalPage />,
  },
  {
    path: "search",
    element: <SearchPage />,
  },
  {
    path: "*",
    element: (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <SystemState
          imageSrc={NoDataImg}
          title="404 - Page"
          highlight="Not Found"
          message="The page you're looking for doesn't exist or may have been moved. Please check the URL or go back to the homepage."
          actionType="navigate"
          actionLabel="Go Home"
          actionTo="/"
        />
      </div>
    ),
  },
];
