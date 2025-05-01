import { cn } from "@/lib/utils/className";
import { HTMLAttributes } from "react";
import DiaryCover from "./DiaryCover";

interface DiaryBookProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  memberCount: number;
  pinned: boolean;
  notificationCount: number;
  coverImage?: string;
}

const DiaryBook: React.FC<DiaryBookProps> = ({
  title,
  memberCount,
  pinned,
  notificationCount,
  coverImage,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col w-full justify-center items-center",
        props.className
      )}
    >
      <DiaryCover
        className={"mb-2"}
        pinned={pinned}
        notificationCount={notificationCount}
        imageSrc={coverImage}
      />
      <p className={"text-[13px] font-medium"}>{title}</p>
      <p className={"text-[11px] font-light text-gray-1"}>
        멤버 {memberCount}명
      </p>
    </div>
  );
};

export default DiaryBook;
