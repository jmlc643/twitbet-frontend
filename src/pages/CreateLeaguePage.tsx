import { CreateLeagueForm } from '@/features/league/components/CreateLeagueForm';

export const CreateLeaguePage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-600/5 dark:bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/5 dark:bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="text-center text-3xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
          TwitBet Leagues
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Demuestra quién es el mejor pronosticador.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <CreateLeagueForm />
      </div>
    </div>
  );
};
