import { cn } from "@/lib/utils/className";
import { AttachedFile } from "@/models/AttachedFile";
import { HTMLAttributes } from "react";
import DiaryCover from "./DiaryCover";

interface DiaryBookProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  memberCount: number;
  pinned: boolean;
  notificationCount: number;
  coverImage?: AttachedFile | null;
  coverColor?: string;
}

const DiaryBook: React.FC<DiaryBookProps> = ({
  title,
  memberCount,
  pinned,
  notificationCount,
  coverImage,
  coverColor,
  ...props
}) => {
  const imageIdToPass = coverImage?.id;

  return (
    <div
      {...props}
      className={cn(
        "flex flex-col w-full justify-center items-center cursor-pointer",
        props.className
      )}
    >
      <DiaryCover
        className={"mb-2"}
        pinned={pinned}
        notificationCount={notificationCount}
        // DiaryCover에는 최종적으로 생성된 이미지 URL(문자열)을 전달
        imageId={imageIdToPass}
        title={title}
        coverColor={coverColor}
      />
      <p className={"text-[13px] font-medium"}>{title}</p>
      <p className={"text-[11px] font-light text-gray-1"}>
        멤버 {memberCount}명
      </p>
    </div>
  );
};

export default DiaryBook;
