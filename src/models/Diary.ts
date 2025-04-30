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
  reactionType: ReactionType;
  createdAt: DateTime;
  createdBy: User;
  lastModifiedAt: DateTime;
  lastModifiedBy: User;
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
