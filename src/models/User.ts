import { DateTime } from "luxon";

export interface User {
  userId: number;
  email: string;
  nickName: string;
  createdAt: DateTime;
}
