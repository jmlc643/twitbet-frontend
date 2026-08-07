import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { isAxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { leagueApi } from '@/features/league/api/league.api';
import { createMatchSchema, type CreateMatchInput } from '@/features/league/schemas/league.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';

interface CreateMatchModalProps {
  leagueId: string;
}

export const CreateMatchModal = ({ leagueId }: CreateMatchModalProps) => {
  const [open, setOpen] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const queryClient = useQueryClient();

  const form = useForm<CreateMatchInput>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      title: '',
      start_time: '',
    },
  });

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError<{ error?: string }>(err)) return err.response?.data?.error || err.message;
    if (err instanceof Error) return err.message;
    return 'Ocurrió un error inesperado al crear el partido';
  };

  const mutation = useMutation({
    mutationFn: (data: CreateMatchInput) => {
      const date = new Date(data.start_time);
      const isoString = date.toISOString();
      return leagueApi.createMatch(leagueId, {
        title: data.title,
        start_time: isoString
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league-matches', leagueId] });
      setSuccessMessage('Partido creado exitosamente');
      form.reset();
      setTimeout(() => {
        setOpen(false);
        setSuccessMessage('');
      }, 2000);
    },
    onError: (err) => {
      setApiError(getErrorMessage(err));
    }
  });

  const onSubmit = (data: CreateMatchInput) => {
    setApiError('');
    setSuccessMessage('');
    mutation.mutate(data);
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
        <Button variant="outline" className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 dark:border-blue-500/30 dark:text-blue-300 transition-colors">
          <PlusCircle className="w-4 h-4 mr-2" />
          Crear Partido
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-neutral-200/50 dark:border-neutral-800/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
            Nuevo Partido
          </DialogTitle>
          <DialogDescription>
            Programa un nuevo partido para esta liga.
          </DialogDescription>
        </DialogHeader>

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

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Título del Partido</label>
              <Input
                {...form.register('title')}
                placeholder="Ej. Alianza Lima vs Universitario"
                className="bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800"
              />
              {form.formState.errors.title && (
                <span className="text-[11px] font-medium text-red-500 block">{form.formState.errors.title.message}</span>
              )}
            </div>

            <div className="space-y-1 flex flex-col">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Fecha y Hora</label>
              <Controller
                control={form.control}
                name="start_time"
                render={({ field }) => {
                  const dateVal = field.value && !isNaN(new Date(field.value).getTime()) ? new Date(field.value) : undefined;
                  const timeVal = field.value && field.value.includes('T') ? field.value.split('T')[1].substring(0, 5) : '12:00';
                  
                  return (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <DatePicker
                          date={dateVal}
                          setDate={(d) => {
                            if (d) {
                              const dateStr = format(d, 'yyyy-MM-dd');
                              field.onChange(`${dateStr}T${timeVal}`);
                            } else {
                              field.onChange('');
                            }
                          }}
                          placeholder="Fecha del partido"
                        />
                      </div>
                      <div className="w-[120px]">
                        <TimePicker
                          value={timeVal}
                          onChange={(e) => {
                            if (dateVal) {
                              const dateStr = format(dateVal, 'yyyy-MM-dd');
                              field.onChange(`${dateStr}T${e.target.value}`);
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                }}
              />
              {form.formState.errors.start_time && (
                <span className="text-[11px] font-medium text-red-500 block">{form.formState.errors.start_time.message}</span>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={mutation.isPending || !!successMessage} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase py-5 text-sm shadow-lg transition-all duration-300 mt-4"
            >
              {mutation.isPending ? 'Creando...' : 'Crear Partido'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
