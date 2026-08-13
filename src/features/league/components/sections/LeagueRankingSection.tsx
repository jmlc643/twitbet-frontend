import { Trophy, EyeOff, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { GetLeagueDetailsResponse } from '../../types/league.types';
import { useQuery } from '@tanstack/react-query';
import { leagueApi } from '../../api/league.api';

interface LeagueRankingSectionProps {
  league: GetLeagueDetailsResponse;
  currentUserId?: string;
}

export const LeagueRankingSection = ({ league, currentUserId }: LeagueRankingSectionProps) => {
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard', league.league_id],
    queryFn: () => leagueApi.getLeaderboard(league.league_id),
  });

  if (isLoading) {
    return <div className="text-center py-4">Cargando clasificación...</div>;
  }

  const isFinalized = league.status === 'FINALIZED';
  const leaderboard = leaderboardData?.leaderboard || [];
  const hideStandings = leaderboardData?.hide_standings;

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold flex items-center text-neutral-900 dark:text-zinc-100">
        <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
        Clasificación {isFinalized && <span className="ml-2 text-xs font-bold px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full uppercase">Finalizada</span>}
      </h3>

      {hideStandings && !isFinalized && leaderboard.length === 0 ? (
        <Card className="border-neutral-200 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-neutral-100 dark:bg-zinc-800/50 mb-4">
              <EyeOff className="w-8 h-8 text-neutral-400 dark:text-zinc-400" />
            </div>
            <h4 className="text-lg font-semibold text-neutral-800 dark:text-zinc-200 mb-2">Ranking Oculto</h4>
            <p className="text-neutral-500 dark:text-zinc-500 max-w-md">
              La liga no permite mostrar los puestos hasta que finalice o el administrador decida revelarlos
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white dark:bg-zinc-950/60 border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 dark:text-zinc-400 uppercase bg-neutral-50 dark:bg-zinc-900/80 border-b border-neutral-200 dark:border-white/5">
                <tr>
                  <th scope="col" className="px-3 sm:px-6 py-4 font-semibold">Pos</th>
                  <th scope="col" className="px-3 sm:px-6 py-4 font-semibold">Jugador</th>
                  <th scope="col" className="px-3 sm:px-6 py-4 font-semibold text-right">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((participant, index) => {
                  const isUnranked = participant.is_unranked;
                  const balanceHidden = participant.balance === null;

                  return (
                    <tr 
                      key={participant.participant_id} 
                      className={`
                        border-b border-neutral-100 dark:border-white/5 transition-colors duration-200 group
                        ${isUnranked ? 'opacity-50 grayscale hover:grayscale-0' : 'hover:bg-neutral-50 dark:hover:bg-white/5'}
                        ${isFinalized && participant.position === 1 ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''}
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <td className="px-3 sm:px-6 py-4 font-medium">
                        {isUnranked ? (
                          <div className="flex items-center justify-center text-xs font-bold text-neutral-400">
                            -
                          </div>
                        ) : (
                          <div className={`
                            flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm
                            ${participant.position === 1 ? 'bg-yellow-500/20 text-yellow-500 ring-1 ring-yellow-500/50' : 
                              participant.position === 2 ? 'bg-zinc-300/20 text-zinc-300 ring-1 ring-zinc-300/50' : 
                              participant.position === 3 ? 'bg-amber-700/20 text-amber-600 ring-1 ring-amber-700/50' : 
                              'bg-neutral-100 text-neutral-500 dark:bg-zinc-800 dark:text-zinc-400'}
                          `}>
                            {participant.position}
                          </div>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          {participant.profile_picture ? (
                            <img 
                              src={participant.profile_picture} 
                              alt={participant.username} 
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover shadow-lg shrink-0"
                            />
                          ) : (
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shrink-0 text-xs sm:text-sm">
                              {participant.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-medium text-neutral-800 dark:text-zinc-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors truncate">
                                {participant.username}
                              </span>
                              {isFinalized && participant.position === 1 && (
                                <Award className="w-4 h-4 text-yellow-500 shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center flex-wrap gap-1.5 mt-1">
                              {participant.role === 'OWNER' && (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-sm uppercase tracking-wider">
                                  Dueño
                                </span>
                              )}
                              {participant.role === 'ADMIN' && (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-sm uppercase tracking-wider">
                                  Admin
                                </span>
                              )}
                              {participant.user_id === currentUserId && (
                                <span className="px-2 py-0.5 text-[10px] font-medium bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-500/30">
                                  Tú
                                </span>
                              )}
                              {isUnranked && (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 rounded-sm uppercase tracking-wider">
                                  Sin clasificación
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-right">
                        {balanceHidden ? (
                          <span className="font-medium text-neutral-400 dark:text-zinc-500 italic">
                            Oculto
                          </span>
                        ) : (
                          <span className="font-mono text-base font-semibold text-emerald-600 dark:text-emerald-400">
                            S/. {participant.balance!.toFixed(2)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 sm:px-6 py-8 text-center text-neutral-500 dark:text-zinc-500">
                      No hay participantes en esta liga aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
