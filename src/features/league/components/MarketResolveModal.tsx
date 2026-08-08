import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import type { MarketResponse } from '@/features/league/types/league.types';

interface MarketResolveModalProps {
  market: MarketResponse;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MarketResolveModal = ({ market, isOpen, onOpenChange }: MarketResolveModalProps) => {
  const queryClient = useQueryClient();
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);

  const resolveMutation = useMutation({
    mutationFn: (winningOptionId: string) => 
      leagueApi.resolveMarket(market.id, { winning_option_id: winningOptionId }),
    onSuccess: () => {
      if (market.match_id) {
        queryClient.invalidateQueries({ queryKey: ['match-markets', market.match_id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['league-markets', market.league_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
      onOpenChange(false);
    }
  });

  const handleResolve = () => {
    if (selectedWinnerId) {
      resolveMutation.mutate(selectedWinnerId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolver Mercado</DialogTitle>
          <DialogDescription>
            Selecciona la opción ganadora. Esta acción no se puede deshacer y pagará automáticamente las ganancias a los usuarios correspondientes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          {market.options.map(opt => (
            <Button
              key={opt.id}
              variant={selectedWinnerId === opt.id ? 'default' : 'outline'}
              className={`justify-start ${selectedWinnerId === opt.id ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
              onClick={() => setSelectedWinnerId(opt.id)}
            >
              {opt.name}
            </Button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={handleResolve} 
            disabled={!selectedWinnerId || resolveMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {resolveMutation.isPending ? 'Resolviendo...' : 'Confirmar Ganador'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
