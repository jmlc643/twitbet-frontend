import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

import { leagueApi } from '@/features/league/api/league.api';
import { createLeagueSchema, type CreateLeagueInput } from '@/features/league/schemas/league.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreateLeagueSuccessView } from './sections/CreateLeagueSuccessView';

export const CreateLeagueForm = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successData, setSuccessData] = useState<{ id: string; slug: string; invite_code: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CreateLeagueInput>({
    resolver: zodResolver(createLeagueSchema),
    defaultValues: {
      name: '',
      initial_balance: 1000,
      max_recharges: 2,
      hide_standings: false,
      min_bets_to_qualify: 0,
    },
  });

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError<{ error?: string }>(err)) return err.response?.data?.error || err.message;
    if (err instanceof Error) return err.message;
    return 'Ocurrió un error inesperado al crear la liga';
  };

  const onSubmit = async (data: CreateLeagueInput) => {
    setLoading(true);
    setApiError('');
    try {
      const res = await leagueApi.createLeague(data);
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
      setSuccessData(res);
    } catch (err: unknown) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (successData) {
      navigator.clipboard.writeText(successData.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (successData) {
    return (
      <CreateLeagueSuccessView 
        inviteCode={successData.invite_code}
        slug={successData.slug}
        copied={copied}
        onCopy={copyToClipboard}
      />
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-neutral-200/50 dark:border-neutral-800/50 text-neutral-900 dark:text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-black uppercase tracking-wide bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
          Crear Nueva Liga
        </CardTitle>
        <CardDescription className="text-neutral-500 dark:text-neutral-400 font-medium">
          Configura las reglas iniciales y desafía a tus amigos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {apiError && (
          <div className="mb-6 p-4 bg-red-950/80 backdrop-blur-sm border border-red-800/50 text-red-200 text-sm rounded-lg font-medium shadow-inner">
            {apiError}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Nombre de la Liga</label>
            <Input
              {...form.register('name')}
              placeholder="Ej. La Liga Fantástica"
              className="bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800 h-11 text-base focus-visible:ring-red-500/30 transition-all duration-200"
            />
            {form.formState.errors.name && (
              <span className="text-[11px] font-medium text-red-500 mt-1 block">{form.formState.errors.name.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Balance Inicial</label>
              <Input
                {...form.register('initial_balance', { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                placeholder="1000"
                className="bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800 h-11 text-base focus-visible:ring-red-500/30 transition-all duration-200"
              />
              {form.formState.errors.initial_balance && (
                <span className="text-[11px] font-medium text-red-500 mt-1 block">{form.formState.errors.initial_balance.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Máx. Recargas</label>
              <Input
                {...form.register('max_recharges', { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="2"
                className="bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800 h-11 text-base focus-visible:ring-red-500/30 transition-all duration-200"
              />
              {form.formState.errors.max_recharges && (
                <span className="text-[11px] font-medium text-red-500 mt-1 block">{form.formState.errors.max_recharges.message}</span>
              )}
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Mín. Apuestas para Calificar (Opcional)</label>
              <Input
                {...form.register('min_bets_to_qualify', { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="0 (Sin mínimo)"
                className="bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800 h-11 text-base focus-visible:ring-red-500/30 transition-all duration-200"
              />
              {form.formState.errors.min_bets_to_qualify && (
                <span className="text-[11px] font-medium text-red-500 mt-1 block">{form.formState.errors.min_bets_to_qualify.message}</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
            <input
              type="checkbox"
              id="hide_standings"
              {...form.register('hide_standings')}
              className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-red-600 focus:ring-red-500 dark:bg-neutral-950 dark:checked:bg-red-600 transition-colors cursor-pointer accent-red-600"
            />
            <label htmlFor="hide_standings" className="text-sm font-medium leading-none cursor-pointer text-neutral-700 dark:text-neutral-300 select-none">
              Ocultar tabla de posiciones
            </label>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-black uppercase py-6 text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all duration-300 transform active:scale-[0.98]"
          >
            {loading ? 'Creando Liga...' : 'Crear Liga'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
