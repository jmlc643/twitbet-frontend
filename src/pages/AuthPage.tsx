import { AuthFormCard } from '@/features/auth/components/AuthFormCard';

export const AuthPage = () => {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
      <div className="w-full max-w-md">
        <AuthFormCard />
      </div>
    </div>
  );
};
