import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { leagueApi } from '@/features/league/api/league.api';
import { createMarketSchema, type CreateMarketInput } from '@/features/league/schemas/league.schema';
import { mapMarketType, MARKET_TYPE_ORDER } from '@/features/league/utils/marketTypeMapper';
import type { MarketType } from '@/features/league/types/league.types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface CreateMarketFormProps {
  leagueId: string;
  matchId?: string;
  onSuccess: () => void;
}

export const CreateMarketForm = ({ leagueId, matchId, onSuccess }: CreateMarketFormProps) => {
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const queryClient = useQueryClient();

  const form = useForm<CreateMarketInput>({
    resolver: zodResolver(createMarketSchema),
    defaultValues: {
      name: '',
      type: 'RESULT',
      options: [
        { name: '', odds: 1.5 },
        { name: '', odds: 2.5 }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options"
  });

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError<{ error?: string }>(err)) return err.response?.data?.error || err.message;
    if (err instanceof Error) return err.message;
    return 'Ocurrió un error inesperado al crear el mercado';
  };

  const mutation = useMutation({
    mutationFn: (data: CreateMarketInput) => {
      if (matchId) {
        return leagueApi.createMarketForMatch(matchId, data);
      }
      return leagueApi.createMarketForLeague(leagueId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchId ? ['match-markets', matchId] : ['league-markets', leagueId] });
      setSuccessMessage('Mercado creado exitosamente');
      form.reset();
      setTimeout(() => {
        setSuccessMessage('');
        onSuccess();
      }, 2000);
    },
    onError: (err) => {
      setApiError(getErrorMessage(err));
    }
  });

  const onSubmit = (data: CreateMarketInput) => {
    setApiError('');
    setSuccessMessage('');
    mutation.mutate(data);
  };

  return (
    <div className="px-1">
      {apiError && (
        <div className="mb-4 p-3 bg-red-950/80 backdrop-blur-sm border border-red-800/50 text-red-200 text-sm rounded-lg font-medium shadow-inner text-center">
          {apiError}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-950/80 backdrop-blur-sm border border-green-800/50 text-green-200 text-sm rounded-lg font-medium shadow-inner text-center">
          {successMessage}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Nombre del Mercado</label>
          <Input
            {...form.register('name')}
            placeholder={matchId ? "Ej. Ganador del Partido" : "Ej. Alianza Lima sale campeón"}
            className="bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800"
          />
          {form.formState.errors.name && (
            <span className="text-[11px] font-medium text-red-500 block">{form.formState.errors.name.message}</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Tipo de Mercado</label>
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <Select
                value={field.value ?? 'OTHER'}
                onValueChange={(value) => field.onChange(value as MarketType)}
              >
                <SelectTrigger className="w-full bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MARKET_TYPE_ORDER.map(type => (
                    <SelectItem key={type} value={type}>{mapMarketType(type)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Opciones y Cuotas</label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => append({ name: '', odds: 1.50 })}
              className="h-8 text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            >
              <Plus className="w-3 h-3 mr-1" /> Agregar Opción
            </Button>
          </div>

          {form.formState.errors.options?.root && (
            <span className="text-[11px] font-medium text-red-500 block">
              {form.formState.errors.options.root.message}
            </span>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1">
                  <Input
                    {...form.register(`options.${index}.name` as const)}
                    placeholder="Opción (Ej. Local, Sí, Empate)"
                    className="bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800"
                  />
                  {form.formState.errors.options?.[index]?.name && (
                    <span className="text-[10px] text-red-500">{form.formState.errors.options[index]?.name?.message}</span>
                  )}
                </div>
                
                <div className="w-24 space-y-1">
                  <Input
                    {...form.register(`options.${index}.odds` as const, { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    placeholder="Cuota"
                    className="bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800"
                  />
                  {form.formState.errors.options?.[index]?.odds && (
                    <span className="text-[10px] text-red-500">{form.formState.errors.options[index]?.odds?.message}</span>
                  )}
                </div>

                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => remove(index)}
                  className="shrink-0 h-10 w-10"
                  disabled={fields.length <= 2}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={mutation.isPending || !!successMessage} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase py-5 text-sm shadow-lg transition-all duration-300"
        >
          {mutation.isPending ? 'Creando...' : 'Crear Mercado'}
        </Button>
      </form>
    </div>
  );
};
