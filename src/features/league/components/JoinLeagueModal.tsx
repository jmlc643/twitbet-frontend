import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { leagueApi } from '@/features/league/api/league.api';
import { joinLeagueSchema, type JoinLeagueInput } from '@/features/league/schemas/league.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const JoinLeagueModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<JoinLeagueInput>({
    resolver: zodResolver(joinLeagueSchema),
    defaultValues: {
      invite_code: '',
    },
  });

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError<{ error?: string }>(err)) return err.response?.data?.error || err.message;
    if (err instanceof Error) return err.message;
    return 'Ocurrió un error inesperado al unirse a la liga';
  };

  const onSubmit = async (data: JoinLeagueInput) => {
    setLoading(true);
    setApiError('');
    try {
      const res = await leagueApi.joinLeague(data);
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
      setSuccessMessage(`¡Bienvenido a ${res.league_name}!`);
      setTimeout(() => {
        setOpen(false);
        navigate(`/leagues/${res.slug}`);
      }, 2000);
    } catch (err: unknown) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      setApiError('');
      setSuccessMessage('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-neutral-300 dark:bg-[#2A2A2A] dark:hover:bg-[#333333] dark:border-white/10 dark:text-white font-bold uppercase py-5 rounded-xl text-sm shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          Unirse a Liga
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-neutral-200/50 dark:border-neutral-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
        <DialogHeader className="text-center sm:text-center pb-2">
          {successMessage ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight text-green-600 dark:text-green-400">
                {successMessage}
              </DialogTitle>
              <DialogDescription className="text-neutral-500 dark:text-neutral-400 font-medium">
                Preparando tu entrada a la liga...
              </DialogDescription>
            </div>
          ) : (
            <>
              <DialogTitle className="text-2xl font-black uppercase tracking-wide bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent text-center">
                Unirse a una Liga
              </DialogTitle>
              <DialogDescription className="text-neutral-500 dark:text-neutral-400 font-medium text-center">
                Ingresa el código de 8 caracteres que te han compartido.
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {!successMessage && (
          <div className="px-1">
            {apiError && (
              <div className="mb-6 p-4 bg-red-950/80 backdrop-blur-sm border border-red-800/50 text-red-200 text-sm rounded-lg font-medium shadow-inner text-center">
                {apiError}
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
              <div className="space-y-2 text-center">
                <Input
                  {...form.register('invite_code', {
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase();
                    }
                  })}
                  placeholder="EJ: A1B2C3D4"
                  maxLength={8}
                  className="bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 h-14 text-center text-2xl font-mono font-black tracking-widest uppercase focus-visible:ring-neutral-500/30 transition-all duration-200 placeholder:text-neutral-400/50"
                />
                {form.formState.errors.invite_code && (
                  <span className="text-[11px] font-medium text-red-500 block">{form.formState.errors.invite_code.message}</span>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-black uppercase py-6 text-sm shadow-lg transition-all duration-300 transform active:scale-[0.98]"
              >
                {loading ? 'Verificando...' : 'Entrar a la Liga'}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
