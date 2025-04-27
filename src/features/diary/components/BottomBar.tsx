import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

const BottomBar: React.FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  return (
    <div {...props} className={cn("bg-gray-200", props.className)}>
      {/* BottomBar 컴포넌트 내용 */}
    </div>
  );
};

export default BottomBar;
