import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity } from 'lucide-react';
import { BetSuccessMessage } from './bets/BetSuccessMessage';
import { BetBonusSelector } from './bets/BetBonusSelector';

interface PlaceBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  leagueId: string;
  marketId: string;
  optionId: string;
  optionName: string;
  marketName: string;
  currentOdds: number;
}

export const PlaceBetModal = ({
  isOpen,
  onClose,
  leagueId,
  marketId,
  optionId,
  optionName,
  marketName,
  currentOdds
}: PlaceBetModalProps) => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedBonusId, setSelectedBonusId] = useState<string | null>(null);

  const { data: bonuses } = useQuery({
    queryKey: ['league-bonuses', leagueId],
    queryFn: () => leagueApi.getMyBonuses(leagueId),
    enabled: isOpen,
  });

  const pendingBonuses = bonuses?.filter(b => b.status === 'PENDING') || [];

  const betMutation = useMutation({
    mutationFn: (betAmount: number) => 
      leagueApi.placeBet({
        league_id: leagueId,
        market_id: marketId,
        market_option_id: optionId,
        amount: betAmount,
        ...(selectedBonusId ? { bonus_id: selectedBonusId } : {})
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
      queryClient.invalidateQueries({ queryKey: ['league', leagueId] });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setAmount('');
        setError(null);
        setIsSuccess(false);
        setSelectedBonusId(null);
      }, 2000);
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Error al realizar la apuesta');
    }
  });

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Por favor, ingresa un monto válido.');
      return;
    }
    setError(null);
    betMutation.mutate(numAmount);
  };

  const handleClose = () => {
    setAmount('');
    setError(null);
    setIsSuccess(false);
    setSelectedBonusId(null);
    onClose();
  };

  const potentialWin = parseFloat(amount || '0') * currentOdds;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl text-indigo-900 dark:text-indigo-100">
            <Activity className="w-5 h-5 mr-2 text-indigo-500" />
            Realizar Apuesta
          </DialogTitle>
          <DialogDescription>
            Estás a punto de apostar en el mercado <strong className="text-neutral-900 dark:text-neutral-100">{marketName}</strong>.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <BetSuccessMessage />
        ) : (
          <>
            <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-xl space-y-2 mb-4 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Opción:</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">{optionName}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Cuota:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentOdds.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4">

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Monto a Apostar (S/.) {selectedBonusId && '(Bloqueado por bono)'}
            </label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              autoFocus
              disabled={!!selectedBonusId}
            />
          </div>

          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Ganancia Potencial:</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              S/. {potentialWin.toFixed(2)}
            </span>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}

          <BetBonusSelector 
            pendingBonuses={pendingBonuses}
            selectedBonusId={selectedBonusId}
            onSelectBonus={(id, bonusAmount) => {
              setSelectedBonusId(id);
              setAmount(bonusAmount ? bonusAmount.toString() : '');
            }}
          />
        </div>

          <DialogFooter className="mt-6 flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={onClose} disabled={betMutation.isPending}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={betMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {betMutation.isPending ? 'Procesando...' : 'Confirmar Apuesta'}
            </Button>
          </DialogFooter>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
};
