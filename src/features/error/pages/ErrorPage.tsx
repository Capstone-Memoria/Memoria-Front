import Button from "@/components/base/Button";
import Page from "@/components/page/Page";
import { ReactNode } from "react";
import {
  FaBug,
  FaExclamationTriangle,
  FaLock,
  FaSearchMinus,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

interface ErrorPageProps {
  defaultErrorCode?: string;
}

const ErrorPage = ({ defaultErrorCode = "500" }: ErrorPageProps) => {
  const { errorCode } = useParams<{ errorCode?: string }>();
  const navigate = useNavigate();

  const code = errorCode || defaultErrorCode;

  const errorMessages: Record<string, string> = {
    "404": "페이지를 찾을 수 없습니다",
    "500": "서버 오류가 발생했습니다",
    "403": "접근 권한이 없습니다",
    "400": "잘못된 요청입니다",
  };

  const errorIcons: Record<string, ReactNode> = {
    "404": <FaSearchMinus className={"text-gray-500 mb-4"} />,
    "500": <FaBug className={"text-red-500 mb-4"} />,
    "403": <FaLock className={"text-yellow-500 mb-4"} />,
    "400": <FaExclamationTriangle className={"text-orange-500 mb-4"} />,
  };

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <Page.Container>
      <div className={"flex flex-col items-center justify-center mt-32"}>
        <div className={"text-6xl"}>
          {errorIcons[code] || <FaExclamationTriangle className={" mb-4"} />}
        </div>
        <h1 className={"text-5xl font-bold text-black mb-4"}>{code}</h1>
        <p className={"text-xl text-gray-600 mb-8"}>
          {errorMessages[code] || "오류가 발생했습니다"}
        </p>
        <div className={"flex space-x-4"}>
          <Button onClick={goBack} size={"lg"}>
            이전으로 돌아가기
          </Button>
          <Button onClick={goHome} size={"lg"}>
            홈으로 이동
          </Button>
        </div>
      </div>
    </Page.Container>
  );
};

export default ErrorPage;
