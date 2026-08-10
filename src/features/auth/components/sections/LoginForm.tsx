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

import { VerifyAccountForm } from './VerifyAccountForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface LoginFormProps {
  onError: (error: string) => void;
  onClearError: () => void;
}

export const LoginForm = ({ onError, onClearError }: LoginFormProps) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);

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
      if (isAxiosError(err) && err.response?.status === 403) {
        setUnverifiedEmail(data.email);
        onError('Por favor verifica tu cuenta para poder iniciar sesión.');
      } else {
        onError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  if (unverifiedEmail) {
    return (
      <VerifyAccountForm
        email={unverifiedEmail}
        onError={onError}
        onClearError={onClearError}
      />
    );
  }

  if (showForgot) {
    return (
      <ForgotPasswordForm
        onError={onError}
        onClearError={onClearError}
        onSuccess={() => {
          setShowForgot(false);
          onClearError();
        }}
        onCancel={() => setShowForgot(false)}
      />
    );
  }

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
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-[11px] text-red-600 hover:text-red-500 font-semibold"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-5 text-xs">
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};
