import { DateTime } from "luxon";

export interface Notification {
  id: number;
  type: string;
  message: string;
  read: boolean;
  url: string;
  createdAt: DateTime;
}
