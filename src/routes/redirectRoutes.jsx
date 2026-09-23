import { Navigate } from "react-router-dom";

const DOC_SLUGS = [
  "about_us",
  "contact_us",
  "privacy_policy",
  "safety",
  "terms_service",
  "listing_policy",
  "community_guidelines",
];

export const redirectRoutes = DOC_SLUGS.map((slug) => ({
  path: slug,
  element: <Navigate to={`/docs/${slug}`} replace />,
}));
