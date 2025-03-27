import { cn } from "@/lib/utils/className";
import logo from "@/assets/images/Logo.png";
import Input from "@/components/common/Input";
import React from "react";
import { MdEmail } from "react-icons/md";
import Button from "@/components/common/Button";

type Props = {
  className?: string;
};

const LoginPage: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "h-screen w-full px-20 justify-center items-center bg-[#FAFAF9]",
        className
      )}
    >
      <img src={logo} className="w-40 mx-auto" />
      <div className="flex justify-center gap-2 w-full">
        <div className="flex-[3]">
          <Input
            type="email"
            label="email"
            placeholder="example@example.com"
            icon={<MdEmail />}
          />
        </div>
        <div className="flex-[1] flex ">
          <Button children="start" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
