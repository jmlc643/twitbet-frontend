import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import type { MarketResponse } from '@/features/league/types/league.types';
import { toast } from 'sonner';

interface MarketCancelModalProps {
  market: MarketResponse;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MarketCancelModal = ({ market, isOpen, onOpenChange }: MarketCancelModalProps) => {
  const queryClient = useQueryClient();
  const [cancellationReason, setCancellationReason] = useState("");

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => 
      leagueApi.cancelMarket(market.id, { cancellation_reason: reason }),
    onSuccess: () => {
      if (market.match_id) {
        queryClient.invalidateQueries({ queryKey: ['match-markets', market.match_id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['league-markets', market.league_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
      toast.success('Mercado anulado exitosamente');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Hubo un error al anular el mercado');
    }
  });

  const handleCancel = () => {
    if (cancellationReason.trim()) {
      cancelMutation.mutate(cancellationReason);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anular Mercado</DialogTitle>
          <DialogDescription>
            Ingresa el motivo para anular este mercado. Esto reembolsará todas las apuestas y es una acción que no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="text-sm font-medium mb-1 block">Motivo de la anulación</label>
          <Input 
            placeholder="Ej. Error en los datos, partido suspendido..." 
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={handleCancel} 
            disabled={!cancellationReason.trim() || cancelMutation.isPending}
            variant="destructive"
          >
            {cancelMutation.isPending ? 'Anulando...' : 'Confirmar Anulación'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
