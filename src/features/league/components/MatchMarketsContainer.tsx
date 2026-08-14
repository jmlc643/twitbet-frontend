import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import type { MatchResponse } from '@/features/league/types/league.types';
import { MarketLiveEditor } from './MarketLiveEditor';
import { mapMatchStatus } from '@/features/league/utils/statusMapper';

export const MatchMarketsContainer = ({ match }: { match: MatchResponse }) => {
  const queryClient = useQueryClient();
  const markets = match.markets || [];

  const statusMutation = useMutation({
    mutationFn: (newStatus: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'VOIDED') => 
      leagueApi.updateMatchStatus(match.id, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league-matches', match.league_id] });
      queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
    }
  });


  if (markets.length === 0) return null;

  return (
    <Card className="mb-6 border-indigo-100 dark:border-indigo-950 shadow-sm">
      <CardHeader className="py-4 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h3 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center min-w-0">
          <Activity className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
          <span className="truncate">{match.title}</span>
        </h3>
        
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-neutral-500">Estado:</span>
          <select 
            className="text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none"
            value={match.status}
            onChange={(e) => statusMutation.mutate(e.target.value as 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'VOIDED')}
            disabled={statusMutation.isPending}
          >
            <option value="SCHEDULED">{mapMatchStatus('SCHEDULED')}</option>
            <option value="LIVE">{mapMatchStatus('LIVE')}</option>
            <option value="FINISHED">{mapMatchStatus('FINISHED')}</option>
            <option value="VOIDED">{mapMatchStatus('VOIDED')}</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {markets.map(market => (
          <MarketLiveEditor key={market.id} market={market} />
        ))}
      </CardContent>
    </Card>
  );
};
