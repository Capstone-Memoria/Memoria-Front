import CreateDiaryPage from "@/features/diary/pages/CreateDiaryPage";
import DiaryMemberPage from "@/features/diary/pages/DiaryMemberPage";
import ManageDiaryPage from "@/features/diary/pages/ManageDiaryPage";
import ViewDiaryPage from "@/features/diary/pages/ViewDiaryPage";
import WriteDiaryPage from "@/features/diary/pages/WriteDiaryPage";
import ErrorPage from "@/features/error/pages/ErrorPage";
import LoginPage from "@/features/login/pages/LoginPage";
import RegisterPage from "@/features/login/pages/RegisterPage";
import MainPage from "@/features/main/pages/MainPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import { Navigate, RouteObject } from "react-router-dom";

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
      path: "/create-diary",
      element: <CreateDiaryPage />,
    },
    {
      path: "/profile",
      element: <ProfilePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/error",
      element: <ErrorPage />,
    },
    {
      path: "/error/:errorCode",
      element: <ErrorPage />,
    },
    {
      path: "/diary/:diaryId",
      element: <ViewDiaryPage />,
    },
    {
      path: "/diary/:diaryId/manage",
      element: <ManageDiaryPage />,
    },
    {
      path: "/diary/write",
      element: <WriteDiaryPage />,
    },
    {
      path: "/diary/:diaryId/members",
      element: <DiaryMemberPage />,
    },
    {
      path: "/*",
      element: <ErrorPage defaultErrorCode={"404"} />,
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
    {
      path: "/error",
      element: <ErrorPage />,
    },
    {
      path: "/error/:errorCode",
      element: <ErrorPage />,
    },
    {
      path: "/*",
      element: <ErrorPage defaultErrorCode={"404"} />,
    },
  ],
};
