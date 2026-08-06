import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Receipt } from 'lucide-react';
import { BetTicket } from '../bets/BetTicket';
import { BetFilters } from '../bets/BetFilters';
import { BetPagination } from '../bets/BetPagination';

interface LeagueBetsSectionProps {
  leagueId: string;
}

type FilterType = 'ALL' | 'ACCEPTED' | 'WON' | 'LOST' | 'VOIDED';

export const LeagueBetsSection = ({ leagueId }: LeagueBetsSectionProps) => {
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const formatRFC3339 = (dateStr: string, isEnd: boolean = false) => {
    if (!dateStr) return undefined;
    const d = new Date(dateStr + "T00:00:00");
    if (isEnd) {
      d.setHours(23, 59, 59, 999);
    }
    return d.toISOString();
  };

  const { data: betsResponse, isLoading } = useQuery({
    queryKey: ['participantBets', leagueId, filter, page, limit, startDate, endDate],
    queryFn: () => leagueApi.getParticipantBets(
      leagueId, 
      filter === 'ALL' ? undefined : filter, 
      page, 
      limit, 
      formatRFC3339(startDate),
      formatRFC3339(endDate, true)
    ),
  });

  const bets = betsResponse?.data || [];
  const meta = betsResponse?.meta;

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-neutral-900 dark:text-neutral-100">
          <Receipt className="w-5 h-5 mr-2 text-indigo-500" />
          Mis Apuestas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BetFilters 
          filter={filter}
          setFilter={setFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setPage={setPage}
        />

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-neutral-100 dark:bg-neutral-800/50 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : bets.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400 italic">
            No tienes apuestas en esta categoría.
          </div>
        ) : (
          <div className="space-y-4">
            {bets.map((bet) => (
              <BetTicket key={bet.id} bet={bet} />
            ))}
          </div>
        )}

        {meta && meta.total > 0 && (
          <BetPagination 
            meta={meta}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            isLoading={isLoading}
          />
        )}
      </CardContent>
    </Card>
  );
};
