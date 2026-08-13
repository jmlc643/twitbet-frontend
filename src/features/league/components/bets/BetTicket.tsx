import { useState } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, Banknote } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { formatDateTimeDDMMYYYY } from '@/lib/date';
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
    case 'CASHOUT':
      return <Banknote className="w-4 h-4 text-blue-500" />;
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
    case 'CASHOUT':
      return <span className="text-blue-500 font-semibold">Cashout</span>;
    default:
      return <span>{status}</span>;
  }
};

export const BetTicket = ({ bet }: BetTicketProps) => {
  const [isCashoutOpen, setIsCashoutOpen] = useState(false);
  const queryClient = useQueryClient();
  const cashoutMutation = useMutation({
    mutationFn: (betId: string) => leagueApi.cashoutBet(betId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participantBets'] });
      queryClient.invalidateQueries({ queryKey: ['participantMe'] });
      setIsCashoutOpen(false);
    },
  });

  const handleCashout = () => {
    cashoutMutation.mutate(bet.id);
  };

  return (
    <div 
      className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        bet.status === 'WON' ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50' :
        bet.status === 'LOST' ? 'bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900/50' :
        bet.status === 'VOIDED' ? 'bg-neutral-50 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800' :
        bet.status === 'CASHOUT' ? 'bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50' :
        'bg-white border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800'
      }`}
    >
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-md uppercase tracking-wider">
            {bet.market_name}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            {formatDateTimeDDMMYYYY(bet.placed_at)}
          </span>
        </div>
        <h4 className="font-bold text-neutral-900 dark:text-white break-words">
          {bet.match_title}
        </h4>
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          Opción: <span className="font-semibold">{bet.option_name}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 md:flex-col md:items-end md:justify-center">
        <div className="text-left md:text-right">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Monto Apostado</div>
          <div className="font-bold text-neutral-900 dark:text-white">S/. {bet.amount.toFixed(2)}</div>
        </div>
        <div className="text-left md:text-right">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Ganancia Potencial (x{bet.odds.toFixed(2)})</div>
          <div className="font-black text-emerald-600 dark:text-emerald-400">S/. {bet.potential_win.toFixed(2)}</div>
        </div>
        <div className="flex items-center space-x-1 md:mt-0">
          <StatusIcon status={bet.status} />
          <StatusLabel status={bet.status} />
        </div>
        
        {bet.status === 'ACCEPTED' && bet.cashout_amount != null && (
          <Dialog open={isCashoutOpen} onOpenChange={setIsCashoutOpen}>
            <DialogTrigger asChild>
              <button 
                className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Cashout S/. {bet.cashout_amount.toFixed(2)}
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Cashout</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro que deseas retirar tu apuesta ahora? Recibirás S/. {bet.cashout_amount.toFixed(2)} en tu saldo de la liga.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={cashoutMutation.isPending}>Cancelar</Button>
                </DialogClose>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleCashout} 
                  disabled={cashoutMutation.isPending}
                >
                  {cashoutMutation.isPending ? 'Procesando...' : 'Confirmar Cashout'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
