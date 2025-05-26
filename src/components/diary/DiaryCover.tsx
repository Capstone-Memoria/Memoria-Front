import { cn } from "@/lib/utils/className";
import { Sticker } from "@/models/Sticker";
import { HTMLAttributes, useEffect, useMemo, useState } from "react";
import Image from "../base/Image";

type BaseDiaryCoverItem = {};

type UploadedDiaryCoverItemType = BaseDiaryCoverItem & {
  type: "uploaded";
  imageId: string;
};

type PresetDiaryCoverItemType = BaseDiaryCoverItem & {
  type: "preset";
  imageSrc: string;
};

type FileDiaryCoverItemType = BaseDiaryCoverItem & {
  type: "file";
  image: File;
};

type EmptyDiaryCoverItemType = BaseDiaryCoverItem & {
  type: "empty";
};

export type DiaryCoverItem =
  | UploadedDiaryCoverItemType
  | PresetDiaryCoverItemType
  | FileDiaryCoverItemType
  | EmptyDiaryCoverItemType;

interface DiaryCoverProps extends HTMLAttributes<HTMLDivElement> {
  // pinned?: boolean;
  // showPin?: boolean;
  // notificationCount?: number;
  stickers?: Sticker[];
  item?: DiaryCoverItem;
  title?: string;
  spineColor?: string;
}

const DiaryCover: React.FC<DiaryCoverProps> = ({
  item,
  title = "Diary Cover",
  stickers,
  spineColor,
  ...props
}) => {
  const [fileObjectUrl, setFileObjectUrl] = useState<string>();

  useEffect(() => {
    if (item?.type === "file") {
      const objectUrl = URL.createObjectURL(item.image);
      setFileObjectUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [item]);

  const renderedImage = useMemo(() => {
    if (item?.type === "file") {
      return (
        <img
          src={fileObjectUrl}
          className={"flex-1 h-full object-cover"}
          alt={`${title} cover image`}
        />
      );
    }
    if (item?.type === "uploaded") {
      return (
        <Image
          className={"flex-1 h-full object-cover"}
          imageId={item.imageId}
          alt={`${title} cover image`}
        />
      );
    }
    if (item?.type === "preset") {
      return (
        <img
          src={item.imageSrc}
          className={"flex-1 h-full object-cover"}
          alt={`${title} cover image`}
        />
      );
    }
    if (item?.type === "empty") {
      return <div className={"flex-1 h-full bg-gray-300"}></div>;
    }

    return null;
  }, [item, fileObjectUrl]);

  return (
    <div
      {...props}
      className={cn("relative aspect-[7/10] w-full", props.className)}
    >
      <div
        className={cn(
          "absolute w-[6%] min-w-[14px] max-w-[26px] h-full rounded-l-xs shrink-0",
          spineColor ? spineColor : "bg-gray-500"
        )}
      />
      <div
        className={cn(
          "w-full h-full flex rounded-r-md bg-gray-300 shadow-md overflow-hidden"
        )}
      >
        {renderedImage}
      </div>
    </div>
  );
};

export default DiaryCover;
