import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { ImSpinner8 } from "react-icons/im";

const Spinner: React.FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  return (
    <div {...props} className={cn("text-gray-500", props.className)}>
      <ImSpinner8 className={cn("animate-spin ")} />
    </div>
  );
};
export default Spinner;
