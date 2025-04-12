import { cn } from "@/lib/utils/className";
import { InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  helperText?: string;
  helperTextClassName?: string;
  isError?: boolean;
}

export default function Input({
  className,
  label,
  required,
  helperText,
  helperTextClassName,
  isError,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={cn("w-fit", className)}>
      {(label || required) && (
        <div className={"text-sm text-gray-500"}>
          {required && <span className={"text-red-500"}>*</span>}
          {label}
        </div>
      )}
      <div className={cn("relative w-full")}>
        <input
          {...props}
          className={cn(
            "w-full bg-transparent placeholder:text-gray-2 py-2 focus:outline-none"
          )}
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
          className={
            "absolute bottom-0 left-0 h-[2px] w-full overflow-hidden bg-gray-300"
          }
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
            "mt-1 text-xs text-gray-400",
            {
              "text-red-500": isError,
            },
            helperTextClassName
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
