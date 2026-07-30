import { useEffect, useState } from 'react';
import { leagueApi } from '@/features/league/api/league.api';
import type { LeagueSummary } from '../types/league.types';
import { LeagueCard } from './LeagueCard';
import { Trophy } from 'lucide-react';

export const LeagueList = () => {
  const [leagues, setLeagues] = useState<LeagueSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await leagueApi.getUserLeagues();
        setLeagues(response.leagues);
      } catch (err: unknown) {
        console.error(err);
        setError('Ocurrió un error al cargar tus ligas');
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-neutral-200/50 dark:bg-neutral-800/50" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 text-center rounded-2xl bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!leagues || leagues.length === 0) {
    return (
      <div className="mt-8 text-center p-12 rounded-3xl bg-white/30 dark:bg-neutral-900/30 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 shadow-inner">
        <div className="w-20 h-20 mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-neutral-400" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          Aún no tienes ligas
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
          Crea una nueva liga para competir con tus amigos o únete a una existente con un código de invitación.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
        Tus Ligas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {leagues.map((league) => (
          <LeagueCard key={league.league_id} league={league} />
        ))}
      </div>
    </div>
  );
};
