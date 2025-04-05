import api from "@/api";
import MemoriaLogo from "@/assets/images/MemoriaLogo.svg";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import { cn } from "@/lib/utils/className";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useMutation } from "@tanstack/react-query";
import { HTMLAttributes, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface LoginPanelProps extends HTMLAttributes<HTMLDivElement> {
  onNext?: () => void;
  onPrev?: () => void;
}

const LoginPanel: React.FC<LoginPanelProps> = ({
  onNext,
  onPrev,
  ...props
}: LoginPanelProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const {
    mutate: tryLogin,
    isPending,
    error,
  } = useMutation({
    mutationFn: () => api.auth.login(email, password),
    onSuccess: (data) => {
      authStore.login({
        accessToken: data.accessToken,
        accessTokenExpiresAt: data.accessTokenExpiresAt,
        user: data.user,
      });
      navigate("/main");
    },
  });

  const handleLogin = () => {
    tryLogin();
  };

  return (
    <div
      {...props}
      className={cn("flex-1 flex flex-col px-6", props.className)}
    >
      <IoMdArrowBack className={"text-xl"} onClick={onPrev} />
      <div>
        <img
          src={MemoriaLogo}
          alt="Memoria Logo"
          className={"mx-auto h-7 mt-8"}
        />
        <div className={"text-xs flex justify-center mt-2"}>
          혼자, 그리고 함께 당신의 오늘을 기록해보세요
        </div>
      </div>
      <div className={"mt-12 flex flex-col gap-10"}>
        <Input
          className={"w-full"}
          label={"이메일"}
          placeholder={"user@example.com"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className={"w-full"}
          label={"비밀번호"}
          type={"password"}
          placeholder={"비밀번호를 입력하세요"}
          value={password}
          helperText={error?.message}
          isError={!!error}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className={"flex-1 min-h-24"} />
      <Button size={"xl"} onClick={handleLogin}>
        로그인
      </Button>
    </div>
  );
};

export default LoginPanel;
