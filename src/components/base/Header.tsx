import BellIcon from "@/assets/images/BellIcon.svg";
import MemoriaLogo from "@/assets/images/MemoriaLogo.svg";
import ProflieIcon from "@/assets/images/ProfileIcon.svg";
import { cn } from "@/lib/utils/className";
import { HTMLAttributes } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  logoType?: "default" | "back";
}

const Header: React.FC<HeaderProps> = ({ logoType, ...props }) => {
  /* Properties */
  const navigate = useNavigate();

  /* Handlers */
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div
      {...props}
      className={cn("flex justify-between items-center h-10", props.className)}
    >
      {logoType === "back" ? (
        <div className={"bg-white border border-gray-200 p-2 rounded-2xl"}>
          <IoMdArrowBack className={"text-2xl"} onClick={handleBack} />
        </div>
      ) : undefined}
      <img
        src={MemoriaLogo}
        alt={"Memoria Logo"}
        className={"w-24"}
        onClick={() => {
          navigate("/main");
        }}
      />
      <div className={"flex gap-6"}>
        <img src={BellIcon} alt={"Notification Bell"} className={""} />
        <img
          src={ProflieIcon}
          alt={"Profile Icon"}
          className={""}
          onClick={() => {
            navigate("/profile");
          }}
        />
      </div>
    </div>
  );
};

export default Header;
