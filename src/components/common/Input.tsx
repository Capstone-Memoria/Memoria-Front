import { cn } from "@/lib/utils/className";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
};

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
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
        <input
          className="w-full outline-none placeholder:text-[#B1B1B1]"
          placeholder={placeholder}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
