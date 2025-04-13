import { cn } from "@/lib/utils/className";
import { HTMLAttributes } from "react";
import { FaStar } from "react-icons/fa";

interface DiaryCoverProps extends HTMLAttributes<HTMLDivElement> {
  pinned?: boolean;
  showPin?: boolean;
  notificationCount?: number;
  coverColor?: string;
}

const DiaryCover: React.FC<DiaryCoverProps> = ({
  pinned = false,
  showPin = true,
  coverColor = "bg-green-500",
  notificationCount,
  ...props
}) => {
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
      {showPin && pinned ? (
        <div
          className={
            "absolute top-0 left-[6px] rounded-t-[2px] -translate-y-[14px] px-[4px] pt-[3px] pb-[4px] bg-[#FFE539]"
          }
        >
          <FaStar className={"fill-gray-2 text-[7px]"} />
        </div>
      ) : (
        <></>
      )}
      {!!notificationCount && notificationCount > 0 && (
        <div
          className={
            "absolute top-0 right-0 min-w-5 h-5 translate-x-[calc(50%-3px)] -translate-y-[calc(50%-4px)] flex items-center justify-center bg-red-500 text-white font-normal text-[8px] p-1 rounded-full"
          }
        >
          {notificationCount > 99 ? "99+" : notificationCount}
        </div>
      )}
    </div>
  );
};

export default DiaryCover;
