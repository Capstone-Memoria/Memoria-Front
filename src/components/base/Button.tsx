import { cn } from "@/lib/utils/className";
import { ButtonHTMLAttributes, useMemo } from "react";

const ButtonVariants = {
  primary: "bg-black text-white rounded-xl",
  secondary: "bg-gray-300 text-black rounded-md",
};

const ButtonSizes = {
  xs: "px-2 py-1 text-[11px]",
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-base",
};

const DisabledVariants = {
  primary: "bg-gray-300 text-gray-500 rounded-xl",
  secondary: "bg-gray-200 text-gray-400 rounded-md",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof ButtonVariants;
  size?: keyof typeof ButtonSizes;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  disabled,
  className,
  size = "md",
  ...props
}) => {
  const variantClasses = useMemo(() => {
    if (disabled) {
      return DisabledVariants[variant];
    }
    return ButtonVariants[variant];
  }, [variant, disabled]);
  const sizeClasses = ButtonSizes[size];

  return (
    <button
      {...props}
      className={cn(
        "focus:outline-none cursor-pointer transition-all active:scale-95",
        variantClasses,
        sizeClasses,
        className
      )}
    >
      {props.children}
    </button>
  );
};

export default Button;
