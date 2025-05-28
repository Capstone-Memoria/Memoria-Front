import { AttachedFile } from "./AttachedFile";

export type StickerType =
  | "PREDEFINED"
  | "CUSTOM_IMAGE"
  | "CUSTOM_TEXT"
  | "IMAGE_TO_UPLOAD"
  | "IMAGE_TO_REQUEST";

export type BaseSticker = {
  uuid: string;
  type: StickerType;
  diaryBookId?: string;
  posX: number;
  posY: number;
  size: number;
  rotation: number;
};

export type PredefinedSticker = BaseSticker & {
  type: "PREDEFINED";
  assetName: string;
};

export type CustomImageSticker = BaseSticker & {
  type: "CUSTOM_IMAGE";
  imageFile: AttachedFile;
};

export type ImageToUploadSticker = BaseSticker & {
  type: "IMAGE_TO_UPLOAD";
  imageFile: File;
};

export type ImageToRequestSticker = BaseSticker & {
  type: "IMAGE_TO_REQUEST";
  heldStickerImageUuid: string;
};

export type CustomTextSticker = BaseSticker & {
  type: "CUSTOM_TEXT";
  textContent: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  italic: boolean;
  bold: boolean;
  templateWidth: number;
};

export type Sticker =
  | PredefinedSticker
  | CustomImageSticker
  | CustomTextSticker;

export type ModifyingSticker =
  | Exclude<Sticker, CustomImageSticker>
  | ImageToUploadSticker;

export type RequestSticker =
  | Exclude<Sticker, CustomImageSticker>
  | ImageToRequestSticker;
