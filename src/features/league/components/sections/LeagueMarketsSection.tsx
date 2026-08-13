import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TrendingUp, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedOdds } from '@/components/ui/AnimatedOdds';
import { PlaceBetModal } from '../PlaceBetModal';
import { mapMarketType, sortMarketsByType, MARKET_TYPE_ORDER } from '@/features/league/utils/marketTypeMapper';
import type { MarketResponse } from '@/features/league/types/league.types';

interface LeagueMarketsSectionProps {
  leagueId: string;
}

export const LeagueMarketsSection = ({ leagueId }: LeagueMarketsSectionProps) => {
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

  const { data: markets, isLoading, isError } = useQuery({
    queryKey: ['league-markets', leagueId],
    queryFn: () => leagueApi.getLeagueMarkets(leagueId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500">
        {[1, 2].map((i) => (
          <div key={i} className="h-40 w-full bg-zinc-800/20 dark:bg-zinc-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !markets) {
    return (
      <div className="text-center py-10 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/30">
        <p className="text-red-500 font-medium">Error al cargar los mercados del torneo.</p>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900/20 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
        <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-2">No hay mercados futuros (a largo plazo) en esta liga.</p>
      </div>
    );
  }

  const sortedMarkets = sortMarketsByType(markets);
  const groupedMarkets = MARKET_TYPE_ORDER
    .map(type => ({ type, markets: sortedMarkets.filter(m => (m.type ?? 'OTHER') === type) }))
    .filter(group => group.markets.length > 0);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
          Mercados Futuros del Torneo
        </h2>
      </div>

      {groupedMarkets.map(group => (
        <div key={group.type} className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            {mapMarketType(group.type)}
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {group.markets.map((market) => (
              <MarketCardView key={market.id} market={market} leagueId={leagueId} setBetModal={setBetModal} />
            ))}
          </div>
        </div>
      ))}

      <PlaceBetModal
        {...betModal}
        onClose={() => setBetModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

interface MarketCardViewProps {
  market: MarketResponse;
  leagueId: string;
  setBetModal: React.Dispatch<React.SetStateAction<{
    isOpen: boolean;
    leagueId: string;
    marketId: string;
    optionId: string;
    optionName: string;
    marketName: string;
    currentOdds: number;
  }>>;
}

const MarketCardView = ({ market, leagueId, setBetModal }: MarketCardViewProps) => {
  return (
    <Card className="border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-neutral-900/50 hover:border-emerald-400 dark:hover:border-emerald-700/80 transition-all duration-300">
      <CardHeader className="p-4 pb-3 border-b border-neutral-100 dark:border-neutral-800/50 bg-emerald-50/50 dark:bg-emerald-900/10">
        <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" />
          {market.name}
          {market.status === 'SUSPENDED' && (
            <Lock className="w-4 h-4 ml-2 text-red-500" />
          )}
        </h3>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {market.options.map((opt) => (
            <AnimatedOdds key={opt.id} odds={opt.current_odds}>
              {(flash, currentOdds) => {
                const flashClass = flash === 'up' 
                  ? 'bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-600 dark:border-emerald-600' 
                  : flash === 'down'
                  ? 'bg-red-500 border-red-500 text-white dark:bg-red-600 dark:border-red-600'
                  : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-950/50 dark:border-neutral-800';
                  
                const textClass = flash ? 'text-white' : 'text-emerald-700 dark:text-emerald-400';
                const labelClass = flash ? 'text-white/80' : 'text-neutral-500 dark:text-neutral-400';
                const isBetDisabled = market.status === 'SUSPENDED' || market.status === 'CANCELLED' || market.status === 'RESOLVED' || opt.status === 'BLOCKED';

                return (
                  <Button 
                    variant="outline" 
                    disabled={isBetDisabled}
                    onClick={() => {
                      if (!isBetDisabled) {
                        setBetModal({
                          isOpen: true,
                          leagueId: leagueId,
                          marketId: market.id,
                          optionId: opt.id,
                          optionName: opt.name,
                          marketName: market.name,
                          currentOdds: currentOdds
                        });
                      }
                    }}
                    className={`flex flex-col items-center justify-center py-3 h-auto hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/30 dark:hover:border-emerald-800 transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed ${flashClass}`}
                  >
                    <span className={`text-xs font-medium mb-1 truncate w-full text-center ${labelClass}`}>
                      {opt.status === 'BLOCKED' && <Lock className="w-3 h-3 mr-1 inline-block text-red-500" />}
                      {opt.name}
                    </span>
                    <span className={`text-base font-bold ${textClass}`}>
                      {currentOdds.toFixed(2)}
                    </span>
                  </Button>
                );
              }}
            </AnimatedOdds>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

