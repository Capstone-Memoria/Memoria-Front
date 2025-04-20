import CommentIcon from "@/assets/svgs/Comment";
import { cn } from "@/lib/utils";
import { Diary } from "@/models/Diary";
import { HTMLAttributes } from "react";
import { IoMdHeart } from "react-icons/io";

interface DiaryListItemProps extends HTMLAttributes<HTMLDivElement> {
  item: Diary;
}

const DiaryListItem: React.FC<DiaryListItemProps> = ({ item, ...props }) => {
  return (
    <div {...props} className={cn("flex bg-white", props.className)}>
      <div className={"flex-shrink-0 size-24 aspect-square bg-gray-200"} />
      <div className={"flex flex-1 flex-col gap-1 pl-3 pt-2 pb-1"}>
        <div className={"text-sm mb-1.5 font-medium"}>{item.title}</div>
        <div className={"text-xs font-light mb-3"}>{item.summary}</div>
        <div className={"flex text-[10px] items-center gap-3"}>
          <div className={"flex items-center gap-1"}>
            <IoMdHeart className={"text-xs"} />
            <div>{item.likeCount}</div>
          </div>
          <div className={"flex justify-center items-center gap-1"}>
            <CommentIcon className={"size-[9px]"} />
            <div>{item.commentCount}</div>
          </div>
        </div>
      </div>
      <div
        className={
          "flex justify-center items-end text-[10px] pr-2.5 pb-2 gap-1"
        }
      >
        <div>{item.createdBy.nickName}, </div>
        <div>{item.createAt.toRelative()}</div>
      </div>
    </div>
  );
};

export default DiaryListItem;
