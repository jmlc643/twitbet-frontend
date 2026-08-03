import { Trophy, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { GetLeagueDetailsResponse } from '../../types/league.types';

interface LeagueRankingSectionProps {
  league: GetLeagueDetailsResponse;
  currentUserId?: string;
}

export const LeagueRankingSection = ({ league, currentUserId }: LeagueRankingSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold flex items-center text-neutral-900 dark:text-zinc-100">
        <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
        Clasificación
      </h3>

      {!league.is_ranking_visible ? (
        <Card className="border-neutral-200 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-neutral-100 dark:bg-zinc-800/50 mb-4">
              <EyeOff className="w-8 h-8 text-neutral-400 dark:text-zinc-400" />
            </div>
            <h4 className="text-lg font-semibold text-neutral-800 dark:text-zinc-200 mb-2">Ranking Oculto</h4>
            <p className="text-neutral-500 dark:text-zinc-500 max-w-md">
              El ranking de esta liga es privado. Las posiciones permanecen ocultas por decisión del administrador.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white dark:bg-zinc-950/60 border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 dark:text-zinc-400 uppercase bg-neutral-50 dark:bg-zinc-900/80 border-b border-neutral-200 dark:border-white/5">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Pos</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Jugador</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {league.participants && [...league.participants].sort((a, b) => a.position - b.position).map((participant, index) => (
                  <tr 
                    key={participant.participant_id} 
                    className="border-b border-neutral-100 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors duration-200 group"
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <td className="px-6 py-4 font-medium">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full font-bold
                        ${participant.position === 1 ? 'bg-yellow-500/20 text-yellow-500 ring-1 ring-yellow-500/50' : 
                          participant.position === 2 ? 'bg-zinc-300/20 text-zinc-300 ring-1 ring-zinc-300/50' : 
                          participant.position === 3 ? 'bg-amber-700/20 text-amber-600 ring-1 ring-amber-700/50' : 
                          'bg-neutral-100 text-neutral-500 dark:bg-zinc-800 dark:text-zinc-400'}
                      `}>
                        {participant.position}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {participant.profile_picture ? (
                          <img 
                            src={participant.profile_picture} 
                            alt={participant.username} 
                            className="w-8 h-8 rounded-full object-cover shadow-lg"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
                            {participant.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-neutral-800 dark:text-zinc-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                          {participant.username}
                        </span>
                        {participant.user_id === currentUserId && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-500/30">
                            Tú
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-base font-semibold text-emerald-600 dark:text-emerald-400">
                        ${participant.balance.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!league.participants || league.participants.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-neutral-500 dark:text-zinc-500">
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
