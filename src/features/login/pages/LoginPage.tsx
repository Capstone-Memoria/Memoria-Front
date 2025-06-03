import { useAuthStore } from "@/stores/AuthenticationStore"; // ⬅️ 추가
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ⬅️ 추가
import LoginPanel from "../panels/LoginPanel";
import WelcomePanel from "../panels/WelcomePanel";

const LoginPage = () => {
  const [step, setStep] = useState(0);

  /* 1️⃣  라우터 훅 */
  const navigate = useNavigate();
  const location = useLocation();

  /* 2️⃣  로그인 여부 감시 */
  const { context } = useAuthStore();
  const user = context?.user;

  /* 3️⃣  회원가입에서 온 경우 바로 LoginPanel로 이동 */
  useEffect(() => {
    const state = location.state as { fromRegister?: boolean; email?: string };
    if (state?.fromRegister) {
      setStep(1);
    }
  }, [location.state]);

  /* 4️⃣  로그인 완료 시 자동 복귀 */
  useEffect(() => {
    if (user) {
      const from = (location.state as { from?: string })?.from || "/main";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  return (
    <div className={"h-full py-6 overflow-x-hidden"}>
      <div
        className={
          "flex overflow-hidden w-fit h-full transition-transform duration-500 ease-expo-out"
        }
        style={{ transform: `translateX(-${step * 100}vw)` }}
      >
        <WelcomePanel className={"w-screen h-full"} onNext={handleNext} />
        <LoginPanel
          className={"w-screen"}
          onNext={handleNext}
          onPrev={handlePrev}
          initialEmail={(location.state as { email?: string })?.email}
        />
      </div>
    </div>
  );
};

export default LoginPage;
