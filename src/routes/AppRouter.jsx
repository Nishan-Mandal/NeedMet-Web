import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./routeGuard/ProtectedRoute";
import GuestRoute from "./routeGuard/GuestRoute";
import AdminRoute from "./routeGuard/AdminRoute";
import { adminRoutes } from "./adminRoutes";
import { publicRoutes } from "./publicRoutes";
import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";
import { redirectRoutes } from "./redirectRoutes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>

      {/* Public Pages */}
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      ))}

      {/* Legacy Policy Redirects */}
      {redirectRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      ))}

      {/* Auth Pages */}
      <Route element={<GuestRoute />}>
        {authRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>

      {/* Authenticated Pages */}
      <Route element={<ProtectedRoute />}>
        {userRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>

      <Route element={<AdminRoute />}>
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))} 
      </Route>
      
    </Route>
  )
);

export default router;