import { useState } from 'react';
import { Settings, Trash2, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditLeagueModal } from '@/features/league/components/EditLeagueModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { GetLeagueDetailsResponse } from '../../types/league.types';

interface LeagueAdminSectionProps {
  league: GetLeagueDetailsResponse;
  onDelete: () => void;
  isDeleting: boolean;
}

export const LeagueAdminSection = ({ league, onDelete, isDeleting }: LeagueAdminSectionProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className="border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/20 backdrop-blur-md shadow-lg shadow-indigo-500/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Administración
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="w-full">
            <EditLeagueModal league={league} />
          </div>
          <div className="w-full">
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Liga
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-neutral-200/50 dark:border-neutral-800/50 shadow-2xl">
                <DialogHeader>
                  <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <DialogTitle className="text-xl font-bold text-center">
                    ¿Eliminar esta liga?
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Esta acción es irreversible. Se eliminarán todas las participaciones y el historial de la liga.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Eliminando...' : 'Sí, eliminar liga'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
