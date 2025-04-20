import { cn } from "@/lib/utils/className";
import { HTMLAttributes } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const variantMap = {
  default: "bg-transparent",
  green: "bg-emerald-500 text-white",
};

interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  variant?: keyof typeof variantMap;
  children?: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({
  variant = "default",
  title,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "flex justify-between items-center rounded-[10px] px-5 py-4",
        variantMap[variant],
        props.className
      )}
    >
      <div className={"flex flex-col gap-0.5"}>
        <div className={"text-[11px]"}>{title}</div>
        <div className={"text-[15px]"}>{children}</div>
      </div>
      <div>
        <FaArrowRightLong />
      </div>
    </div>
  );
};

export default Banner;
