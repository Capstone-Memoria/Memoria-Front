import CreateDiaryPage from "@/features/diary/pages/CreateDiaryBookPage";
import DiaryContentPage from "@/features/diary/pages/DiaryContentPage";
import DiaryMemberPage from "@/features/diary/pages/DiaryMemberPage";
import EditDiaryPage from "@/features/diary/pages/EditDiaryPage";
import ManageDiaryPage from "@/features/diary/pages/ManageDiaryPage";
import ViewDiaryListPage from "@/features/diary/pages/ViewDiaryListPage";
import WriteDiaryPage from "@/features/diary/pages/WriteDiaryPage";
import ErrorPage from "@/features/error/pages/ErrorPage";
import InviteAcceptPage from "@/features/invite/InviteAcceptPage";
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
      element: <ViewDiaryListPage />,
    },
    {
      path: "/diary/:diaryId/manage",
      element: <ManageDiaryPage />,
    },
    {
      path: "/diary/write/",
      element: <WriteDiaryPage />,
    },
    {
      path: "/diary/:diaryId/members",
      element: <DiaryMemberPage />,
    },
    {
      path: "/diary/:diaryBookId/diary/:diaryId",
      element: <DiaryContentPage />,
    },
    {
      path: "/diary/:diaryBookId/diary/:diaryId/edit",
      element: <EditDiaryPage />,
    },
    {
      path: "/code-invite/:inviteCode",
      element: <InviteAcceptPage />, // 초대 수락 페이지
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
