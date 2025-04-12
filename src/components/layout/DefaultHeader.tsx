import BellIcon from "@/assets/images/BellIcon.svg";
import MemoriaLogo from "@/assets/images/MemoriaLogo.svg";
import ProflieIcon from "@/assets/images/ProfileIcon.svg";
import { HTMLAttributes } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Page from "../page/Page";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  logoType?: "default" | "back";
}

const DefaultHeader: React.FC<HeaderProps> = ({ logoType, ...props }) => {
  /* Properties */
  const navigate = useNavigate();

  /* Handlers */
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Page.Header {...props}>
      {logoType === "back" ? (
        <div className={"pr-6"}>
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
    </Page.Header>
  );
};

export default DefaultHeader;
