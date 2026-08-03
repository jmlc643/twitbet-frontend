import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { leagueApi } from '@/features/league/api/league.api';
import { updateLeagueSchema, type UpdateLeagueInput } from '@/features/league/schemas/league.schema';
import type { GetLeagueDetailsResponse } from '@/features/league/types/league.types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EditLeagueModalProps {
  league: GetLeagueDetailsResponse;
}

export const EditLeagueModal = ({ league }: EditLeagueModalProps) => {
  const [open, setOpen] = useState(false);
  const [apiError, setApiError] = useState('');
  const queryClient = useQueryClient();

  const form = useForm<UpdateLeagueInput>({
    resolver: zodResolver(updateLeagueSchema),
    defaultValues: {
      name: league.name,
      initial_balance: league.initial_balance,
      max_recharges: league.max_recharges,
      hide_standings: !league.is_ranking_visible,
    },
  });

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError<{ error?: string }>(err)) return err.response?.data?.error || err.message;
    if (err instanceof Error) return err.message;
    return 'Ocurrió un error inesperado al editar la liga';
  };

  const mutation = useMutation({
    mutationFn: (data: UpdateLeagueInput) => leagueApi.updateLeague(league.league_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league', league.league_id] });
      setOpen(false);
    },
    onError: (err) => {
      setApiError(getErrorMessage(err));
    }
  });

  const onSubmit = (data: UpdateLeagueInput) => {
    setApiError('');
    mutation.mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset({
        name: league.name,
        initial_balance: league.initial_balance,
        max_recharges: league.max_recharges,
        hide_standings: !league.is_ranking_visible,
      });
      setApiError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:hover:bg-indigo-900/30 dark:border-indigo-500/30 dark:text-indigo-300 transition-colors">
          <Settings className="w-4 h-4 mr-2" />
          Editar Ajustes
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-neutral-200/50 dark:border-neutral-800/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
            Editar Liga
          </DialogTitle>
          <DialogDescription>
            Modifica la configuración de {league.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="px-1">
          {apiError && (
            <div className="mb-4 p-3 bg-red-950/80 backdrop-blur-sm border border-red-800/50 text-red-200 text-sm rounded-lg font-medium shadow-inner text-center">
              {apiError}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Nombre</label>
              <Input
                {...form.register('name')}
                placeholder="Nombre de la liga"
                className="bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800"
              />
              {form.formState.errors.name && (
                <span className="text-[11px] font-medium text-red-500 block">{form.formState.errors.name.message}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Balance Inicial</label>
                <Input
                  {...form.register('initial_balance', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Máx. Recargas</label>
                <Input
                  {...form.register('max_recharges', { valueAsNumber: true })}
                  type="number"
                  className="bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
              <input
                type="checkbox"
                id="edit_hide_standings"
                {...form.register('hide_standings')}
                className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-indigo-600 focus:ring-indigo-500 dark:bg-neutral-950 dark:checked:bg-indigo-600 transition-colors cursor-pointer"
              />
              <label htmlFor="edit_hide_standings" className="text-sm font-medium cursor-pointer select-none">
                Ocultar tabla de posiciones
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={mutation.isPending} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase py-5 text-sm shadow-lg transition-all duration-300 mt-4"
            >
              {mutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
