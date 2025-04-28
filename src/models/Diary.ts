import { DateTime } from "luxon";
import { AttachedFile } from "./AttachedFile";
import { User } from "./User";

export interface Diary {
  id: number;
  title: string;
  content: string;
  diaryBookId: number;
  summary?: string;
  createdAt: DateTime;
  createdBy?: User;
  lastModifiedAt?: DateTime;
  lastModifiedBy?: User;
  likeCount?: number;
  commentCount?: number;
  images?: AttachedFile[];
  reactions?: Reaction[];
}

export interface Reaction {
  id: number;
  reactionType: string; // TODO: enum 타입 정의
  createdAt: DateTime;
  createdBy: User;
  lastModifiedAt: DateTime;
  lastModifiedBy: User;
}
