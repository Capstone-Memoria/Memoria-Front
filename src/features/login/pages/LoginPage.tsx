import { useAuthStore } from "@/stores/AuthenticationStore"; // ⬅️ 추가
import { useEffect, useState } from "react";
import { IoCaretBackCircle } from "react-icons/io5";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"; // ⬅️ 추가
import LoginPanel from "../panels/LoginPanel";
import WelcomePanel from "../panels/WelcomePanel";

const LoginPage = () => {
  const [step, setStep] = useState(0);

  /* 1️⃣  라우터 훅 */
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  /* 2️⃣  로그인 여부 감시 */
  const { context } = useAuthStore();
  const user = context?.user;

  /* from이 있는지 확인 */
  const from = searchParams.get("from");

  /* 3️⃣  회원가입에서 온 경우 바로 LoginPanel로 이동 */
  useEffect(() => {
    const state = location.state as { fromRegister?: boolean; email?: string };
    if (state?.fromRegister) {
      setStep(1);
    }
  }, [location.state]);

  const handleLoginSuccess = () => {
    const redirectTo = from || "/main";
    navigate(redirectTo, { replace: true });
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  return (
    <div className={"h-full overflow-x-hidden flex flex-col"}>
      {/* from이 존재할 때 리다이렉션 메시지 표시 */}
      {from && (
        <div
          className={
            "flex items-center gap-2 justify-center top-0 left-0 right-0 z-50 bg-gray-500 text-white text-center py-2 px-4 text-sm"
          }
        >
          <IoCaretBackCircle />
          로그인 완료 후 원래 페이지로 돌아가요
        </div>
      )}
      <div
        className={
          "flex overflow-hidden w-fit flex-1 transition-transform duration-500 ease-expo-out py-6"
        }
        style={{ transform: `translateX(-${step * 100}vw)` }}
      >
        <WelcomePanel className={"w-screen h-full"} onNext={handleNext} />
        <LoginPanel
          className={"w-screen"}
          onNext={handleNext}
          onPrev={handlePrev}
          initialEmail={(location.state as { email?: string })?.email}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </div>
  );
};

export default LoginPage;
