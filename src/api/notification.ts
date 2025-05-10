import { Notification } from "../models/Notification";
import axios from "./axios";

export const getMyNotifications = async (): Promise<Notification[]> => {
  const response = await axios.get("/api/notifications");
  return response.data;
};

export const deleteAllNotifications = async (): Promise<void> => {
  await axios.delete("/api/notifications");
};

export const markNotificationAsRead = async (
  notificationId: number
): Promise<void> => {
  await axios.patch(`/api/notifications/${notificationId}/read`);
};

export const deleteNotification = async (
  notificationId: number
): Promise<void> => {
  await axios.delete(`/api/notifications/${notificationId}`);
};
