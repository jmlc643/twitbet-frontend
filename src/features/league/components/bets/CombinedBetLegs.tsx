import { Clock, CheckCircle2, XCircle, AlertCircle, Banknote } from 'lucide-react';
import type { CombinedBetResponse } from '@/features/league/types/league.types';

const LegStatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'PENDING':
      return <Clock className="w-3.5 h-3.5 text-amber-500" />;
    case 'WON':
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    case 'LOST':
      return <XCircle className="w-3.5 h-3.5 text-red-500" />;
    case 'VOIDED':
      return <AlertCircle className="w-3.5 h-3.5 text-neutral-500" />;
    case 'CASHOUT':
      return <Banknote className="w-3.5 h-3.5 text-blue-500" />;
    default:
      return null;
  }
};

const getLegStatusText = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Pendiente';
    case 'WON':
      return 'Ganada';
    case 'LOST':
      return 'Perdida';
    case 'VOIDED':
      return 'Anulada';
    case 'CASHOUT':
      return 'Cashout';
    default:
      return status;
  }
};

interface CombinedBetLegsProps {
  legs: CombinedBetResponse['legs'];
}

export const CombinedBetLegs = ({ legs }: CombinedBetLegsProps) => {
  return (
    <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-4 space-y-3">
      <h5 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Apuestas ({legs.length})</h5>
      <div className="grid gap-3 sm:grid-cols-2">
        {legs.map((leg, index) => (
          <div key={leg.id || index} className={`p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col gap-1.5 ${leg.status === 'CASHOUT' ? 'opacity-75' : ''}`}>
            {leg.match_title && (
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate">
                {leg.match_title}
              </div>
            )}
            {leg.market_name && (
              <div className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded w-fit">
                {leg.market_name}
              </div>
            )}
            <div className="flex justify-between items-start mt-0.5">
              <span className={`font-semibold text-sm ${leg.status === 'CASHOUT' ? 'text-neutral-500 line-through' : 'text-neutral-900 dark:text-white'}`}>
                {leg.selection_name}
              </span>
              <span className={`font-bold text-sm ${leg.status === 'CASHOUT' ? 'text-neutral-400 line-through' : 'text-indigo-600 dark:text-indigo-400'}`}>
                x{leg.odds_at_placement.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1 pt-1 border-t border-neutral-100 dark:border-neutral-800/50">
              <span className={`text-xs flex items-center ${leg.status === 'CASHOUT' ? 'text-blue-500 font-semibold' : 'text-neutral-500'}`}>
                <LegStatusIcon status={leg.status} />
                <span className="ml-1 capitalize">{getLegStatusText(leg.status)}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
