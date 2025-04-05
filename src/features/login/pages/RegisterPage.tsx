import MemoriaLogo from "@/assets/images/MemoriaLogo.svg";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import PageContainer from "@/components/page/PageContainer";
import { cn } from "@/lib/utils/className";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const naviate = useNavigate();

  return (
    <PageContainer className={cn("h-full flex flex-col px-6 pb-6")}>
      <div>
        <IoMdArrowBack
          className={"text-xl"}
          onClick={() => {
            naviate(-1);
          }}
        />
      </div>
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
        />
        <Input
          className={"w-full"}
          label={"닉네임"}
          placeholder={"닉네임을 입력하세요"}
        />
        <Input
          className={"w-full"}
          label={"비밀번호"}
          type={"password"}
          placeholder={"******"}
        />
        <Input
          className={"w-full"}
          label={"비밀번호 확인"}
          type={"password"}
          placeholder={"******"}
        />
      </div>
      <div className={"flex-1 min-h-12"} />
      <Button size={"xl"}>회원가입 하기</Button>
    </PageContainer>
  );
};

export default RegisterPage;
