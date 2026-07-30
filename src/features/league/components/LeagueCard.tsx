import { Link } from 'react-router-dom';
import { Users, Coins, Crown, Shield } from 'lucide-react';
import type { LeagueSummary } from '../types/league.types';

interface LeagueCardProps {
  league: LeagueSummary;
}

export const LeagueCard = ({ league }: LeagueCardProps) => {
  const isAdmin = league.role === 'ADMIN';

  return (
    <Link 
      to={`/leagues/${league.league_id}`}
      className="block relative group overflow-hidden rounded-[2rem] bg-gradient-to-br from-white to-neutral-50 dark:from-[#1C1C1E] dark:to-[#121212] border border-neutral-200 dark:border-white/[0.05] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/[0.02] dark:from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Glow effect */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[50px] rounded-full transition-all duration-700 pointer-events-none ${isAdmin ? 'bg-amber-500/20 group-hover:bg-amber-500/30' : 'bg-blue-500/10 group-hover:bg-blue-500/20'}`} />

      <div className="p-8 h-full flex flex-col justify-between relative z-10">
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white line-clamp-2">
              {league.name}
            </h3>
            
            <span 
              className={`
                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider
                ${isAdmin 
                  ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/10 dark:text-amber-500 border dark:border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                  : 'bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-white/5 dark:text-neutral-400 dark:border-white/10'}
              `}
            >
              {isAdmin ? <Crown className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
              {league.role}
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-white/[0.05] flex justify-between items-center text-sm font-bold">
          <div className="flex flex-col">
            <span className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">Participantes</span>
            <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
              <Users className="w-4 h-4 text-neutral-400" />
              <span className="text-lg">{league.participant_count}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">Balance</span>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
              <Coins className="w-4 h-4" />
              <span className="text-lg">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0
                }).format(league.balance)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
