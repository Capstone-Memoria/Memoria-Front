import LoginPage from "@/features/login/pages/LoginPage";
import MainPage from "@/features/main/pages/MainPage";
import RegisterPage from "@/features/login/pages/RegisterPage";
import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/main",
    element: <MainPage />,
  },
];
