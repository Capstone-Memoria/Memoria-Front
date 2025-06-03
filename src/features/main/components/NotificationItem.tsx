import { Notification } from "@/models/Notification";
import { Check, Trash } from "lucide-react";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";

const NotificationItem: React.FC<{
  notification: Notification;

  onRead: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ notification, onRead, onDelete }) => {
  const navigate = useNavigate();

  // 초대 관련 알림인지 확인 (type이 'invitation' 또는 메시지에 '초대'가 포함된 경우)
  const isInvitationNotification =
    notification.type === "invitation" ||
    notification.message.includes("초대") ||
    notification.message.includes("invitation");

  const handleNotificationClick = () => {
    if (isInvitationNotification) {
      // 초대 관련 알림이면 프로필 페이지로 이동
      navigate("/profile");
    } else if (notification.url) {
      // 다른 알림이면 URL이 있는 경우 해당 URL로 이동
      navigate(notification.url);
    }

    // 읽지 않은 알림이면 읽음으로 표시
    if (!notification.read) {
      onRead(notification.id);
    }
  };

  return (
    <div className={`py-4 border-b ${notification.read ? "opacity-60" : ""}`}>
      <div className={"flex items-start gap-3"}>
        <div
          className={`flex-1 ${isInvitationNotification || notification.url ? "cursor-pointer hover:bg-gray-50 rounded p-1 -m-1" : ""}`}
          onClick={handleNotificationClick}
        >
          <p
            className={`text-sm ${notification.read ? "font-normal" : "font-medium"} break-keep`}
          >
            {notification.message}
          </p>
          <p className={"text-xs text-gray-500 mt-1"}>
            {DateTime.fromISO(notification.createdAt.toString()).toLocaleString(
              DateTime.DATETIME_SHORT
            )}
          </p>
        </div>

        <div className={"flex gap-2"}>
          {!notification.read && (
            <button
              onClick={() => onRead(notification.id)}
              className={"p-1 hover:bg-gray-100 rounded-full"}
              title={"읽음으로 표시"}
            >
              <Check className={"size-4 text-gray-500"} />
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className={"p-1 hover:bg-gray-100 rounded-full"}
            title={"알림 삭제"}
          >
            <Trash className={"size-4 text-gray-500"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
