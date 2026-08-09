import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DeleteLeagueModalProps {
  onDelete: () => void;
  isDeleting: boolean;
}

export const DeleteLeagueModal = ({ onDelete, isDeleting }: DeleteLeagueModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            onClick={() => setIsOpen(false)}
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
  );
};
