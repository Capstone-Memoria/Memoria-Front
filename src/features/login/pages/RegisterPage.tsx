import api from "@/api";
import MemoriaLogo from "@/assets/images/MemoriaLogo.svg";
import Button from "@/components/base/Button";
import Dialog from "@/components/base/Dialog";
import Input from "@/components/base/Input";
import Spinner from "@/components/base/Spinner";
import Page from "@/components/page/Page";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  email: string;
  nickName: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    nickName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChangeByKey = (key: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [pwdErrorMessage, setPwdErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const {
    mutate: tryRegister,
    isPending,
    error,
  } = useMutation({
    mutationFn: () => api.auth.register(formData),
    onSuccess: () => {
      setShowSuccessDialog(true);
    },
  });

  const handleRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      setPwdErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setPwdErrorMessage(undefined);
    tryRegister();
  };

  return (
    <Page.Container>
      <Page.Header>
        <div>
          <IoMdArrowBack
            className={"text-xl"}
            onClick={() => {
              navigate(-1);
            }}
          />
        </div>
      </Page.Header>
      <Page.Content>
        <div>
          <img
            src={MemoriaLogo}
            alt={"Memoria Logo"}
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
            value={formData.email}
            onChange={(e) => {
              handleChangeByKey("email", e.target.value);
            }}
          />
          <Input
            className={"w-full"}
            label={"닉네임"}
            placeholder={"닉네임을 입력하세요"}
            value={formData.nickName}
            onChange={(e) => {
              handleChangeByKey("nickName", e.target.value);
            }}
          />
          <Input
            className={"w-full"}
            label={"비밀번호"}
            type={"password"}
            placeholder={"******"}
            value={formData.password}
            onChange={(e) => {
              handleChangeByKey("password", e.target.value);
            }}
          />
          <Input
            className={"w-full"}
            label={"비밀번호 확인"}
            type={"password"}
            placeholder={"******"}
            value={formData.confirmPassword}
            onChange={(e) => {
              handleChangeByKey("confirmPassword", e.target.value);
            }}
            helperText={pwdErrorMessage}
            isError
          />
        </div>
        <div className={"flex-1 min-h-6"} />
        <div className={"text-red-500 text-center mb-3 text-sm"}>
          {error?.message}
        </div>
        <Button
          size={"xl"}
          onClick={handleRegister}
          className={"w-full flex items-center justify-center gap-1 h-14"}
        >
          {isPending ? (
            <>
              <Spinner className={"text-white"} />
            </>
          ) : (
            "회원가입 하기"
          )}
        </Button>
      </Page.Content>

      {/* 회원가입 성공 다이얼로그 */}
      <Dialog
        open={showSuccessDialog}
        title={"회원가입 완료!"}
        description={
          "회원가입이 성공적으로 완료되었습니다.\n로그인 화면으로 이동합니다."
        }
        onConfirm={() => {
          setShowSuccessDialog(false);
          navigate("/login", {
            replace: true,
            state: {
              fromRegister: true,
              email: formData.email,
            },
          });
        }}
        onClose={() => {
          setShowSuccessDialog(false);
          navigate("/login", {
            replace: true,
            state: {
              fromRegister: true,
              email: formData.email,
            },
          });
        }}
      />
    </Page.Container>
  );
};

export default RegisterPage;
