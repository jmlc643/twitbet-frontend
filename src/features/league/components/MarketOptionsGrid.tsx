import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Unlock } from 'lucide-react';
import type { MarketResponse, MarketOptionStatus } from '@/features/league/types/league.types';

interface MarketOptionsGridProps {
  market: MarketResponse;
  odds: Record<string, number>;
  isFinished: boolean;
  isPendingStatus: boolean;
  onOddsChange: (optionId: string, value: string) => void;
  onToggleOptionStatus: (optionId: string, currentStatus: MarketOptionStatus | undefined) => void;
}

export const MarketOptionsGrid = ({
  market,
  odds,
  isFinished,
  isPendingStatus,
  onOddsChange,
  onToggleOptionStatus
}: MarketOptionsGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {market.options.map(opt => {
        const isBlocked = opt.status === 'BLOCKED';
        return (
          <div key={opt.id} className={`space-y-1 border rounded-lg p-2 ${isBlocked ? 'border-red-300 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20' : 'border-neutral-200 dark:border-neutral-800'}`}>
            <div className="flex items-center justify-between gap-1">
              <label className={`text-xs font-medium truncate block ${isBlocked ? 'text-red-500 dark:text-red-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                {opt.name}
                {isBlocked && <span className="ml-1 text-[10px] font-bold uppercase">(Bloqueada)</span>}
              </label>
              {!isFinished && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 shrink-0 ${isBlocked ? 'text-emerald-600 hover:text-emerald-700' : 'text-red-500 hover:text-red-600'}`}
                  onClick={() => onToggleOptionStatus(opt.id, opt.status)}
                  disabled={isPendingStatus}
                  title={isBlocked ? 'Desbloquear opción' : 'Bloquear opción'}
                >
                  {isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </Button>
              )}
            </div>
            <Input
              type="number"
              step="0.01"
              min="1.01"
              value={odds[opt.id] ?? opt.current_odds}
              onChange={(e) => onOddsChange(opt.id, e.target.value)}
              className="font-mono"
              disabled={isFinished}
            />
          </div>
        );
      })}
    </div>
  );
};
