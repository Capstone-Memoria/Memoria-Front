import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import { IoCheckmark, IoWarning } from "react-icons/io5";
import { MdClose, MdError } from "react-icons/md";

type VariantStyles = {
  containerClassName: string;
  icon: ReactNode;
  iconClassName: string;
};

type Variant = "info" | "warn" | "error" | "success";

const variantMap: Record<Variant, VariantStyles> = {
  info: {
    containerClassName: "bg-blue-50",
    icon: <IoMdInformationCircle />,
    iconClassName: "text-blue-500",
  },
  warn: {
    containerClassName: "bg-yellow-50",
    icon: <IoWarning />,
    iconClassName: "text-yellow-400",
  },
  error: {
    containerClassName: "bg-red-50 ",
    icon: <MdError />,
    iconClassName: "text-red-400",
  },
  success: {
    containerClassName: "bg-green-50 ",
    icon: <IoCheckmark />,
    iconClassName: "text-green-400",
  },
};

interface SectionMessageProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantMap;
  title: string;
  disposable?: boolean;
  onDispose?: () => void;
}

const SectionMessage: React.FC<SectionMessageProps> = ({
  variant = "info",
  title,
  children,
  disposable = false,
  onDispose,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "grid grid-cols-[auto_1fr_auto] px-4 py-3 gap-x-3 gap-y-1 rounded-md",
        variantMap[variant].containerClassName,
        props.className
      )}
    >
      <div
        className={cn(
          "text-lg flex items-center",
          variantMap[variant].iconClassName
        )}
      >
        {variantMap[variant].icon}
      </div>
      <div className={"flex items-center font-medium"}>{title}</div>
      <div>
        {disposable && (
          <button
            className={"text-gray-500 hover:text-gray-700"}
            onClick={onDispose}
          >
            <MdClose />
          </button>
        )}
      </div>
      <div />
      <div
        className={cn("text-sm ", {
          "text-red-500": variant === "error",
          "text-gray-600": variant !== "error",
        })}
      >
        {children}
      </div>
      <div />
    </div>
  );
};

export default SectionMessage;
