import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, Wallet } from 'lucide-react';
import type { GetLeagueDetailsResponse } from '../../types/league.types';

interface LeagueHeaderSectionProps {
  league: GetLeagueDetailsResponse;
  isAdmin?: boolean;
}

export const LeagueHeaderSection = ({ league, isAdmin = true }: LeagueHeaderSectionProps) => {
  return (
    <Card className={`${isAdmin ? 'md:col-span-2' : 'md:col-span-3'} border-neutral-200 dark:border-white/10 bg-white dark:bg-zinc-950/80 backdrop-blur-md shadow-2xl relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
          {league.name}
        </CardTitle>
        <CardDescription className="text-neutral-500 dark:text-zinc-400 flex items-center mt-2">
          Creado el {new Date(league.created_at).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-4">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-neutral-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">Código Inv.</span>
            <span className="text-lg font-mono font-medium text-emerald-600 dark:text-emerald-400">{league.invite_code}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-neutral-500 dark:text-zinc-500 uppercase tracking-wider font-semibold flex items-center"><Wallet className="w-3 h-3 mr-1"/> Saldo Inicial</span>
            <span className="text-lg font-medium text-neutral-900 dark:text-white">${league.initial_balance}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-neutral-500 dark:text-zinc-500 uppercase tracking-wider font-semibold flex items-center"><Users className="w-3 h-3 mr-1"/> Participantes</span>
            <span className="text-lg font-medium text-neutral-900 dark:text-white">{league.participants?.length || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
