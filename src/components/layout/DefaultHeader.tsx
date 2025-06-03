import { getMyNotifications } from "@/api/notification";
import BellIcon from "@/assets/images/BellIcon.png";
import MemoriaLogo from "@/assets/images/MemoriaLogo.svg";
import ProflieIcon from "@/assets/images/ProfileIcon.png";
import NotificationOverlay from "@/features/main/components/NotificationOverlay";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HTMLAttributes, useEffect, useState } from "react";
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
  const queryClient = useQueryClient();

  /* States */
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  /* Queries */
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: getMyNotifications,
    refetchInterval: 30000, // 30초마다 새로고침
    staleTime: 10000, // 10초 동안 캐시된 데이터 사용
  });

  // 읽지 않은 알림 개수 계산
  const unreadCount =
    notifications?.filter((notification) => !notification.read).length || 0;

  /* Effects */
  // 알림 오버레이가 닫힐 때 알림 개수 업데이트
  useEffect(() => {
    if (!isNotificationOpen) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  }, [isNotificationOpen, queryClient]);

  /* Handlers */
  const handleBack = () => {
    navigate(-1);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(true);
    // 알림 오버레이를 열 때 최신 데이터 가져오기
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
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
        <div className={"relative"}>
          <img
            src={BellIcon}
            alt={"Notification Bell"}
            className={"size-5 cursor-pointer"}
            onClick={handleNotificationClick}
          />
          <NotificationBadge count={unreadCount} />
        </div>
        <img
          src={ProflieIcon}
          alt={"Profile Icon"}
          className={"size-5"}
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

// 알림 뱃지 컴포넌트
const NotificationBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) {
    return null;
  }

  return (
    <div
      className={
        "absolute top-0 right-0 min-w-4 h-4 translate-x-[calc(50%-2px)] -translate-y-[calc(50%-2px)] flex items-center justify-center bg-red-500 text-white font-normal text-[10px] px-1 rounded-full"
      }
    >
      {count > 99 ? "99+" : count}
    </div>
  );
};

export default DefaultHeader;
