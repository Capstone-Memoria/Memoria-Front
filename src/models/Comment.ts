import { DateTime } from "luxon";
import { Diary } from "./Diary";
import { User } from "./User";

interface Comment {
  id: number;
  content: string;
  createdAt?: DateTime;
  createdBy: User;
  lastModifiedAt?: DateTime;
  lastModifiedBy: User;
  diary: Diary;
  parentId: number | null;
  deleted: boolean;
}

interface CommentTree extends Comment {
  children: CommentTree[];
}

export type { Comment, CommentTree };
