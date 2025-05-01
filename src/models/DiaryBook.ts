import { DateTime } from "luxon";
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
}

export interface InvitationCode {
  id: number;
  diaryBook: DiaryBook;
  inviteBy: User;
  inviteCode: string;
  expiresAt: DateTime;
}

export interface DiaryBookMemer {
  id: number;
  diaryBookId: number;
  user: User;
  permission: "MEMBER" | "ADMIN";
}

export interface DirectInvaitation {
  id: number;
  diaryBook: DiaryBook;
  inviteBy: User;
  inviteTo: User;
}

