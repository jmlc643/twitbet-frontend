import { X, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BetSelection } from '@/store/useBetSlipStore';
import { formatDateDDMMYYYY, formatTimeHHMM } from '@/lib/date';

interface BetSlipItemProps {
  selection: BetSelection;
  onRemove: (optionId: string) => void;
}

export const BetSlipItem = ({ selection, onRemove }: BetSlipItemProps) => {
  let dateStr = '';
  if (selection.matchTime) {
    const d = new Date(selection.matchTime);
    dateStr = `${formatDateDDMMYYYY(d).slice(0, 5)} • ${formatTimeHHMM(d)}`;
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-lg relative group shadow-sm">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(selection.optionId)}
        className="absolute top-2 right-2 h-6 w-6 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
      >
        <X className="w-4 h-4" />
      </Button>

      <div className="pr-6 space-y-1">
        {/* Match Title */}
        <div className="flex items-center text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          <Trophy className="w-4 h-4 mr-2 text-neutral-500" />
          <span className="underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-500 cursor-pointer">
            {selection.matchTitle || 'Mercado a largo plazo'}
          </span>
        </div>

        {/* Date / Time */}
        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 ml-6">
          {dateStr || 'Torneo / Liga'}
        </div>

        {/* Market Name */}
        <div className="text-[13px] text-neutral-600 dark:text-neutral-300 ml-6">
          {selection.marketName}
        </div>

        {/* Selection & Odds */}
        <div className="flex justify-between items-center ml-6 pt-1">
          <div className="flex items-center gap-2">
            {selection.matchStatus === 'IN_PLAY' && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                EN VIVO
              </span>
            )}
            <span className="font-medium text-neutral-900 dark:text-neutral-100 text-[13px]">
              {selection.optionName}
            </span>
          </div>
          <span className="font-bold text-neutral-900 dark:text-neutral-100">
            {selection.currentOdds.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
