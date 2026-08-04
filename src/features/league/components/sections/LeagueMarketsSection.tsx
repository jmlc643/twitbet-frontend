import { useQuery } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeagueMarketsSectionProps {
  leagueId: string;
}

export const LeagueMarketsSection = ({ leagueId }: LeagueMarketsSectionProps) => {
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

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
          Mercados Futuros del Torneo
        </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {markets.map((market) => (
          <Card key={market.id} className="border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-neutral-900/50 hover:border-emerald-400 dark:hover:border-emerald-700/80 transition-all duration-300">
            <CardHeader className="p-4 pb-3 border-b border-neutral-100 dark:border-neutral-800/50 bg-emerald-50/50 dark:bg-emerald-900/10">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" />
                {market.name}
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {market.options.map((opt) => (
                  <Button 
                    key={opt.id} 
                    variant="outline" 
                    className="flex flex-col items-center justify-center py-3 h-auto bg-neutral-50 hover:bg-emerald-50 border-neutral-200 hover:border-emerald-300 dark:bg-neutral-950/50 dark:hover:bg-emerald-950/30 dark:border-neutral-800 dark:hover:border-emerald-800 transition-colors"
                  >
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1 truncate w-full text-center">
                      {opt.name}
                    </span>
                    <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                      {opt.current_odds.toFixed(2)}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
