import SignUp from "../pages/auth/SignUp.jsx";
import LogIn from "../pages/auth/LogIn.jsx";

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