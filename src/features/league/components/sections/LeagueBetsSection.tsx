import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Receipt, List } from 'lucide-react';
import { BetTicket } from '../bets/BetTicket';
import { CombinedBetTicket } from '../bets/CombinedBetTicket';
import { BetFilters } from '../bets/BetFilters';
import { BetPagination } from '../bets/BetPagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [activeTab, setActiveTab] = useState<'single' | 'combined'>('single');

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

  const { data: combinedBetsResponse, isLoading: isLoadingCombined } = useQuery({
    queryKey: ['user-combined-bets', leagueId, filter, page, limit, startDate, endDate],
    queryFn: () => leagueApi.getUserCombinedBets(
      leagueId,
      filter === 'ALL' ? undefined : filter,
      page,
      limit,
      formatRFC3339(startDate),
      formatRFC3339(endDate, true)
    ),
    enabled: activeTab === 'combined',
  });

  const combinedBets = combinedBetsResponse?.data || [];
  const combinedMeta = combinedBetsResponse?.meta;

  return (
    <Card className="border border-neutral-800 bg-[#0A0A0A] shadow-lg text-white">
      <CardHeader className="border-b border-neutral-800/50 pb-4">
        <CardTitle className="flex items-center text-xl font-bold">
          <Receipt className="w-5 h-5 mr-3 text-indigo-400" />
          Mis Apuestas
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'single' | 'combined')} className="w-full">
          <TabsList className="mb-8 w-full inline-flex h-12 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 p-1 text-neutral-400">
            <TabsTrigger 
              value="single" 
              className="flex-1 flex items-center justify-center px-6 h-full rounded-lg data-[state=active]:bg-neutral-800 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              <List className="w-4 h-4 mr-2" /> Simples
            </TabsTrigger>
            <TabsTrigger 
              value="combined" 
              className="flex-1 flex items-center justify-center px-6 h-full rounded-lg data-[state=active]:bg-neutral-800 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              <Receipt className="w-4 h-4 mr-2" /> Combinadas
            </TabsTrigger>
          </TabsList>

          <BetFilters 
            filter={filter}
            setFilter={setFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            setPage={setPage}
          />

          <TabsContent value="single" className="space-y-6 mt-0">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-neutral-100 dark:bg-neutral-800/50 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : bets.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 dark:text-neutral-400 italic">
                No tienes apuestas simples en esta liga.
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
          </TabsContent>

          <TabsContent value="combined" className="space-y-6 mt-0">
            {isLoadingCombined ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-neutral-100 dark:bg-neutral-800/50 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : combinedBets.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 dark:text-neutral-400 italic">
                No tienes apuestas combinadas aún.
              </div>
            ) : (
              <div className="space-y-4">
                {combinedBets.map((bet) => (
                  <CombinedBetTicket key={bet.id} bet={bet} />
                ))}
              </div>
            )}

            {combinedMeta && combinedMeta.total > 0 && (
              <BetPagination 
                meta={combinedMeta}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                isLoading={isLoadingCombined}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
