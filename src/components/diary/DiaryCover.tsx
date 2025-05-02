import { cn } from "@/lib/utils/className";
import { HTMLAttributes } from "react";
import { FaStar } from "react-icons/fa";

interface DiaryCoverProps extends HTMLAttributes<HTMLDivElement> {
  pinned?: boolean;
  showPin?: boolean;
  notificationCount?: number;
  coverColor?: string;
  imageSrc?: string | null;
}

const DiaryCover: React.FC<DiaryCoverProps> = ({
  pinned = false,
  showPin = true,
  coverColor = "bg-green-500",
  notificationCount,
  imageSrc,
  ...props
}) => {
  return (
    // 1. 바깥쪽 div: 크기(w, h)와 상대 위치(relative)만 담당
    <div {...props} className={cn("w-22 h-32 relative", props.className)}>
      {/* 2. 내부 래퍼 div: 시각적 요소(배경, 그림자, 라운딩)와 내용(flex, overflow) 담당 */}
      <div
        className={cn(
          "w-full h-full flex rounded-r-md bg-gray-300 shadow-md overflow-hidden" // 시각적 스타일 + overflow-hidden 적용
        )}
      >
        {/* 표지 꾸미기에서 바뀌는 부분 (색상 바) */}
        <div
          className={cn(
            "w-[6%] min-w-[6px] max-w-[12px] h-full rounded-l-xs shrink-0",
            coverColor
          )}
        />

        {/* 이미지가 있을 경우에만 렌더링 */}
        {imageSrc && (
          <img
            src={imageSrc}
            className={"flex-1 h-full object-cover"} // 이미지 스타일 유지
            alt={"Diary cover"}
          />
        )}
      </div>{" "}
      {/* 내부 래퍼 div 끝 */}
      {/* 3. Absolute 위치 요소들: 바깥쪽 div 기준으로 위치하여 잘리지 않음 */}
      {showPin && pinned ? (
        <div
          className={
            "absolute top-0 left-[6px] rounded-t-[2px] -translate-y-[14px] px-[4px] pt-[3px] pb-[4px] bg-[#FFE539]"
          }
        >
          <FaStar className={"fill-gray-2 text-[7px]"} />
        </div>
      ) : null}
      {!!notificationCount && notificationCount > 0 && (
        <div
          className={
            "absolute top-0 right-0 min-w-5 h-5 translate-x-[calc(50%-3px)] -translate-y-[calc(50%-4px)] flex items-center justify-center bg-red-500 text-white font-normal text-[8px] p-1 rounded-full"
          }
        >
          {notificationCount > 99 ? "99+" : notificationCount}
        </div>
      )}
    </div> // 바깥쪽 div 끝
  );
};

export default DiaryCover;
