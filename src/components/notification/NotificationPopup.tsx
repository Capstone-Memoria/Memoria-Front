import { useNotificationStore } from "@/stores/NotificationStore";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { FaBell } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const NotificationPopup = () => {
  const notificationStore = useNotificationStore();
  const navigate = useNavigate();

  return createPortal(
    <>
      <AnimatePresence>
        {notificationStore.notifications.map((notification, index) => (
          <motion.div
            onClick={() => {
              navigate(notification.url);
            }}
            layout
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3 }}
            key={notification.id}
            className={
              "fixed top-0 left-1/2 -translate-x-1/2 w-[calc(100vw-40px)] bg-white border border-gray-300 rounded-lg shadow-lg min-h-20 p-4"
            }
            style={{
              marginTop: 12 + index * 10,
            }}
          >
            <div className={"text-sm text-gray-500 flex items-center gap-2"}>
              <FaBell />
              새로운 알림이 도착했어요
            </div>
            <div className={"mt-1"}>{notification.message}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>,
    document.body
  );
};

export default NotificationPopup;
