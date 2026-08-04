import { useQuery } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { MatchCard } from '../MatchCard';

interface LeagueMatchesSectionProps {
  leagueId: string;
  isAdmin: boolean;
}

export const LeagueMatchesSection = ({ leagueId, isAdmin }: LeagueMatchesSectionProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['league-matches', leagueId],
    queryFn: () => leagueApi.getMatches(leagueId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500">
        {[1, 2].map((i) => (
          <div key={i} className="h-64 w-full bg-zinc-800/20 dark:bg-zinc-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-10 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/30">
        <p className="text-red-500 font-medium">Error al cargar los partidos de la liga.</p>
      </div>
    );
  }

  if (data.matches === null || data.matches.length === 0) {
    return (
      <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900/20 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
        <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-2">No hay partidos programados en esta liga.</p>
        {isAdmin && <p className="text-sm text-neutral-400 dark:text-neutral-500">Usa el panel de administración para crear uno.</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
          Próximos Partidos
        </h2>
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
          {data.total} en total
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {data.matches.map((match) => (
          <MatchCard key={match.id} match={match} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
};
