import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity } from 'lucide-react';

import { MarketLiveEditor } from '@/features/league/components/MarketLiveEditor';
import { MatchMarketsContainer } from '@/features/league/components/MatchMarketsContainer';


export const LeagueLiveConsolePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: league, isLoading: loadingLeague } = useQuery({
    queryKey: ['league', slug],
    queryFn: () => leagueApi.getLeagueDetails(slug!),
    enabled: !!slug,
  });

  const leagueId = league?.league_id;

  const { data: matchesData } = useQuery({
    queryKey: ['league-matches', leagueId],
    queryFn: () => leagueApi.getMatches(leagueId!, 1, 100),
    enabled: !!leagueId,
  });

  const { data: leagueMarkets = [] } = useQuery({
    queryKey: ['league-markets', leagueId],
    queryFn: () => leagueApi.getLeagueMarkets(leagueId!),
    enabled: !!leagueId,
  });

  if (loadingLeague) {
    return <div className="container mx-auto p-4 flex justify-center items-center h-screen"><Activity className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  if (!league) {
    return <div className="text-center p-8">Liga no encontrada.</div>;
  }

  const currentParticipant = league.participants?.find(p => p.user_id === user?.id);
  const isOwner = user?.id === league.owner_id;
  const isAdmin = isOwner || currentParticipant?.role === 'ADMIN';

  if (!isAdmin) {
    navigate(`/leagues/${slug}`);
    return null;
  }

  const matches = matchesData?.matches || [];

  return (
    <div className="container mx-auto p-4 max-w-5xl animate-in fade-in duration-500">
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/leagues/${slug}`)} 
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
