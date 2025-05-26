import { cn } from "@/lib/utils/className";
import { DiaryBook as DiaryBookModel } from "@/models/DiaryBook";
import { HTMLAttributes, useMemo } from "react";
import { FaStar } from "react-icons/fa";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import DiaryCover, { DiaryCoverItem } from "./DiaryCover";
import StickerOverlay from "./StickerOverlay";

interface DiaryBookProps extends HTMLAttributes<HTMLDivElement> {
  diaryBook: DiaryBookModel;
  onMenuClick?: (e: React.MouseEvent, diaryBook: DiaryBookModel) => void;
}

const DiaryBook: React.FC<DiaryBookProps> = ({
  diaryBook,
  onMenuClick,
  ...props
}) => {
  const { title, memberCount, coverImage, isPinned, stickers } = diaryBook;

  const coverItem: DiaryCoverItem | undefined = useMemo(() => {
    return coverImage
      ? {
          type: "uploaded",
          imageId: coverImage.id,
        }
      : {
          type: "empty",
        };
  }, [coverImage]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (onMenuClick) {
      onMenuClick(e, diaryBook);
    }
  };

  return (
    <div
      {...props}
      className={cn(
        "flex flex-col w-full justify-center items-center cursor-pointer",
        props.className
      )}
    >
      <div className={"relative w-full h-full"}>
        <DiaryBookPin pinned={isPinned} />
        <StickerOverlay stickers={stickers ?? []}>
          <DiaryCover
            className={"mb-2"}
            title={title}
            item={coverItem}
            spineColor={diaryBook.spineColor}
          />
        </StickerOverlay>
      </div>
      <div className={"w-full flex justify-between items-center"}>
        <div>
          <p className={"text-[13px] font-medium"}>{title}</p>
          <p className={"text-[11px] font-light text-gray-1"}>
            멤버 {memberCount}명
          </p>
        </div>
        <PiDotsThreeCircleFill
          className={"text-lg text-gray-400 cursor-pointer"}
          onClick={handleMenuClick}
        />
      </div>
    </div>
  );
};

export default DiaryBook;

//--- Local Components ---

const DiaryBookPin: React.FC<{ pinned?: boolean }> = ({ pinned }) => {
  if (!pinned) {
    return null;
  }

  return (
    <div
      className={
        "absolute top-0 left-[6px] rounded-t-[2px] -translate-y-[14px] px-[4px] pt-[3px] pb-[4px] bg-[#FFE539]"
      }
    >
      <FaStar className={"fill-gray-2 text-[7px]"} />
    </div>
  );
};

//TODO: 현재는 안읽은 일기 목록 기능이 없음.
const NotificationOverlay: React.FC<{ notifications?: number }> = ({
  notifications,
}) => {
  if (!notifications) {
    return null;
  }

  return (
    <div
      className={
        "absolute top-0 right-0 min-w-5 h-5 translate-x-[calc(50%-3px)] -translate-y-[calc(50%-4px)] flex items-center justify-center bg-red-500 text-white font-normal text-[8px] p-1 rounded-full"
      }
    >
      {notifications > 99 ? "99+" : notifications}
    </div>
  );
};
