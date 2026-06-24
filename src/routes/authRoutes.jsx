import {
  SignUp,
  LogIn,
} from "../pages";

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