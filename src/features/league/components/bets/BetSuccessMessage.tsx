import { CheckCircle2 } from 'lucide-react';

export const BetSuccessMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
      <CheckCircle2 className="w-16 h-16 text-emerald-500" />
      <div className="text-center">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">¡Apuesta Confirmada!</h3>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Tu apuesta se ha registrado exitosamente.</p>
      </div>
    </div>
  );
};
