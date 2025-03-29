import React, { useState } from "react";
import { cn } from "@/lib/utils/className";
import logo from "@/assets/images/Logo.png";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { MdEmail, MdKey } from "react-icons/md";
import { FaTag } from "react-icons/fa";

type Props = {
  className?: string;
};

const LoginPage: React.FC<Props> = ({ className }) => {
  // 단계: 1은 이메일 입력, 2는 로그인/회원가입 폼
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 더미 회원 검증: 이메일에 "member"가 포함되면 회원으로 처리
  const checkMembership = async (email: string) => {
    return new Promise<{ isMember: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ isMember: email.includes("member") });
      }, 500);
    });
  };

  const handleStart = async () => {
    if (!email) return;
    try {
      const result = await checkMembership(email);
      setIsMember(result.isMember);
      setStep(2);
    } catch (error) {
      console.error("회원 검증 에러", error);
    }
  };

  const handleLogin = async () => {
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    setTimeout(() => {
      console.log("로그인 시도:", { email, password });
      alert("로그인 성공!");
    }, 500);
  };

  const handleSignup = async () => {
    if (!nickname || !password || !confirmPassword) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    setTimeout(() => {
      console.log("회원가입 시도:", { email, nickname, password });
      alert("회원가입 성공!");
    }, 500);
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full px-20 flex flex-col justify-center items-center bg-[#FAFAF9]",
        className
      )}
    >
      <img src={logo} className="w-40 mx-auto" alt="Logo" />

      {step === 1 && (
        <div className="flex justify-center gap-2 w-full max-w-md">
          <Input
            type="email"
            label="Email"
            placeholder="example@example.com"
            icon={<MdEmail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="max-w-20" onClick={handleStart}>
            Start
          </Button>
        </div>
      )}

      {step === 2 && isMember && (
        // 로그인: 기존 이메일 입력값을 그대로 보여주고, 비밀번호 입력란과 버튼을 나란히 배치
        <div className="flex gap-4 w-full max-w-md">
          <div className="flex flex-col flex-1 gap-4">
            <Input
              type="email"
              label="Email"
              placeholder="example@example.com"
              icon={<MdEmail />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-[#B1B1B1]"
              disabled
            />
            <Input
              type="password"
              label="Password"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              icon={<MdKey />}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex">
            <Button onClick={handleLogin} className="h-full">
              &gt;
            </Button>
          </div>
        </div>
      )}

      {step === 2 && isMember === false && (
        // 회원가입: 이메일 입력값 유지 + 추가 입력란들이 세로로 나열되고, 버튼은 하단에 위치
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Input
            type="email"
            label="Email"
            placeholder="example@example.com"
            icon={<MdEmail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-[#B1B1B1]"
            disabled
          />
          <Input
            type="text"
            label="Nickname"
            placeholder="닉네임을 입력해주세요."
            value={nickname}
            icon={<FaTag />}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Input
            type="password"
            label="Password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            icon={<MdKey />}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            label="Confirm Password"
            placeholder="비밀번호를 재입력해주세요."
            value={confirmPassword}
            icon={<MdKey />}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button onClick={handleSignup}>Sign Up</Button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
