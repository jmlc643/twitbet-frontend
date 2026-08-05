import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Lock, Unlock, Save, Activity } from 'lucide-react';
import type { MarketResponse, MatchResponse } from '@/features/league/types/league.types';

const MarketLiveEditor = ({ market }: { market: MarketResponse }) => {
  const queryClient = useQueryClient();
  const [odds, setOdds] = useState<Record<string, number>>(() => {
    const initialOdds: Record<string, number> = {};
    market.options.forEach(opt => {
      initialOdds[opt.id] = opt.current_odds;
    });
    return initialOdds;
  });

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

  return (
    <div className={`p-4 rounded-xl border ${isSuspended ? 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20' : 'border-indigo-200 dark:border-indigo-800/50 bg-white/50 dark:bg-neutral-900/50'}`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          {market.name}
          {isSuspended && <span className="text-xs px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded-full">Suspendido</span>}
        </h4>
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
            />
          </div>
        ))}
      </div>

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
    </div>
  );
};

const MatchMarketsContainer = ({ match }: { match: MatchResponse }) => {
  const { data: markets = [], isLoading } = useQuery({
    queryKey: ['match-markets', match.id],
    queryFn: () => leagueApi.getMatchMarkets(match.id),
  });

  if (isLoading) return <div className="animate-pulse h-20 bg-neutral-100 dark:bg-neutral-800 rounded-xl" />;
  if (markets.length === 0) return null;

  return (
    <Card className="mb-6 border-indigo-100 dark:border-indigo-950 shadow-sm">
      <CardHeader className="py-4 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-950">
        <h3 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-indigo-500" />
          {match.title}
        </h3>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {markets.map(market => (
          <MarketLiveEditor key={market.id} market={market} />
        ))}
      </CardContent>
    </Card>
  );
};

export const LeagueLiveConsolePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: league, isLoading: loadingLeague } = useQuery({
    queryKey: ['league', id],
    queryFn: () => leagueApi.getLeagueDetails(id!),
    enabled: !!id,
  });

  const { data: matchesData } = useQuery({
    queryKey: ['league-matches', id],
    queryFn: () => leagueApi.getMatches(id!, 1, 100),
    enabled: !!id,
  });

  const { data: leagueMarkets = [] } = useQuery({
    queryKey: ['league-markets', id],
    queryFn: () => leagueApi.getLeagueMarkets(id!),
    enabled: !!id,
  });

  if (loadingLeague) {
    return <div className="container mx-auto p-4 flex justify-center items-center h-screen"><Activity className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  if (!league) {
    return <div className="text-center p-8">Liga no encontrada.</div>;
  }

  if (user?.id !== league.admin_id) {
    navigate(`/leagues/${id}`);
    return null;
  }

  const matches = matchesData?.matches || [];

  return (
    <div className="container mx-auto p-4 max-w-5xl animate-in fade-in duration-500">
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/leagues/${id}`)} 
        className="mb-4 text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la Liga
      </Button>

      <div className="mb-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white shadow-xl">
        <h1 className="text-3xl font-black mb-2 flex items-center">
          <Activity className="w-8 h-8 mr-3 animate-pulse" />
          Consola En Vivo
        </h1>
        <p className="text-indigo-100 font-medium">Control en tiempo real de mercados y cuotas para {league.name}</p>
      </div>

      <div className="space-y-8">
        {leagueMarkets.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">Mercados Futuros (Torneo)</h2>
            <div className="space-y-4">
              {leagueMarkets.map(market => (
                <MarketLiveEditor key={market.id} market={market} />
              ))}
            </div>
          </div>
        )}

        {matches.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">Mercados por Partido</h2>
            {matches.map(match => (
              <MatchMarketsContainer key={match.id} match={match} />
            ))}
          </div>
        )}

        {matches.length === 0 && leagueMarkets.length === 0 && (
          <div className="text-center p-12 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
            <p className="text-neutral-500 dark:text-neutral-400 font-medium">No hay mercados activos en esta liga.</p>
          </div>
        )}
      </div>
    </div>
  );
};
