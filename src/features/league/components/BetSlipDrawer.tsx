import { useState, useMemo } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { X, Activity, Trash2 } from 'lucide-react';
import { useBetSlipStore } from '@/store/useBetSlipStore';
import { leagueApi } from '@/features/league/api/league.api';
import { Button } from '@/components/ui/button';
import { BetSuccessMessage } from './bets/BetSuccessMessage';
import { BetSlipItem } from './bets/BetSlipItem';
import { BetSlipFooter } from './bets/BetSlipFooter';

export const BetSlipDrawer = () => {
  const { selections, isOpen, removeSelection, clearSlip, setIsOpen } = useBetSlipStore();
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedBonusId, setSelectedBonusId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const isCombined = selections.length > 1;
  const leagueId = selections[0]?.leagueId;

  const { data: bonuses } = useQuery({
    queryKey: ['league-bonuses', leagueId],
    queryFn: () => leagueApi.getMyBonuses(leagueId),
    enabled: isOpen && !!leagueId,
  });

  const pendingBonuses = bonuses?.filter(b => b.status === 'PENDING') || [];

  const totalOdds = useMemo(() => {
    return selections.reduce((acc, curr) => acc * curr.currentOdds, 1);
  }, [selections]);

  const potentialWin = parseFloat(amount || '0') * totalOdds;

  const singleBetMutation = useMutation({
    mutationFn: (betAmount: number) => 
      leagueApi.placeBet({
        league_id: leagueId,
        market_id: selections[0].marketId,
        market_option_id: selections[0].optionId,
        amount: betAmount,
        ...(selectedBonusId ? { bonus_id: selectedBonusId } : {})
      }),
    onSuccess: handleSuccess,
    onError: handleError
  });

  const combinedBetMutation = useMutation({
    mutationFn: (betAmount: number) =>
      leagueApi.placeCombinedBet({
        league_id: leagueId,
        stake: betAmount,
        use_bonus: !!selectedBonusId,
        ...(selectedBonusId ? { bonus_id: selectedBonusId } : {}),
        selections: selections.map(s => ({
          market_id: s.marketId,
          selection_id: s.optionId
        }))
      }),
    onSuccess: handleSuccess,
    onError: handleError
  });

  function handleSuccess() {
    queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
    queryClient.invalidateQueries({ queryKey: ['league', leagueId] });
    setIsSuccess(true);
    setTimeout(() => {
      clearSlip();
      setAmount('');
      setError(null);
      setIsSuccess(false);
      setSelectedBonusId(null);
    }, 2000);
  }

  function handleError(err: unknown) {
    const error = err as { response?: { data?: { error?: string } } };
    setError(error.response?.data?.error || 'Error al realizar la apuesta');
  }

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Por favor, ingresa un monto válido.');
      return;
    }
    setError(null);
    if (isCombined) {
      combinedBetMutation.mutate(numAmount);
    } else {
      singleBetMutation.mutate(numAmount);
    }
  };

  if (!isOpen) {
    if (selections.length > 0) {
      return (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            onClick={() => setIsOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center gap-2 px-6 py-6 transform transition-transform hover:scale-105"
          >
            <Activity className="w-5 h-5" />
            <span className="font-bold text-lg">Boleto ({selections.length})</span>
          </Button>
        </div>
      );
    }
    return null;
  }

  const isPending = singleBetMutation.isPending || combinedBetMutation.isPending;

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full sm:w-[400px] sm:mr-4 sm:mb-4 pointer-events-none flex flex-col justify-end max-h-screen">
      {/* Drawer */}
      <div className="pointer-events-auto relative w-full flex-shrink min-h-0 max-h-[100dvh] sm:max-h-[85vh] bg-white dark:bg-[#121212] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col sm:rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-white/10 bg-gradient-to-r from-indigo-500 to-purple-600">
          <h2 className="text-l font-bold text-white flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Boleto de Apuestas
            {selections.length > 0 && (
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm font-medium">
                {selections.length}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-1">
            {selections.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearSlip} 
                className="text-white hover:bg-white/20 text-xs px-2 h-8"
                disabled={isPending}
              >
                Limpiar <Trash2 className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 h-8 w-8">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {isSuccess ? (
          <div className="flex-1 p-6">
            <BetSuccessMessage />
          </div>
        ) : (
          <>
            {/* Selections List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selections.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                  <p>Tu boleto está vacío</p>
                  <p className="text-sm">Agrega cuotas para comenzar a apostar.</p>
                </div>
              ) : (
                selections.map((sel) => (
                  <BetSlipItem key={sel.optionId} selection={sel} onRemove={removeSelection} />
                ))
              )}
            </div>

            {selections.length > 0 && (
              <BetSlipFooter
                totalOdds={totalOdds}
                amount={amount}
                setAmount={setAmount}
                potentialWin={potentialWin}
                error={error}
                pendingBonuses={pendingBonuses}
                selectedBonusId={selectedBonusId}
                setSelectedBonusId={(id, bonusAmount) => {
                  setSelectedBonusId(id);
                  setAmount(bonusAmount ? bonusAmount.toString() : '');
                }}
                clearSlip={clearSlip}
                handleConfirm={handleConfirm}
                isPending={isPending}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
