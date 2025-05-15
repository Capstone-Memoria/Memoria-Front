import { cn } from "@/lib/utils/className";
import { HTMLAttributes, useEffect, useMemo, useState } from "react";
import Image from "../base/Image";

type BaseDiaryCoverItem = {
  coverColor: string;
};

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
  item?: DiaryCoverItem;
  title?: string;
}

const DiaryCover: React.FC<DiaryCoverProps> = ({
  item,
  title = "Diary Cover",
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

    return null;
  }, [item, fileObjectUrl]);

  return (
    <div
      {...props}
      className={cn("relative aspect-[7/10] w-full", props.className)}
    >
      <div
        className={cn(
          "absolute w-[6%] min-w-[6px] max-w-[12px] h-full rounded-l-xs shrink-0",
          item?.coverColor
        )}
      />
      <div
        className={cn(
          "w-full h-full flex rounded-r-md bg-gray-300 shadow-md overflow-hidden" // 시각적 스타일 + overflow-hidden 적용
        )}
      >
        {renderedImage}
      </div>
    </div> // 바깥쪽 div 끝
  );
};

export default DiaryCover;
