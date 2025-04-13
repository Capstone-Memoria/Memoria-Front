import { cn } from "@/lib/utils/className";
import { InputHTMLAttributes, useState } from "react";

export type InputVariant = "default" | "white";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  required?: boolean;
  helperText?: string;
  helperTextClassName?: string;
  isError?: boolean;
  variant?: InputVariant; // 추가된 프로퍼티
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

  // variant에 따라 다른 스타일을 적용합니다.
  const baseClasses =
    variant === "white"
      ? "w-full bg-white placeholder:text-gray-300 py-2 px-3 border-none rounded-sm focus:outline-none"
      : "w-full bg-transparent placeholder:text-gray-2 py-2 focus:outline-none";

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
          className={cn(baseClasses)}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
        />
        {/* 기본 variant일 때만 밑에 애니메이션 바를 노출 */}
        {variant !== "white" && (
          <div
            className={
              "absolute bottom-0 left-0 h-[2px] w-full overflow-hidden bg-gray-300"
            }
          >
            <div
              className={cn(
                "w-full -translate-x-full bg-black transition-transform duration-700 ease-expo-out",
                {
                  "!translate-x-0": focused,
                }
              )}
            />
          </div>
        )}
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
