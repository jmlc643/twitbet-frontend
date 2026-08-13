import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, Wallet, Activity, Gift, PlusCircle, AlertTriangle } from 'lucide-react';
import type { GetLeagueDetailsResponse } from '../../types/league.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leagueApi } from '../../api/league.api';
import { Button } from '@/components/ui/button';
import { MyBonusesModal } from '../MyBonusesModal';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LeagueHeaderSectionProps {
  league: GetLeagueDetailsResponse;
  isAdmin?: boolean;
}

export const LeagueHeaderSection = ({ league, isAdmin = true }: LeagueHeaderSectionProps) => {
  const queryClient = useQueryClient();
  const [isBonusesModalOpen, setIsBonusesModalOpen] = useState(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);

  const { data: participantMe } = useQuery({
    queryKey: ['participantMe', league.league_id],
    queryFn: () => leagueApi.getParticipantMe(league.league_id),
  });

  const rechargeMutation = useMutation({
    mutationFn: () => leagueApi.recharge(league.league_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participantMe', league.league_id] });
      queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
      setIsRechargeModalOpen(false);
      toast.success('Recarga exitosa');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Error al recargar saldo');
      setIsRechargeModalOpen(false);
    }
  });

  return (
    <Card className={`${isAdmin ? 'md:col-span-2' : 'md:col-span-3'} h-full flex flex-col justify-between border-neutral-200 dark:border-white/10 bg-white dark:bg-zinc-950/80 backdrop-blur-md shadow-2xl relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <CardHeader>
        <CardTitle className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">{league.name}</span>
          {participantMe && (
            <div className="flex flex-col items-end w-full md:w-auto">
              <span className="text-xs text-neutral-500 dark:text-zinc-500 uppercase tracking-wider font-semibold flex items-center mb-1">
                <Activity className="w-3 h-3 mr-1"/> Mi Balance Disponible
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                S/. {participantMe.balance.toFixed(2)}
              </span>
            </div>
          )}
        </CardTitle>
        <CardDescription className="text-neutral-500 dark:text-zinc-400 flex items-center mt-2">
          Creado el {new Date(league.created_at).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-4">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-neutral-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">Código Inv.</span>
            <span className="text-lg font-mono font-medium text-indigo-600 dark:text-indigo-400">{league.invite_code}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-neutral-500 dark:text-zinc-500 uppercase tracking-wider font-semibold flex items-center"><Wallet className="w-3 h-3 mr-1"/> Saldo Inicial</span>
            <span className="text-lg font-medium text-neutral-900 dark:text-white">S/. {league.initial_balance}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-neutral-500 dark:text-zinc-500 uppercase tracking-wider font-semibold flex items-center"><Users className="w-3 h-3 mr-1"/> Participantes</span>
            <span className="text-lg font-medium text-neutral-900 dark:text-white">{league.participants_count || 0}</span>
          </div>
        </div>
      </CardContent>
      
      {participantMe && (
        <div className="relative z-10 mt-auto border-t border-neutral-100 dark:border-white/10 bg-neutral-50/50 dark:bg-black/20 p-4">
          <div className="flex flex-wrap justify-end gap-2 sm:gap-3 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsBonusesModalOpen(true);
              }}
            >
              <Gift className="w-4 h-4 mr-2" />
              Mis Bonos
            </Button>
            <Button 
              size="sm" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsRechargeModalOpen(true);
              }}
              disabled={rechargeMutation.isPending}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {rechargeMutation.isPending ? 'Procesando...' : 'Recarga'}
            </Button>
          </div>
        </div>
      )}
      <Dialog open={isRechargeModalOpen} onOpenChange={setIsRechargeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-center">
              Solicitar Recarga
            </DialogTitle>
            <DialogDescription className="text-center">
              ¿Estás seguro de solicitar una recarga de rescate del 50% de tu balance inicial?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-3 pt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setIsRechargeModalOpen(false)}
              disabled={rechargeMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => rechargeMutation.mutate()}
              disabled={rechargeMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {rechargeMutation.isPending ? 'Procesando...' : 'Sí, solicitar rescate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <MyBonusesModal 
        isOpen={isBonusesModalOpen} 
        onClose={() => setIsBonusesModalOpen(false)} 
        leagueId={league.league_id} 
      />
    </Card>
  );
};
