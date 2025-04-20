import WriteIcon from "@/assets/svgs/WrtieIcon";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface DiaryWriteButtonProps extends HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
}

const DiaryWriteButton: React.FC<DiaryWriteButtonProps> = ({
  onClick,
  ...props
}) => {
  return (
    <div>
      <button
        className={cn(
          "size-12 bg-black flex justify-center items-center rounded-full text-white",
          props.className
        )}
        onClick={onClick}
      >
        <WriteIcon />
      </button>
    </div>
  );
};

export default DiaryWriteButton;
