import { DateTime } from "luxon";

export interface User {
  email: string;
  nickName: string;
  createdAt: DateTime;
}
