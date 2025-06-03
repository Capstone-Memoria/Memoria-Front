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

  const handleNotificationClick = (e: React.MouseEvent) => {
    // 버튼 클릭이 아닌 경우에만 URL로 이동
    if (!(e.target as HTMLElement).closest("button")) {
      if (notification.url) {
        navigate(notification.url);
        // 클릭 시 자동으로 읽음 처리
        if (!notification.read) {
          onRead(notification.id);
        }
      }
    }
  };

  return (
    <div
      className={`py-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${notification.read ? "opacity-60" : ""}`}
      onClick={handleNotificationClick}
    >
      <div className={"flex items-start gap-3"}>
        <div className={"flex-1"}>
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
              onClick={(e) => {
                e.stopPropagation();
                onRead(notification.id);
              }}
              className={"p-1 hover:bg-gray-100 rounded-full"}
              title={"읽음으로 표시"}
            >
              <Check className={"size-4 text-gray-500"} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
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
