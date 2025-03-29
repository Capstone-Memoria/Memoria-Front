import { cn } from "@/lib/utils/className";
import React from "react";
import { IoEye } from "react-icons/io5";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  type: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

const Input: React.FC<InputProps> = ({
  value,
  type,
  onChange,
  label,
  error,
  icon,
  disabled,
  placeholder,
  className,
}) => {
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "w-full px-3 py-2 border border-[#CCCCCC] rounded-xl",
          className
        )}
      >
        {label && (
          <label className="flex gap-1 items-center text-[9px] text-[#79716B]">
            {icon && <span>{icon}</span>}
            {label}
          </label>
        )}
        <div className="flex pr-1">
          <input
            className="w-full outline-none placeholder:text-[#B1B1B1]"
            value={value}
            type={type}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
          />
          {type === "password" && <IoEye />}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
