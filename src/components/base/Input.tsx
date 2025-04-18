import { cn } from "@/lib/utils/className";
import { InputHTMLAttributes, useState } from "react";

export type InputVariant = "default" | "white";

const variantMap = {
  default: "bg-transparent placeholder:text-gray-300",
  white:
    "bg-white px-4 rounded-md placeholder:text-gray-300 mt-1 border border-transparent focus:border-green-500 transition-colors",
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  required?: boolean;
  helperText?: string;
  helperTextClassName?: string;
  isError?: boolean;
  variant?: keyof typeof variantMap;
}

export default function Input({
  className,
  label,
  labelClassName,
  required,
  helperText,
  helperTextClassName,
  isError,
  variant = "default",
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={cn("w-fit", className)}>
      {(label || required) && (
        <div className={cn("text-sm text-gray-500", labelClassName)}>
          {required && <span className={"text-red-500 mr-1"}>*</span>}
          {label}
        </div>
      )}
      <div className={"relative w-full"}>
        <input
          {...props}
          className={cn("w-full py-2 focus:outline-none", variantMap[variant])}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
        />

        <div
          className={cn(
            "absolute bottom-0 left-0 h-[2px] w-full overflow-hidden bg-gray-300",
            {
              hidden: variant !== "default",
            }
          )}
        >
          <div
            className={cn(
              "size-full -translate-x-full bg-black transition-transform duration-700 ease-expo-out",
              {
                "!translate-x-0": focused,
              }
            )}
          />
        </div>
      </div>
      {helperText && (
        <p
          className={cn(
            "mt-1 text-xs",
            { "text-red-500": isError, "text-gray-400": !isError },
            helperTextClassName
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
