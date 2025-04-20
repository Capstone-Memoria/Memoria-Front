import { DateTime } from "luxon";
import { User } from "./User";

export interface DiaryBook {
  id: number;
  title: string;
  isPinned: boolean;
  createAt: DateTime;
  lastModified: DateTime;
  createdBy: User;
  lastModifiedBy: User;
  owner: User;
}
