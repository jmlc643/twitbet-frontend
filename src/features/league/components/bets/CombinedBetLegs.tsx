import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
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
    default:
      return null;
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
          <div key={leg.id || index} className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <span className="font-semibold text-neutral-900 dark:text-white text-sm">{leg.selection_name}</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">x{leg.odds_at_placement.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-neutral-500 flex items-center">
                <LegStatusIcon status={leg.status} />
                <span className="ml-1 capitalize">{leg.status.toLowerCase()}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
