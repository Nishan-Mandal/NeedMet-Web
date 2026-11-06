import { Navigate } from "react-router-dom";

const DOC_REDIRECT_MAP = {
  about: "about_us",
  about_us: "about_us",
  contact: "contact_us",
  contact_us: "contact_us",
  privacy_policy: "privacy_policy",
  safety: "safety",
  terms_service: "terms_service",
  listing_policy: "listing_policy",
  community_guidelines: "community_guidelines",
};

export const redirectRoutes = Object.entries(DOC_REDIRECT_MAP).map(
  ([path, targetDoc]) => ({
    path,
    element: <Navigate to={`/docs/${targetDoc}`} replace />,
  })
);
