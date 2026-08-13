import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/auth.api';
import { verifyAccountSchema } from '@/features/auth/schemas/auth.schema';
import type { VerifyAccountInput } from '@/features/auth/schemas/auth.schema';

import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface VerifyAccountFormProps {
  email: string;
  onError: (error: string) => void;
  onClearError: () => void;
  onSuccess?: () => void;
}

export const VerifyAccountForm = ({ email, onError, onClearError, onSuccess }: VerifyAccountFormProps) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<VerifyAccountInput>({ resolver: zodResolver(verifyAccountSchema) });

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError<{ error?: string }>(err)) return err.response?.data?.error || err.message;
    if (err instanceof Error) return err.message;
    return 'Ocurrió un error inesperado';
  };

  const onSubmit = async (data: VerifyAccountInput) => {
    setLoading(true);
    onClearError();
    try {
      const res = await authApi.verifyAccount({ email, otp_code: data.otp_code });
      setAuth(res.user, res.token);
      if (onSuccess) onSuccess();
      navigate('/profile');
    } catch (err: unknown) {
      onError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        Hemos enviado un código de 6 dígitos a <br />
        <strong className="text-neutral-900 dark:text-white">{email}</strong>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Controller
            control={form.control}
            name="otp_code"
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                value={field.value ?? ''}
                onChange={(val) => field.onChange(val)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {form.formState.errors.otp_code && (
            <span className="text-[10px] text-red-500 mt-1">{form.formState.errors.otp_code.message}</span>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-5 text-xs">
          {loading ? 'Verificando...' : 'Verificar Cuenta'}
        </Button>
      </form>
    </div>
  );
};
