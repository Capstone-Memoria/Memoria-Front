import { Notification } from "@/models/Notification";
import { create } from "zustand";

// 서버에서 오는 실제 데이터 구조에 맞게 정의

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (notification: Notification) => void;
  clearAllNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => {
      const newNotifications = [notification, ...state.notifications];
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n !== notification),
        }));
      }, 3000);
      return { notifications: newNotifications };
    }),
  removeNotification: (notification) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n !== notification),
    })),
  clearAllNotifications: () => set({ notifications: [] }),
}));
