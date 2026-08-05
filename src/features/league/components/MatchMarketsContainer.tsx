import { useQuery } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import type { MatchResponse } from '@/features/league/types/league.types';
import { MarketLiveEditor } from './MarketLiveEditor';

export const MatchMarketsContainer = ({ match }: { match: MatchResponse }) => {
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
