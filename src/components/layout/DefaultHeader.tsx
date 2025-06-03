import { fetchInvitations } from "@/api/invitation";
import { getMyNotifications } from "@/api/notification";
import BellIcon from "@/assets/images/BellIcon.png";
import MemoriaLogo from "@/assets/images/MemoriaLogo.svg";
import ProflieIcon from "@/assets/images/ProfileIcon.png";
import NotificationOverlay from "@/features/main/components/NotificationOverlay";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HTMLAttributes, useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Page from "../page/Page";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  logoType?: "default" | "back";
}

const DefaultHeader: React.FC<HeaderProps> = ({
  logoType = "default",
  ...props
}) => {
  /* Properties */
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authStore = useAuthStore();

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

  // 초대 목록 조회
  const { data: invitations } = useQuery({
    queryKey: ["invitations"],
    queryFn: fetchInvitations,
    enabled: !!authStore.context?.user, // 사용자가 로그인했을 때만 실행
    refetchInterval: 30000, // 30초마다 새로고침
    staleTime: 10000, // 10초 동안 캐시된 데이터 사용
  });

  // 초대 개수 계산
  const invitationCount = invitations?.length || 0;

  // localStorage에서 마지막으로 확인한 초대 개수 가져오기
  const lastCheckedInvitationCount = parseInt(
    localStorage.getItem("lastCheckedInvitationCount") || "0"
  );

  // 새로운 초대가 있는지 확인 (현재 초대 개수가 마지막 확인한 개수보다 많은 경우)
  const newInvitationCount = Math.max(
    0,
    invitationCount - lastCheckedInvitationCount
  );

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
        <div className={"relative"}>
          <img
            src={ProflieIcon}
            alt={"Profile Icon"}
            className={"size-5 cursor-pointer"}
            onClick={() => {
              navigate("/profile");
            }}
          />
          <NotificationBadge count={newInvitationCount} />
        </div>
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
