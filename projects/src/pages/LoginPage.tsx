import { cn } from '@/lib/utils/className';

type Props = {
  className?: string;
};

const LoginPage: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('w-full text-center', className)}>
      <h1>Login</h1>
    </div>
  );
};

export default LoginPage;
