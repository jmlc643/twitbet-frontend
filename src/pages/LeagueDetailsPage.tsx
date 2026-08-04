import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LeagueHeaderSection } from '@/features/league/components/sections/LeagueHeaderSection';
import { LeagueAdminSection } from '@/features/league/components/sections/LeagueAdminSection';
import { LeagueRankingSection } from '@/features/league/components/sections/LeagueRankingSection';
import { LeagueMatchesSection } from '@/features/league/components/sections/LeagueMatchesSection';
import { LeagueMarketsSection } from '@/features/league/components/sections/LeagueMarketsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const LeagueDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: league, isLoading, isError } = useQuery({
    queryKey: ['league', id],
    queryFn: () => leagueApi.getLeagueDetails(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => leagueApi.deleteLeague(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLeagues'] });
      navigate('/profile');
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6 max-w-4xl animate-in fade-in duration-500">
        <div className="h-8 w-24 bg-zinc-800/50 rounded animate-pulse" />
        <Card className="border-white/5 bg-zinc-950/50 backdrop-blur-xl">
          <CardHeader>
            <div className="h-6 w-1/3 bg-zinc-800/50 rounded animate-pulse mb-2" />
            <div className="h-4 w-1/4 bg-zinc-800/50 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-24 w-full bg-zinc-800/50 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !league) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error al cargar la liga</h2>
        <Button onClick={() => navigate(-1)} variant="outline">
          Volver
        </Button>
      </div>
    );
  }

  const isAdmin = user?.id === league.admin_id;

  const handleDeleteLeague = () => {
    deleteMutation.mutate();
  };

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-5xl animate-in fade-in duration-500">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/profile')} 
        className="mb-4 text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Mis Ligas
      </Button>

      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LeagueHeaderSection league={league} />

        {/* Admin Panel */}
        {isAdmin && (
          <LeagueAdminSection 
            league={league} 
            onDelete={handleDeleteLeague} 
            isDeleting={deleteMutation.isPending} 
          />
        )}
      </div>

      {/* Sections via Tabs */}
      <Tabs defaultValue="ranking" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 h-12">
          <TabsTrigger value="ranking" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-950 font-semibold text-neutral-500 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400">
            Ranking
          </TabsTrigger>
          <TabsTrigger value="matches" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-950 font-semibold text-neutral-500 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400">
            Partidos
          </TabsTrigger>
          <TabsTrigger value="markets" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-950 font-semibold text-neutral-500 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400">
            Mercados Futuros
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ranking" className="mt-0">
          <LeagueRankingSection league={league} currentUserId={user?.id} />
        </TabsContent>
        
        <TabsContent value="matches" className="mt-0">
          <LeagueMatchesSection leagueId={league.league_id} isAdmin={isAdmin} />
        </TabsContent>
        
        <TabsContent value="markets" className="mt-0">
          <LeagueMarketsSection leagueId={league.league_id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
