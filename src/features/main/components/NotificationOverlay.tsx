import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  deleteAllNotifications,
  deleteNotification,
  getMyNotifications,
  markNotificationAsRead,
} from "../../../api/notification";
import { Notification } from "../../../models/Notification";
import NotificationItem from "./NotificationItem";

interface NotificationOverlayProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { data, isFetching } = useQuery({
    queryKey: ["notifications"],
    queryFn: getMyNotifications,
    enabled: isOpen,
  });

  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data]);

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, id) => {
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("알림 읽음 처리 중 오류 발생:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_, id) => {
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("알림 삭제 중 오류 발생:", error);
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      setNotifications([]);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("모든 알림 삭제 중 오류 발생:", error);
    },
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleDeleteAll = () => {
    deleteAllMutation.mutate();
  };

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && (
          <div className={"fixed inset-0 z-40"}>
            <motion.div
              className={"bg-black/50 fixed inset-0 z-40"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.div
              className={
                "bg-white h-full p-6 border z-50 relative max-w-md w-full"
              }
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={"flex items-center justify-between mb-6"}>
                <div className={"text-xl font-semibold"}>내게 온 알림</div>
                <div className={"flex gap-6"}>
                  <button
                    onClick={handleDeleteAll}
                    className={
                      "cursor-pointer hover:bg-gray-100 p-1 rounded-full"
                    }
                    title={"모두 삭제"}
                  >
                    <Trash2 className={"size-5 text-red-500"} />
                  </button>
                  <div
                    onClick={() => setIsOpen(false)}
                    className={
                      "cursor-pointer hover:bg-gray-100 p-1 rounded-full"
                    }
                  >
                    <X className={"size-6"} />
                  </div>
                </div>
              </div>

              <div className={"overflow-y-auto max-h-[calc(100vh-120px)]"}>
                {isFetching ? (
                  <div className={"py-10 text-center text-gray-500"}>
                    로딩 중...
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className={"py-10 text-center text-gray-500"}>
                    알림이 없습니다
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
};

export default NotificationOverlay;
