import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Trophy, Calendar, Clock, Lock } from 'lucide-react';

import { leagueApi } from '@/features/league/api/league.api';
import { mapMatchStatus, getStatusColor } from '@/features/league/utils/statusMapper';
import { mapMarketType, sortMarketsByType, MARKET_TYPE_ORDER } from '@/features/league/utils/marketTypeMapper';
import { Button } from '@/components/ui/button';
import { AnimatedOdds } from '@/components/ui/AnimatedOdds';
import { PlaceBetModal } from '@/features/league/components/PlaceBetModal';
import { useState } from 'react';

export const MatchDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [betModal, setBetModal] = useState<{
    isOpen: boolean;
    leagueId: string;
    marketId: string;
    optionId: string;
    optionName: string;
    marketName: string;
    currentOdds: number;
  }>({
    isOpen: false,
    leagueId: '',
    marketId: '',
    optionId: '',
    optionName: '',
    marketName: '',
    currentOdds: 0,
  });

  const { data: match, isLoading, isError } = useQuery({
    queryKey: ['match-details', slug],
    queryFn: () => leagueApi.getMatchDetails(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-5xl animate-in fade-in duration-500">
        <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-6" />
        <div className="h-32 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (isError || !match) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error al cargar el partido</h2>
        <Button onClick={() => navigate(-1)} variant="outline">Volver</Button>
      </div>
    );
  }

  const date = new Date(match.start_time);

  const sortedMarkets = sortMarketsByType(match.markets || []);
  const groupedMarkets = MARKET_TYPE_ORDER
    .map(type => ({ type, markets: sortedMarkets.filter(m => (m.type ?? 'OTHER') === type) }))
    .filter(group => group.markets.length > 0);

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-4xl animate-in fade-in duration-500">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-xl">
        <h1 className="text-3xl font-black mb-3 flex items-center">
          <Trophy className="w-8 h-8 mr-3 text-yellow-300" />
          {match.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-indigo-100">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(match.status).replace('bg-', 'bg-white/20 text-white border-white/30 ')} border`}>
            {mapMatchStatus(match.status)}
          </span>
        </div>
      </div>

      {/* Mercados */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Mercados Disponibles</h2>
        
        <div>
          {match.markets && match.markets.length > 0 ? (
            <div className="space-y-8">
              {groupedMarkets.map(group => (
                <div key={group.type} className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2" />
                    {mapMarketType(group.type)}
                  </h3>

                  <div className="space-y-6">
                    {group.markets.map(market => (
                      <div key={market.id} className="p-6 bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                          <h3 className="text-lg font-bold text-neutral-900 dark:text-white uppercase tracking-wide flex items-center flex-wrap gap-2 min-w-0">
                            <span className="break-words">{market.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 normal-case shrink-0">
                              {mapMarketType(market.type)}
                            </span>
                          </h3>
                          {market.status === 'SUSPENDED' && (
                            <span className="flex items-center text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                              <Lock className="w-3.5 h-3.5 mr-1" /> SUSPENDIDO
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {market.options.map(opt => (
                            <AnimatedOdds key={opt.id} odds={opt.current_odds}>
                              {(flash, currentOdds) => {
                                const flashClass = flash === 'up' 
                                  ? 'bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-600' 
                                  : flash === 'down'
                                  ? 'bg-red-500 border-red-500 text-white dark:bg-red-600'
                                  : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-950/50 dark:border-neutral-800 text-neutral-900 dark:text-white';
                                
                                const labelClass = flash ? 'text-white/80' : 'text-neutral-500 dark:text-neutral-400';
                                const isOptionBlocked = opt.status === 'BLOCKED';
                                const isMarketLocked = market.status === 'SUSPENDED' || market.status === 'CANCELLED' || market.status === 'RESOLVED';
                                const isBetDisabled = isOptionBlocked || isMarketLocked;

                                return (
                                  <div 
                                    className={`flex flex-col items-center justify-center py-3 px-2 border rounded-xl transition-colors duration-500 ${flashClass} ${isBetDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                                    onClick={() => {
                                      if (!isBetDisabled) {
                                        setBetModal({
                                          isOpen: true,
                                          leagueId: match.league_id,
                                          marketId: market.id,
                                          optionId: opt.id,
                                          optionName: opt.name,
                                          marketName: market.name,
                                          currentOdds: currentOdds
                                        });
                                      }
                                    }}
                                  >
                                    <span className={`text-[11px] font-semibold mb-1 text-center truncate w-full uppercase tracking-wider ${labelClass}`}>
                                      {isOptionBlocked && <Lock className="w-3 h-3 mr-1 inline-block text-red-500" />}
                                      {opt.name}
                                    </span>
                                    <span className="text-lg font-black">
                                      {currentOdds.toFixed(2)}
                                    </span>
                                  </div>
                                );
                              }}
                            </AnimatedOdds>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/20">
              <p className="text-neutral-500 dark:text-neutral-400 font-medium">No hay mercados disponibles para este partido.</p>
            </div>
          )}
        </div>

        <PlaceBetModal
          {...betModal}
          onClose={() => setBetModal(prev => ({ ...prev, isOpen: false }))}
        />
      </div>
    </div>
  );
};
