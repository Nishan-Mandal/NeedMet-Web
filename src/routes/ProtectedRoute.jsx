import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function ProtectedRoute() {
  const { userLoggedIn } = useAuth();

  return (
    userLoggedIn ? 
      <Outlet /> : 
      <Navigate to="/login" replace />
  );
}