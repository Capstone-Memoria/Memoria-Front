import { DateTime } from "luxon";
import { AttachedFile } from "./AttachedFile";
import { User } from "./User";

export interface DiaryBook {
  id: number;
  title: string;
  isPinned: boolean;
  memberCount: number;
  createAt: DateTime;
  lastModified: DateTime;
  createdBy: User;
  lastModifiedBy: User;
  owner: User;
  coverImage?: AttachedFile;
}
