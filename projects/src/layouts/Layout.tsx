import { cn } from '@/lib/utils/className';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ className, children }) => {
  return (
    <div className={cn('mx-auto w-[450px] bg-sky-200', className)}>
      {children}
    </div>
  );
};

export default Layout;
