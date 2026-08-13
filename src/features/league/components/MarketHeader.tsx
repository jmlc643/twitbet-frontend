import { Button } from '@/components/ui/button';
import { Lock, Unlock, CheckCircle, Ban, Layers } from 'lucide-react';
import type { MarketResponse } from '@/features/league/types/league.types';
import { mapMarketType } from '@/features/league/utils/marketTypeMapper';

interface MarketHeaderProps {
  market: MarketResponse;
  isSuspended: boolean;
  isFinished: boolean;
  isResolved: boolean;
  isVoided: boolean;
  isPending: boolean;
  onCancel: () => void;
  onResolve: () => void;
  onToggleStatus: () => void;
}

export const MarketHeader = ({
  market,
  isSuspended,
  isFinished,
  isResolved,
  isVoided,
  isPending,
  onCancel,
  onResolve,
  onToggleStatus
}: MarketHeaderProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          {market.name}
          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-full flex items-center">
            <Layers className="w-3 h-3 mr-1" />
            {mapMarketType(market.type)}
          </span>
          {isSuspended && !isFinished && (
            <span className="text-xs px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded-full">
              Suspendido
            </span>
          )}
          {isResolved && (
            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-full flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" /> Resuelto
            </span>
          )}
          {isVoided && (
            <span className="text-xs px-2 py-1 bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 rounded-full">
              Anulado
            </span>
          )}
        </h4>
      </div>
      {!isFinished && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isPending}
            className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Ban className="w-4 h-4 mr-2" />
            Anular
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onResolve}
            disabled={isPending}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Resolver
          </Button>
          <Button
            variant={isSuspended ? 'default' : 'destructive'}
            size="sm"
            onClick={onToggleStatus}
            disabled={isPending}
          >
            {isSuspended ? (
              <><Unlock className="w-4 h-4 mr-2" /> Desbloquear</>
            ) : (
              <><Lock className="w-4 h-4 mr-2" /> Bloquear</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
