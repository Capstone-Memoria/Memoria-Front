import { cn } from "@/lib/utils/className";
import { HTMLAttributes } from "react";

const Card: React.FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  return (
    <div
      {...props}
      className={cn("bg-white rounded-xl p-4", props.className)}
    />
  );
};

export default Card;
