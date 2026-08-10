import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';

import { authApi } from '@/features/auth/api/auth.api';
import { registerSchema } from '@/features/auth/schemas/auth.schema';
import type { RegisterInput } from '@/features/auth/schemas/auth.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VerifyAccountForm } from './VerifyAccountForm';

interface RegisterFormProps {
  onError: (error: string) => void;
  onClearError: () => void;
}

export const RegisterForm = ({ onError, onClearError }: RegisterFormProps) => {
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const registerForm = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError<{ error?: string }>(err)) return err.response?.data?.error || err.message;
    if (err instanceof Error) return err.message;
    return 'Ocurrió un error inesperado';
  };

  const onRegisterSubmit = async (data: RegisterInput) => {
    setLoading(true);
    onClearError();
    try {
      await authApi.register(data);
      setRegisteredEmail(data.email);
    } catch (err: unknown) {
      onError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (registeredEmail) {
    return (
      <VerifyAccountForm
        email={registeredEmail}
        onError={onError}
        onClearError={onClearError}
      />
    );
  }

  return (
    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 mt-4">
      <div>
        <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Usuario</label>
        <Input
          {...registerForm.register('username')}
          placeholder="Golazo99"
          className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
        />
        {registerForm.formState.errors.username && (
          <span className="text-[10px] text-red-500 mt-1">{registerForm.formState.errors.username.message}</span>
        )}
      </div>

      <div>
        <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Correo</label>
        <Input
          {...registerForm.register('email')}
          type="email"
          placeholder="tu@email.com"
          className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
        />
        {registerForm.formState.errors.email && (
          <span className="text-[10px] text-red-500 mt-1">{registerForm.formState.errors.email.message}</span>
        )}
      </div>

      <div>
        <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Contraseña</label>
        <Input
          {...registerForm.register('password')}
          type="password"
          placeholder="••••••••"
          className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
        />
        {registerForm.formState.errors.password && (
          <span className="text-[10px] text-red-500 mt-1">{registerForm.formState.errors.password.message}</span>
        )}
      </div>

      <div>
        <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Confirmar Contraseña</label>
        <Input
          {...registerForm.register('confirm_password')}
          type="password"
          placeholder="••••••••"
          className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
        />
        {registerForm.formState.errors.confirm_password && (
          <span className="text-[10px] text-red-500 mt-1">{registerForm.formState.errors.confirm_password.message}</span>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-5 text-xs">
        {loading ? 'Cargando...' : 'Crear Cuenta'}
      </Button>
    </form>
  );
};
