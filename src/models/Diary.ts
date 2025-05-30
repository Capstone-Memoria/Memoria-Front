import { DateTime } from "luxon";
import { AttachedFile } from "./AttachedFile";
import { User } from "./User";

export interface Diary {
  id: number;
  title: string;
  content: string;
  diaryBookId: number;
  summary?: string;
  emotion?: string;
  createdAt: DateTime;
  createdBy?: User;
  lastModifiedAt?: DateTime;
  lastModifiedBy?: User;
  reactionCount?: number;
  commentCount?: number;
  images?: AttachedFile[];
  reactions?: Reaction[];
  musicFile?: AttachedFile;
}

interface ReactionId {
  diaryId: number;
  user: User;
}

export interface Reaction {
  id: ReactionId;
  reactionType: ReactionType;
  createdAt: DateTime;
  lastModifiedAt: DateTime;
}

export enum ReactionType {
  LIKE = "LIKE",
  HEART = "HEART",
  SMILE = "SMILE",
  SAD = "SAD",
  HUG = "HUG",
  LAUGH = "LAUGH",
  WOW = "WOW",
  CONGRATS = "CONGRATS",
}
