import { lazy } from "react";
import {
  Home,
  ListingDetails,
  ListingsPage,
  AllCategory,
  SearchPage,
  AboutPage,
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
    path: "articles",
    element: <ArticlesPage />,
  },
  {
    path: "articles/:articleId/:slug?",
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
    element: <AllCategory />,
  },
  {
    path: "about",
    element: <AboutPage />,
  },
  {
    path: "about_us",
    element: <AboutPage />,
  },
  {
    path: "docs/about_us",
    element: <AboutPage />,
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