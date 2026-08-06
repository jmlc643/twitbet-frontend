import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { BetDetailResponse } from '@/features/league/types/league.types';

interface BetTicketProps {
  bet: BetDetailResponse;
}

const StatusIcon = ({ status }: { status: BetDetailResponse['status'] }) => {
  switch (status) {
    case 'ACCEPTED':
      return <Clock className="w-4 h-4 text-amber-500" />;
    case 'WON':
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case 'LOST':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'VOIDED':
      return <AlertCircle className="w-4 h-4 text-neutral-500" />;
    default:
      return null;
  }
};

const StatusLabel = ({ status }: { status: BetDetailResponse['status'] }) => {
  switch (status) {
    case 'ACCEPTED':
      return <span className="text-amber-500 font-semibold">Pendiente</span>;
    case 'WON':
      return <span className="text-emerald-500 font-semibold">Ganada</span>;
    case 'LOST':
      return <span className="text-red-500 font-semibold">Perdida</span>;
    case 'VOIDED':
      return <span className="text-neutral-500 font-semibold">Anulada</span>;
    default:
      return <span>{status}</span>;
  }
};

export const BetTicket = ({ bet }: BetTicketProps) => {
  return (
    <div 
      className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        bet.status === 'WON' ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50' :
        bet.status === 'LOST' ? 'bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900/50' :
        bet.status === 'VOIDED' ? 'bg-neutral-50 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800' :
        'bg-white border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800'
      }`}
    >
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-md uppercase tracking-wider">
            {bet.market_name}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            {new Date(bet.placed_at).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })} {new Date(bet.placed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <h4 className="font-bold text-neutral-900 dark:text-white">
          {bet.match_title}
        </h4>
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          Opción: <span className="font-semibold">{bet.option_name}</span>
        </div>
      </div>
      
      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
        <div className="text-left md:text-right">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Monto Apostado</div>
          <div className="font-bold text-neutral-900 dark:text-white">${bet.amount.toFixed(2)}</div>
        </div>
        <div className="text-left md:text-right">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Ganancia Potencial (x{bet.odds.toFixed(2)})</div>
          <div className="font-black text-emerald-600 dark:text-emerald-400">${bet.potential_win.toFixed(2)}</div>
        </div>
        <div className="flex items-center space-x-1 mt-2 md:mt-0">
          <StatusIcon status={bet.status} />
          <StatusLabel status={bet.status} />
        </div>
      </div>
    </div>
  );
};
