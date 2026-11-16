import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { Loader } from "../../components";

export default function GuestRoute() {
  const { userLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader message="Checking session..." />;
  }

  if (userLoggedIn) {
    const redirectParam = new URLSearchParams(location.search).get("redirect");
    const target = location.state?.from || redirectParam || "/";
    const targetPath = typeof target === "string" ? target : target.pathname;
    const safeTarget = (!targetPath || targetPath === "/login" || targetPath === "/signup" || targetPath === location.pathname) ? "/" : target;

    return <Navigate to={safeTarget} replace />;
  }

  return <Outlet />;
}