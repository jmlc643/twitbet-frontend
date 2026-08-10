import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Flag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { leagueApi } from '@/features/league/api/league.api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FinalizeLeagueModalProps {
  leagueId: string;
}

export const FinalizeLeagueModal = ({ leagueId }: FinalizeLeagueModalProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  
  const finalizeMutation = useMutation({
    mutationFn: () => leagueApi.updateLeagueStatus(leagueId, { status: 'FINALIZED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league', leagueId] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard', leagueId] });
      setIsOpen(false);
      toast.success('Liga finalizada exitosamente');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Error al finalizar la liga');
      setIsOpen(false);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 dark:border-yellow-900/50 dark:text-yellow-400 dark:hover:bg-yellow-950/30 transition-colors"
        >
          <Flag className="w-4 h-4 mr-2" />
          Finalizar Liga
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-neutral-200/50 dark:border-neutral-800/50 shadow-2xl">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            ¿Finalizar esta liga?
          </DialogTitle>
          <DialogDescription className="text-center">
            Esta acción es irreversible. Se calcularán las posiciones finales y se revelarán los saldos a todos los participantes. No podrás revertir este estado.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={finalizeMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={() => finalizeMutation.mutate()}
            disabled={finalizeMutation.isPending}
          >
            {finalizeMutation.isPending ? 'Finalizando...' : 'Sí, finalizar liga'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
