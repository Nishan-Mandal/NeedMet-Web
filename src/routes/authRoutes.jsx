import { lazy } from "react";

const SignUp = lazy(() => import("../pages/auth/SignUp.jsx"));
const LogIn = lazy(() => import("../pages/auth/LogIn.jsx"));

export const authRoutes = [
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "login",
    element: <LogIn />,
  },
];