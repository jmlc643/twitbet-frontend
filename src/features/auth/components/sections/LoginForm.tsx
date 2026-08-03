import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/auth.api';
import { loginSchema } from '@/features/auth/schemas/auth.schema';
import type { LoginInput } from '@/features/auth/schemas/auth.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginFormProps {
  onError: (error: string) => void;
  onClearError: () => void;
}

export const LoginForm = ({ onError, onClearError }: LoginFormProps) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError<{ error?: string }>(err)) return err.response?.data?.error || err.message;
    if (err instanceof Error) return err.message;
    return 'Ocurrió un error inesperado';
  };

  const onLoginSubmit = async (data: LoginInput) => {
    setLoading(true);
    onClearError();
    try {
      const res = await authApi.login(data);
      setAuth(res.user, res.token);
      navigate('/profile');
    } catch (err: unknown) {
      onError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 mt-4">
      <div>
        <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Correo</label>
        <Input
          {...loginForm.register('email')}
          type="email"
          placeholder="tu@email.com"
          className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
        />
        {loginForm.formState.errors.email && (
          <span className="text-[10px] text-red-500 mt-1">{loginForm.formState.errors.email.message}</span>
        )}
      </div>

      <div>
        <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Contraseña</label>
        <Input
          {...loginForm.register('password')}
          type="password"
          placeholder="••••••••"
          className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
        />
        {loginForm.formState.errors.password && (
          <span className="text-[10px] text-red-500 mt-1">{loginForm.formState.errors.password.message}</span>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-5 text-xs">
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};
