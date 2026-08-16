import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BetBonusSelector } from './BetBonusSelector';
import type { BonusResponse } from '@/features/league/types/league.types';

interface BetSlipFooterProps {
  totalOdds: number;
  amount: string;
  setAmount: (amount: string) => void;
  potentialWin: number;
  error: string | null;
  pendingBonuses: BonusResponse[];
  selectedBonusId: string | null;
  setSelectedBonusId: (id: string | null, amount: number | null) => void;
  clearSlip: () => void;
  handleConfirm: () => void;
  isPending: boolean;
}

export const BetSlipFooter = ({
  totalOdds,
  amount,
  setAmount,
  potentialWin,
  error,
  pendingBonuses,
  selectedBonusId,
  setSelectedBonusId,
  handleConfirm,
  isPending
}: BetSlipFooterProps) => {
  return (
    <div className="p-3 bg-neutral-50 dark:bg-[#1C1C1E] border-t border-neutral-200 dark:border-white/10 space-y-3">


      {/* Input Section */}
      <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 flex justify-between items-center">
        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Apuesta
        </span>
        <div className="flex items-center">
          <Input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-24 h-8 text-right font-medium bg-white dark:bg-neutral-950"
            disabled={!!selectedBonusId}
          />
        </div>
      </div>

      <BetBonusSelector 
        pendingBonuses={pendingBonuses}
        selectedBonusId={selectedBonusId}
        onSelectBonus={setSelectedBonusId}
      />

      {error && (
        <div className="p-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-900/50">
          {error}
        </div>
      )}

      {/* Totals Section */}
      <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">Apuesta Total</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            PEN {amount || '0.00'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">Cuota Total</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {totalOdds.toFixed(2)}
          </span>
        </div>
        <hr className="my-2 border-neutral-200 dark:border-neutral-800" />
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">Ganancia Total</span>
          <span className="font-bold text-neutral-900 dark:text-neutral-100">
            PEN {potentialWin.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Action Button */}
      <div className="flex gap-2 pt-1">
        <Button 
          variant="outline" 
          disabled={isPending}
          className="px-3 shrink-0 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Bookmark className="w-5 h-5" />
        </Button>
        <Button 
          onClick={handleConfirm} 
          disabled={isPending || !amount} 
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-10"
        >
          {isPending ? 'Procesando...' : `Realizar apuesta PEN ${amount || '0.00'}`}
        </Button>
      </div>
    </div>
  );
};
