import { cn } from "@/lib/utils/className";
import { HTMLAttributes, useState } from "react";
import { TbPinned, TbPinnedFilled } from "react-icons/tb";

interface DiaryCoverProps extends HTMLAttributes<HTMLDivElement> {
  pinned?: boolean;
  showPin?: boolean;
  notificationCount?: number;
  coverColor?: string;
}

const DiaryCover: React.FC<DiaryCoverProps> = ({
  pinned: initialPinned = false,
  showPin = true,
  coverColor = "bg-green-500",
  ...props
}) => {
  const [pinned, setPinned] = useState(initialPinned);

  const handlePinClick = () => {
    // 핀 클릭 시 처리할 로직을 여기에 작성합니다.
    // 예를 들어, 핀 상태를 변경하는 API 호출 등을 수행할 수 있습니다.
    setPinned(!pinned);
  };

  return (
    <div
      {...props}
      className={cn(
        "w-22 h-32 flex relative rounded-r-md bg-gray-300 shadow-md",
        props.className
      )}
    >
      {/* 표지 꾸미기에서 바뀌는 부분 */}
      <div
        className={cn(
          "w-[6%] min-w-[6px] max-w-[12px] h-full rounded-l-xs",
          coverColor
        )}
      ></div>
      {showPin && (
        <div
          className={"absolute top-2 right-2 bg-transparent"}
          onClick={handlePinClick}
        >
          {pinned ? <TbPinnedFilled /> : <TbPinned />}
        </div>
      )}

      {!!props.notificationCount && props.notificationCount > 0 && (
        <div
          className={
            "absolute top-0 right-0 min-w-4.5 h-4.5 translate-x-[calc(50%-3px)] -translate-y-[calc(50%-4px)] flex items-center justify-center bg-red-500 text-white font-normal text-[8px] p-1 rounded-full"
          }
        >
          {props.notificationCount}
        </div>
      )}
    </div>
  );
};

export default DiaryCover;
