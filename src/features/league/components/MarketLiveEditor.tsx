import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Unlock, Save, CheckCircle, Ban } from 'lucide-react';
import type { MarketResponse } from '@/features/league/types/league.types';
import { MarketResolveModal } from './MarketResolveModal';
import { MarketCancelModal } from './MarketCancelModal';

export const MarketLiveEditor = ({ market }: { market: MarketResponse }) => {
  const queryClient = useQueryClient();
  const [odds, setOdds] = useState<Record<string, number>>(() => {
    const initialOdds: Record<string, number> = {};
    market.options.forEach(opt => {
      initialOdds[opt.id] = opt.current_odds;
    });
    return initialOdds;
  });
  
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const statusMutation = useMutation({
    mutationFn: (newStatus: 'ACTIVE' | 'SUSPENDED') => 
      leagueApi.updateMarketStatus(market.id, { status: newStatus }),
    onSuccess: () => {
      if (market.match_id) {
        queryClient.invalidateQueries({ queryKey: ['match-markets', market.match_id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['league-markets', market.league_id] });
      }
    }
  });

  const oddsMutation = useMutation({
    mutationFn: (newOdds: Record<string, number>) => 
      leagueApi.updateMarketOdds(market.id, { options_odds: newOdds }),
    onSuccess: () => {
      if (market.match_id) {
        queryClient.invalidateQueries({ queryKey: ['match-markets', market.match_id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['league-markets', market.league_id] });
      }
    }
  });

  const handleStatusToggle = () => {
    const newStatus = market.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    statusMutation.mutate(newStatus);
  };

  const handleOddsChange = (optionId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setOdds(prev => ({ ...prev, [optionId]: numValue }));
    }
  };

  const handleSaveOdds = () => {
    oddsMutation.mutate(odds);
  };

  const isSuspended = market.status === 'SUSPENDED';
  const isResolved = market.status === 'RESOLVED';
  const isVoided = market.status === 'VOIDED' || market.status === 'CANCELLED';
  const isFinished = isResolved || isVoided;

  return (
    <div className={`p-4 rounded-xl border ${isSuspended ? 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20' : isFinished ? 'border-neutral-200 bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 opacity-75' : 'border-indigo-200 dark:border-indigo-800/50 bg-white/50 dark:bg-neutral-900/50'}`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          {market.name}
          {isSuspended && !isFinished && <span className="text-xs px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded-full">Suspendido</span>}
          {isResolved && <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Resuelto</span>}
          {isVoided && <span className="text-xs px-2 py-1 bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 rounded-full">Anulado</span>}
        </h4>
        {!isFinished && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              disabled={statusMutation.isPending}
              className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <Ban className="w-4 h-4 mr-2" />
              Anular
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsResolveModalOpen(true)}
              disabled={statusMutation.isPending}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Resolver
            </Button>
            <Button 
              variant={isSuspended ? 'default' : 'destructive'} 
              size="sm"
              onClick={handleStatusToggle}
              disabled={statusMutation.isPending}
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {market.options.map(opt => (
          <div key={opt.id} className="space-y-1">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 truncate block">
              {opt.name}
            </label>
            <Input 
              type="number" 
              step="0.01" 
              min="1.01"
              value={odds[opt.id] || ''}
              onChange={(e) => handleOddsChange(opt.id, e.target.value)}
              className="font-mono"
              disabled={isFinished}
            />
          </div>
        ))}
      </div>

      {!isFinished && (
        <div className="flex justify-end mt-4">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleSaveOdds}
            disabled={oddsMutation.isPending || isSuspended}
            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Cuotas
          </Button>
        </div>
      )}

      <MarketResolveModal 
        market={market} 
        isOpen={isResolveModalOpen} 
        onOpenChange={setIsResolveModalOpen} 
      />

      <MarketCancelModal 
        market={market} 
        isOpen={isCancelModalOpen} 
        onOpenChange={setIsCancelModalOpen} 
      />
    </div>
  );
};
