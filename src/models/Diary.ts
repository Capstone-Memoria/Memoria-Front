import { DateTime } from "luxon";
import { AttachedFile } from "./AttachedFile";
import { User } from "./User";

export interface Diary {
  title: string;
  coverImage?: AttachedFile;
  summary?: string;
  createAt: DateTime;
  createdBy: User;
  likeCount?: number;
  commentCount?: number;
}
