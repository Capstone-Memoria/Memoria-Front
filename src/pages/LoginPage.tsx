import { cn } from '@/lib/utils/className';

type Props = {
  className?: string;
};

const LoginPage: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('h-screen w-full text-center', className)}>
      <h1>메모리아</h1>
    </div>
  );
};

export default LoginPage;
