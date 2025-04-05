import LoginPage from "@/features/login/pages/LoginPage";
import RegisterPage from "@/features/login/pages/RegisterPage";
import MainPage from "@/features/main/pages/MainPage";
import { Navigate, RouteObject } from "react-router-dom";

// export const routes: RouteObject[] = [
//   {
//     path: "/",
//     element: <LoginPage />,
//   },
//   {
//     path: "/register",
//     element: <RegisterPage />,
//   },
// ];

type RoutingContext = "logined" | "unlogined";
type ContextRoutes = Record<RoutingContext, RouteObject[]>;

export const routes: ContextRoutes = {
  logined: [
    {
      path: "/",
      element: <Navigate replace to={"/main"} />,
    },
    {
      path: "/main",
      element: <MainPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ],
  unlogined: [
    {
      path: "/",
      element: <Navigate replace to={"/login"} />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ],
};
