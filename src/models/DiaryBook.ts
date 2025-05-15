import { DateTime } from "luxon";
import { AttachedFile } from "./AttachedFile";
import { Sticker } from "./Sticker";
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
  stickers?: Sticker[];
  owner: User;
  coverImage?: AttachedFile;
}
