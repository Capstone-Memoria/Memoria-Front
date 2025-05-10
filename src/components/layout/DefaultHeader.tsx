import BellIcon from "@/assets/images/BellIcon.svg";
import MemoriaLogo from "@/assets/images/MemoriaLogo.svg";
import ProflieIcon from "@/assets/images/ProfileIcon.svg";
import NotificationOverlay from "@/features/main/components/NotificationOverlay";
import { HTMLAttributes, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Page from "../page/Page";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  logoType?: "default" | "back";
  onNotificationClick?: () => void;
}

const DefaultHeader: React.FC<HeaderProps> = ({
  logoType,
  onNotificationClick,
  ...props
}) => {
  /* Properties */
  const navigate = useNavigate();

  /* States */
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  /* Handlers */
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Page.Header {...props}>
      {logoType === "back" ? (
        <div className={"pr-6"}>
          <MdOutlineKeyboardBackspace
            className={"text-2xl"}
            onClick={handleBack}
          />
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
        <img
          src={BellIcon}
          alt={"Notification Bell"}
          className={""}
          onClick={() => {
            setIsNotificationOpen(true);
          }}
        />
        <img
          src={ProflieIcon}
          alt={"Profile Icon"}
          className={""}
          onClick={() => {
            navigate("/profile");
          }}
        />
      </div>
      <NotificationOverlay
        isOpen={isNotificationOpen}
        setIsOpen={setIsNotificationOpen}
      />
    </Page.Header>
  );
};

export default DefaultHeader;
