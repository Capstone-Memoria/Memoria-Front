import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { BsChat } from "react-icons/bs";
import { IoHeartOutline } from "react-icons/io5";

const BottomBar: React.FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        "bg-gray-200 h-12 flex items-center px-8 gap-6 font-light",
        props.className
      )}
    >
      {/* BottomBar 컴포넌트 내용 */}
      <div className={"flex items-center gap-2"}>
        <IoHeartOutline className={"size-5"} />
        <div>2</div>
      </div>
      <div className={"flex items-center gap-2"}>
        <BsChat className={"size-4.5"} />
        <div>10</div>
      </div>
    </div>
  );
};

export default BottomBar;
