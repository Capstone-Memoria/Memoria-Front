import { cn } from "@/lib/utils/className";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

const Button: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "w-full px-4 py-3 text-white bg-[#44403B] border border-[#44403B] cursor-pointer rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
