import { DateTime } from "luxon";
import { AttachedFile } from "./AttachedFile";
import { User } from "./User";

// 서버에서 사용하는 감정 타입 정의
export enum EmotionType {
  HAPPY = "HAPPY",
  SAD = "SAD",
  ANGRY = "ANGRY",
  DISGUSTED = "DISGUSTED",
  RELAXED = "RELAXED",
  BORED = "BORED",
  LOVING = "LOVING",
  KIND = "KIND",
  AMBITIOUS = "AMBITIOUS",
  SUPERSAD = "SUPERSAD",
  BAD = "BAD",
  SICK = "SICK",
}

export interface Diary {
  id: number;
  title: string;
  content: string;
  diaryBookId: number;
  summary?: string;
  emotion?: EmotionType | string;
  createdAt: DateTime;
  createdBy?: User;
  lastModifiedAt?: DateTime;
  lastModifiedBy?: User;
  reactionCount?: number;
  commentCount?: number;
  images?: AttachedFile[];
  reactions?: Reaction[];
  musicFile?: AttachedFile;
  aiMusicEnabled: boolean;
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
  SAD = "SAD",
  WOW = "WOW",
  CONGRATS = "CONGRATS",
}
