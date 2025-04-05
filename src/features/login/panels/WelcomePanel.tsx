import onboardingImage from "@/assets/images/Onboarding.png";
import Button from "@/components/base/Button";
import { cn } from "@/lib/utils/className";
import { HTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";

interface WelcomePanelProps extends HTMLAttributes<HTMLDivElement> {
  onNext?: () => void;
}

const WelcomePanel: React.FC<WelcomePanelProps> = ({ onNext, ...props }) => {
  const navigate = useNavigate();

  return (
    <div
      {...props}
      className={cn("flex-1 flex flex-col px-6", props.className)}
    >
      <div className={"mt-20 text-2xl font-medium"}>나를 위한 작은 쉼표,</div>
      <div className={"mt-4"}>
        <div>조용히 혼자 써도, 따뜻하게 나눠도 괜찮아요.</div>
        <div>나의 하루가 음악이 되고 이야기로 남는 곳,</div>
        <div>메모리아에서 함께 이야기해요.</div>
      </div>
      <div className={"mx-8 flex-1 flex items-center justify-center"}>
        <img src={onboardingImage} alt={"Onboarding"} className={"max-w-72"} />
      </div>
      <div className={"flex items-center justify-center mb-4"} onClick={onNext}>
        이미 함께하고 계신가요?{" "}
        <span className={"ml-2 text-green-500"}>로그인</span>
      </div>
      <Button
        size={"xl"}
        onClick={() => {
          navigate("/register");
        }}
      >
        반가워요!
      </Button>
    </div>
  );
};

export default WelcomePanel;
