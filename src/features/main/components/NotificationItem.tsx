import { Notification } from "@/models/Notification";
import { Check, Trash } from "lucide-react";
import { DateTime } from "luxon";

const NotificationItem: React.FC<{
  notification: Notification;

  onRead: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ notification, onRead, onDelete }) => {
  return (
    <div className={`py-4 border-b ${notification.read ? "opacity-60" : ""}`}>
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
