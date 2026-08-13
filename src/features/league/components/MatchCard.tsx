
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Trophy, ChevronRight, Lock } from 'lucide-react';
import type { MatchResponse } from '@/features/league/types/league.types';
import { mapMatchStatus, getStatusColor } from '@/features/league/utils/statusMapper';
import { mapMarketType, sortMarketsByType } from '@/features/league/utils/marketTypeMapper';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimatedOdds } from '@/components/ui/AnimatedOdds';
import { CreateMarketModal } from './CreateMarketModal';
import { PlaceBetModal } from './PlaceBetModal';
import { useState } from 'react';

interface MatchCardProps {
  match: MatchResponse;
  isAdmin: boolean;
}

export const MatchCard = ({ match, isAdmin }: MatchCardProps) => {
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

  const markets = sortMarketsByType(match.markets || []);
  const previewMarkets = markets.slice(0, 3);
  const date = new Date(match.start_time);
  
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all duration-300 group overflow-hidden">
      <CardHeader className="p-4 pb-2 border-b border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/20">
        <div className="flex justify-between items-start gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 mb-1 flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
              <span className="min-w-0 break-words">{match.title}</span>
            </h3>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className={`px-2 py-0.5 rounded-full ${getStatusColor(match.status)}`}>
                {mapMatchStatus(match.status)}
              </span>
            </div>
          </div>
          {isAdmin && match.status !== 'FINISHED' && match.status !== 'VOIDED' && (
            <div className="w-full sm:w-auto shrink-0">
              <CreateMarketModal leagueId={match.league_id} matchId={match.id} />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {previewMarkets.length > 0 ? (
          <div className="space-y-4">
            {previewMarkets.map((market) => (
              <div key={market.id} className="space-y-2">
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider min-w-0 break-words">
                    {market.name}
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 uppercase shrink-0">
                    {mapMarketType(market.type)}
                  </span>
                  {market.status === 'SUSPENDED' && (
                    <Lock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {market.options.map((opt) => (
                    <AnimatedOdds key={opt.id} odds={opt.current_odds}>
                      {(flash, currentOdds) => {
                        const flashClass = flash === 'up' 
                          ? 'bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-600 dark:border-emerald-600' 
                          : flash === 'down'
                          ? 'bg-red-500 border-red-500 text-white dark:bg-red-600 dark:border-red-600'
                          : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-950/50 dark:border-neutral-800';
                          
                        const textClass = flash ? 'text-white' : 'text-neutral-900 dark:text-white';
                        const labelClass = flash ? 'text-white/80' : 'text-neutral-500 dark:text-neutral-400';

                        const isBetDisabled = market.status === 'SUSPENDED' || market.status === 'CANCELLED' || market.status === 'RESOLVED' || opt.status === 'BLOCKED' || match.status === 'FINISHED' || match.status === 'VOIDED';

                        return (
                          <Button 
                            variant="outline" 
                            disabled={isBetDisabled}
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
                            className={`flex flex-col items-center justify-center py-2 h-auto hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-950/30 dark:hover:border-indigo-800 transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed ${flashClass}`}
                          >
                            <span className={`text-[10px] font-medium mb-1 truncate w-full text-center ${labelClass}`}>
                              {opt.status === 'BLOCKED' && <Lock className="w-3 h-3 mr-1 inline-block text-red-500" />}
                              {opt.name}
                            </span>
                            <span className={`text-sm font-bold ${textClass}`}>
                              {currentOdds.toFixed(2)}
                            </span>
                          </Button>
                        );
                      }}
                    </AnimatedOdds>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-400 dark:text-neutral-600 text-sm italic">
            No hay mercados disponibles para este partido aún.
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <Button 
            variant="ghost" 
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-950/30 text-sm font-semibold group-hover:translate-x-1 transition-transform"
            onClick={() => navigate(`/matches/${match.slug}`)}
          >
            Ver todos los mercados
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <PlaceBetModal
          {...betModal}
          onClose={() => setBetModal(prev => ({ ...prev, isOpen: false }))}
        />
      </CardContent>
    </Card>
  );
};
