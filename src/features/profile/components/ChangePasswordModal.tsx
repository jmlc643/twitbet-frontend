import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/auth.api';
import { changePasswordSchema } from '@/features/auth/schemas/auth.schema';
import type { ChangePasswordInput } from '@/features/auth/schemas/auth.schema';

export const ChangePasswordModal = () => {
  const { token } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  const handleSubmit = async (data: ChangePasswordInput) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await authApi.changePassword(data, token);
      setSuccess(res.message || 'Contraseña actualizada exitosamente.');
      form.reset();
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(null);
      }, 2000);
    } catch (err: unknown) {
      if (isAxiosError<{ error?: string }>(err)) {
        setError(err.response?.data?.error || 'Error al cambiar la contraseña');
      } else {
        setError('Error al cambiar la contraseña');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
      setError(null);
      setSuccess(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <KeyRound size={14} /> <span className="hidden sm:inline">Cambiar Contraseña</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-neutral-900 dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Cambiar Contraseña</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-semibold mb-2 block">Contraseña Actual</label>
            <Input
              {...form.register('old_password')}
              type="password"
              placeholder="••••••••"
              className="bg-neutral-50 dark:bg-neutral-800"
            />
            {form.formState.errors.old_password && (
              <span className="text-[10px] text-red-500 mt-1 block">{form.formState.errors.old_password.message}</span>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Nueva Contraseña</label>
            <Input
              {...form.register('new_password')}
              type="password"
              placeholder="••••••••"
              className="bg-neutral-50 dark:bg-neutral-800"
            />
            {form.formState.errors.new_password && (
              <span className="text-[10px] text-red-500 mt-1 block">{form.formState.errors.new_password.message}</span>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Confirmar Nueva Contraseña</label>
            <Input
              {...form.register('confirm_password')}
              type="password"
              placeholder="••••••••"
              className="bg-neutral-50 dark:bg-neutral-800"
            />
            {form.formState.errors.confirm_password && (
              <span className="text-[10px] text-red-500 mt-1 block">{form.formState.errors.confirm_password.message}</span>
            )}
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          {success && <p className="text-sm text-green-600 font-medium">{success}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-neutral-800 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
