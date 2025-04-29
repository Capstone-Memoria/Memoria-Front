import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { BsChatFill } from "react-icons/bs";
import { FaSurprise } from "react-icons/fa";
import { PiHandsClappingFill } from "react-icons/pi";
import { RiEmotionLaughFill, RiEmotionSadFill } from "react-icons/ri";

interface BottomBarProps extends HTMLAttributes<HTMLDivElement> {
  onCommentClick?: () => void;
}

const dummyEmotions = [
  {
    icon: <RiEmotionLaughFill className={"text-xl text-blue-500"} />,
    color: "text-blue-500",
    backgroundColor: "bg-blue-100",
    count: 2,
  },
  {
    icon: <PiHandsClappingFill className={"text-xl text-yellow-500"} />,
    color: "text-yellow-500",
    backgroundColor: "bg-yellow-100",

    count: 4,
  },
  {
    icon: <RiEmotionSadFill className={"text-xl text-red-500"} />,
    color: "text-red-500",
    backgroundColor: "bg-red-100",
    count: 4,
  },
  {
    icon: <FaSurprise className={"text-xl text-gray-500"} />,
    color: "text-gray-500",
    backgroundColor: "bg-gray-200",
    count: 4,
  },
];

const BottomBar: React.FC<BottomBarProps> = ({ onCommentClick, ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        "h-12 flex items-center px-3 gap-4 font-light border m-4 rounded-xl shadow-lg",
        props.className
      )}
    >
      <div className={"flex gap-2"}>
        {dummyEmotions.map((emotion, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 ${emotion.backgroundColor} px-2 py-1 rounded-full`}
          >
            {emotion.icon}
            <div className={cn("text-sm", emotion.color)}>{emotion.count}</div>
          </div>
        ))}
      </div>
      <div className={"flex-1 h-fit justify-end flex"}>
        <div className={"h-6 bg-gray-500 w-px"} />
      </div>
      <div
        className={"flex items-center gap-2 text-gray-700"}
        onClick={onCommentClick}
      >
        <BsChatFill className={""} />
        <div>10</div>
      </div>
    </div>
  );
};

export default BottomBar;
