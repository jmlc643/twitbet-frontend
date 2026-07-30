import { Trophy, Users, ShieldCheck } from 'lucide-react';
import { AuthFormCard } from '@/features/auth/components/AuthFormCard';

export const LandingPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-140px)]">
      <div className="lg:col-span-7 space-y-8 text-left">
        <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Trophy size={14} /> La plataforma #1 de Ligas Privadas
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none uppercase">
          Apuesta con amigos, <span className="text-red-600">domina el ranking</span>.
        </h1>

        <p className="text-base sm:text-lg max-w-xl text-neutral-600 dark:text-neutral-400">
          TwitBet reinventa la experiencia de apuestas deportivas. Crea ligas privadas, simula predicciones en tiempo real y demuestra quién sabe más de fútbol.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl border bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 shadow-sm">
            <Users className="text-red-600 mb-2" size={24} />
            <h3 className="font-bold text-sm uppercase">Ligas Privadas</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Compite directamente contra tu grupo de amigos.</p>
          </div>
          <div className="p-4 rounded-xl border bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 shadow-sm">
            <Trophy className="text-red-600 mb-2" size={24} />
            <h3 className="font-bold text-sm uppercase">Cuotas en Vivo</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Predicciones dinámicas ajustadas al instante.</p>
          </div>
          <div className="p-4 rounded-xl border bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 shadow-sm">
            <ShieldCheck className="text-red-600 mb-2" size={24} />
            <h3 className="font-bold text-sm uppercase">100% Seguro</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Protección de cuenta y privacidad garantizadas.</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <AuthFormCard />
      </div>
    </div>
  );
};