import { DateTime } from "luxon";
import { AttachedFile } from "./AttachedFile";
import { DiaryBook } from "./DiaryBook";

export interface AICharacter {
  id: number;
  name: string;
  profileImage?: AttachedFile;
  diaryBook?: DiaryBook;
  feature: string;
  accent: string;
  type: "DEFAULT" | "CUSTOM";
  createdAt?: DateTime;
  lastModifiedAt?: DateTime;
}


export interface AIComment {
  id: number;
  title: string;
  content: string;
  createdBy: AICharacter;
  createdAt?: DateTime;
}