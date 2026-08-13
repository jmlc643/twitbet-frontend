import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';

import { authApi } from '@/features/auth/api/auth.api';
import { forgotPasswordSchema, verifyResetOtpSchema, resetPasswordSchema } from '@/features/auth/schemas/auth.schema';
import type { ForgotPasswordInput, VerifyResetOtpInput, ResetPasswordInput } from '@/features/auth/schemas/auth.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface ForgotPasswordFormProps {
  onError: (error: string) => void;
  onClearError: () => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ForgotPasswordForm = ({ onError, onClearError, onSuccess, onCancel }: ForgotPasswordFormProps) => {
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const requestForm = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });
  const verifyForm = useForm<VerifyResetOtpInput>({ resolver: zodResolver(verifyResetOtpSchema) });
  const resetForm = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError<{ error?: string }>(err)) return err.response?.data?.error || err.message;
    if (err instanceof Error) return err.message;
    return 'Ocurrió un error inesperado';
  };

  const onRequestSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true);
    onClearError();
    try {
      await authApi.forgotPassword(data);
      setEmail(data.email);
      setStep('verify');
    } catch (err: unknown) {
      onError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onVerifySubmit = async (data: VerifyResetOtpInput) => {
    setLoading(true);
    onClearError();
    try {
      await authApi.verifyResetOtp({ email, otp_code: data.otp_code });
      setOtpCode(data.otp_code);
      setStep('reset');
    } catch (err: unknown) {
      onError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetPasswordInput) => {
    setLoading(true);
    onClearError();
    try {
      await authApi.resetPassword({ email, otp_code: otpCode, new_password: data.new_password, confirm_password: data.confirm_password });
      onSuccess();
    } catch (err: unknown) {
      onError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (step === 'reset') {
    return (
      <div className="space-y-4 mt-4">
        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          Ingresa tu nueva contraseña
        </div>
        <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Nueva Contraseña</label>
            <Input
              {...resetForm.register('new_password')}
              type="password"
              placeholder="••••••••"
              className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
            />
            {resetForm.formState.errors.new_password && (
              <span className="text-[10px] text-red-500 mt-1">{resetForm.formState.errors.new_password.message}</span>
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Confirmar Contraseña</label>
            <Input
              {...resetForm.register('confirm_password')}
              type="password"
              placeholder="••••••••"
              className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
            />
            {resetForm.formState.errors.confirm_password && (
              <span className="text-[10px] text-red-500 mt-1">{resetForm.formState.errors.confirm_password.message}</span>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-5 text-xs">
            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel} className="w-full text-xs">
            Cancelar
          </Button>
        </form>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="space-y-4 mt-4">
        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          Ingresa el código enviado a <strong className="text-neutral-900 dark:text-white">{email}</strong>
        </div>
        <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2 mb-4">
            <Controller
              control={verifyForm.control}
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
            {verifyForm.formState.errors.otp_code && (
              <span className="text-[10px] text-red-500 mt-1">{verifyForm.formState.errors.otp_code.message}</span>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-5 text-xs">
            {loading ? 'Verificando...' : 'Verificar Código'}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel} className="w-full text-xs">
            Cancelar
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4 mt-4">
      <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        Ingresa tu correo para recibir un código de recuperación.
      </div>
      <div>
        <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Correo</label>
        <Input
          {...requestForm.register('email')}
          type="email"
          placeholder="tu@email.com"
          className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
        />
        {requestForm.formState.errors.email && (
          <span className="text-[10px] text-red-500 mt-1">{requestForm.formState.errors.email.message}</span>
        )}
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-5 text-xs">
        {loading ? 'Enviando...' : 'Enviar Código'}
      </Button>
      <Button type="button" variant="ghost" onClick={onCancel} className="w-full text-xs">
        Volver a Iniciar Sesión
      </Button>
    </form>
  );
};
