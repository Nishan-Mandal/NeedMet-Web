import { Navigate } from "react-router-dom";

export const redirectRoutes = [
  {
    path: "about_us",
    element: <Navigate to="/docs/about_us" replace />,
  },
  {
    path: "contact_us",
    element: <Navigate to="/docs/contact_us" replace />,
  },
  {
    path: "privacy_policy",
    element: <Navigate to="/docs/privacy_policy" replace />,
  },
  {
    path: "safety",
    element: <Navigate to="/docs/safety" replace />,
  },
  {
    path: "terms_service",
    element: <Navigate to="/docs/terms_service" replace />,
  },
  {
    path: "listing_policy",
    element: <Navigate to="/docs/listing_policy" replace />,
  },
  {
    path: "community_guidelines",
    element: <Navigate to="/docs/community_guidelines" replace />,
  },
];
