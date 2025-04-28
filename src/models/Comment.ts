import { DateTime } from "luxon";
import { User } from "./User";

interface Comment {
  id: string;
  content: string;
  createdAt?: DateTime;
  createdBy?: User;
  lastModifiedAt?: DateTime;
  lastModifiedBy?: User;
}

interface CommentTree extends Comment {
  children?: CommentTree[];
}

export type { Comment, CommentTree };
