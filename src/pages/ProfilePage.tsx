import { useNavigate } from 'react-router-dom';
import { ProfileCard } from '@/features/profile/components/ProfileCard';
import { JoinLeagueModal } from '@/features/league/components/JoinLeagueModal';
import { LeagueList } from '@/features/league/components/LeagueList';
import { Button } from '@/components/ui/button';

export const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="py-6 space-y-8 max-w-4xl mx-auto px-4 sm:px-0">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
          <ProfileCard />
        </div>
        
        <div className="md:col-span-3 flex flex-col h-full">
          <div className="h-full flex flex-col justify-center bg-gradient-to-br from-white to-neutral-50 dark:from-[#1C1C1E] dark:to-[#121212] p-8 rounded-[2rem] border border-neutral-200 dark:border-white/[0.05] shadow-2xl relative overflow-hidden group">
            {/* Elemento decorativo de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-transform duration-700 group-hover:scale-110" />
            
            <div className="relative z-10 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight mb-2 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">Gestión</span>
                  de Ligas
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Crea tu propio torneo o únete a uno existente para empezar a competir.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button 
                  onClick={() => navigate('/leagues/create')}
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold uppercase py-5 rounded-xl text-sm shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  Crear Nueva Liga
                </Button>
                <div className="flex-1 flex *:w-full">
                  <JoinLeagueModal />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <LeagueList />
    </div>
  );
};