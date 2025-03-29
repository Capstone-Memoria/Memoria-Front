import { cn } from "@/lib/utils/className";

type Props = {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const Button: React.FC<Props> = ({
  children,
  className,
  onClick,
  ...props
}) => {
  return (
    <button
      className={cn(
        "w-full px-4 py-3 text-white bg-[#44403B] border border-[#44403B] cursor-pointer rounded-xl",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
