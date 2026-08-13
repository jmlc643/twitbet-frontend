import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { CreateMarketForm } from './CreateMarketForm';

interface CreateMarketModalProps {
  leagueId: string;
  matchId?: string;
}

export const CreateMarketModal = ({ leagueId, matchId }: CreateMarketModalProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:border-emerald-500/30 dark:text-emerald-300 transition-colors">
          <TrendingUp className="w-4 h-4 mr-2" />
          Crear Mercado {matchId ? 'del Partido' : 'Futuro (Liga)'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-neutral-200/50 dark:border-neutral-800/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
            Nuevo Mercado {matchId ? 'del Partido' : 'Futuro'}
          </DialogTitle>
          <DialogDescription>
            {matchId 
              ? 'Agrega un mercado específico para este partido (ej. Ganador, Over/Under).' 
              : 'Agrega un mercado a largo plazo para todo el torneo (ej. Campeón, Goleador).'}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <CreateMarketForm 
            leagueId={leagueId} 
            matchId={matchId} 
            onSuccess={handleSuccess} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
