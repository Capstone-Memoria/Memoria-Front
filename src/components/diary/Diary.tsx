import { cn } from "@/lib/utils/className";
import { HTMLAttributes } from "react";
import DiaryCover from "./DiaryCover";

interface DiaryProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  memberCount: number;
  pinned: boolean;
  notificationCount: number;
}

const Diary: React.FC<DiaryProps> = ({
  title,
  memberCount,
  pinned,
  notificationCount,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full justify-center items-center",
        props.className
      )}
    >
      <DiaryCover
        className={"mb-2"}
        pinned={pinned}
        notificationCount={notificationCount}
      />
      <p className={"text-[13px] font-medium"}>{title}</p>
      <p className={"text-[11px] font-light text-gray-1"}>
        멤버 {memberCount}명
      </p>
    </div>
  );
};

export default Diary;
