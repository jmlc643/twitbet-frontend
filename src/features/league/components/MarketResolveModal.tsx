import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle2, Lock } from 'lucide-react';
import type { MarketResponse } from '@/features/league/types/league.types';

interface MarketResolveModalProps {
  market: MarketResponse;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MarketResolveModal = ({ market, isOpen, onOpenChange }: MarketResolveModalProps) => {
  const queryClient = useQueryClient();
  const [selectedWinnerIds, setSelectedWinnerIds] = useState<string[]>([]);

  const resolveMutation = useMutation({
    mutationFn: (winningOptionIds: string[]) =>
      leagueApi.resolveMarket(market.id, { winning_option_ids: winningOptionIds }),
    onSuccess: () => {
      if (market.match_id) {
        queryClient.invalidateQueries({ queryKey: ['match-markets', market.match_id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['league-markets', market.league_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
      setSelectedWinnerIds([]);
      onOpenChange(false);
    }
  });

  const toggleWinner = (optionId: string) => {
    setSelectedWinnerIds(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleResolve = () => {
    if (selectedWinnerIds.length > 0) {
      resolveMutation.mutate(selectedWinnerIds);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolver Mercado</DialogTitle>
          <DialogDescription>
            Selecciona la(s) opción(es) ganadora(s). Puedes elegir varias (ej. Over/Under). Esta acción no se puede deshacer y pagará automáticamente las ganancias a los usuarios correspondientes. Las opciones bloqueadas no pueden ser ganadoras.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          {market.options.map(opt => {
            const isBlocked = opt.status === 'BLOCKED';
            const isSelected = selectedWinnerIds.includes(opt.id);
            return (
              <Button
                key={opt.id}
                variant={isSelected ? 'default' : 'outline'}
                disabled={isBlocked || resolveMutation.isPending}
                onClick={() => toggleWinner(opt.id)}
                className={`justify-start ${isSelected ? 'bg-emerald-600 hover:bg-emerald-700' : ''} ${isBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                {isBlocked && <Lock className="w-4 h-4 mr-2" />}
                {opt.name}
              </Button>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={resolveMutation.isPending}>Cancelar</Button>
          <Button
            onClick={handleResolve}
            disabled={selectedWinnerIds.length === 0 || resolveMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {resolveMutation.isPending ? 'Resolviendo...' : `Confirmar Ganador${selectedWinnerIds.length > 1 ? 'es' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
