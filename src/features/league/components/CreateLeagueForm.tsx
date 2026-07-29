import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { leagueApi } from '@/features/league/api/league.api';
import { createLeagueSchema, type CreateLeagueInput } from '@/features/league/schemas/league.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const CreateLeagueForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successData, setSuccessData] = useState<{ id: string; invite_code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<CreateLeagueInput>({
    resolver: zodResolver(createLeagueSchema),
    defaultValues: {
      name: '',
      initial_balance: 1000,
      max_recharges: 2,
      hide_standings: false,
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
      <Card className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-neutral-200/50 dark:border-neutral-800/50 text-neutral-900 dark:text-white shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-green-600 dark:text-green-400">
            ¡Liga Creada con Éxito!
          </CardTitle>
          <CardDescription className="text-neutral-500 dark:text-neutral-400">
            Comparte este código con tus amigos para que se unan a tu liga.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          <div className="p-6 bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase mb-2">Código de Invitación</p>
            <p className="text-4xl font-black tracking-widest text-neutral-800 dark:text-neutral-200">
              {successData.invite_code}
            </p>
          </div>
          <Button
            onClick={copyToClipboard}
            className={`w-full font-bold uppercase py-6 text-sm transition-all duration-300 ${
              copied 
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)]' 
                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25'
            }`}
          >
            {copied ? '¡Copiado!' : 'Copiar Código'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/profile')}
            className="w-full font-bold uppercase py-6 text-sm border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Ir a mi perfil
          </Button>
        </CardContent>
      </Card>
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
