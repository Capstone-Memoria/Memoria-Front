import { useState } from "react";
import LoginPanel from "../panels/LoginPanel";
import WelcomePanel from "../panels/WelcomePanel";

const LoginPage = () => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <div className={"h-full py-6 overflow-x-hidden"}>
      <div
        className={
          "flex overflow-hidden w-fit h-full transition-transform duration-500 ease-expo-out"
        }
        style={{
          transform: `translateX(-${step * 100}vw)`,
        }}
      >
        <WelcomePanel className={"w-screen h-full"} onNext={handleNext} />
        <LoginPanel
          className={"w-screen"}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    </div>
  );
};

export default LoginPage;
