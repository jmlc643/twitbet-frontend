import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Trophy, ChevronRight } from 'lucide-react';
import { leagueApi } from '@/features/league/api/league.api';
import type { MatchResponse } from '@/features/league/types/league.types';
import { mapMatchStatus, getStatusColor } from '@/features/league/utils/statusMapper';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateMarketModal } from './CreateMarketModal';

interface MatchCardProps {
  match: MatchResponse;
  isAdmin: boolean;
}

export const MatchCard = ({ match, isAdmin }: MatchCardProps) => {
  const navigate = useNavigate();

  const { data: markets = [] } = useQuery({
    queryKey: ['match-markets', match.id],
    queryFn: () => leagueApi.getMatchMarkets(match.id),
  });

  const previewMarkets = markets.slice(0, 3);
  const date = new Date(match.start_time);
  
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all duration-300 group overflow-hidden">
      <CardHeader className="p-4 pb-2 border-b border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/20">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 mb-1 flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-indigo-500" />
              {match.title}
            </h3>
            <div className="flex items-center space-x-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {date.toLocaleDateString()}
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
          {isAdmin && (
            <div className="shrink-0 ml-4">
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
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                  {market.name}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {market.options.map((opt) => (
                    <Button 
                      key={opt.id} 
                      variant="outline" 
                      className="flex flex-col items-center justify-center py-2 h-auto bg-neutral-50 hover:bg-indigo-50 border-neutral-200 hover:border-indigo-200 dark:bg-neutral-950/50 dark:hover:bg-indigo-950/30 dark:border-neutral-800 dark:hover:border-indigo-800 transition-colors"
                    >
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium mb-1 truncate w-full text-center">
                        {opt.name}
                      </span>
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        {opt.current_odds.toFixed(2)}
                      </span>
                    </Button>
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
            onClick={() => navigate(`/matches/${match.id}`)}
          >
            Ver todos los mercados (+{Math.max(0, markets.length - 3)})
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
