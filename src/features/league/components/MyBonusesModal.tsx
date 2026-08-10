import { useQuery } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatDateDDMMYYYY } from '@/lib/date';
import { Gift, Clock, AlertCircle } from 'lucide-react';

interface MyBonusesModalProps {
  isOpen: boolean;
  onClose: () => void;
  leagueId: string;
}

export const MyBonusesModal = ({ isOpen, onClose, leagueId }: MyBonusesModalProps) => {
  const { data: bonuses, isLoading, error } = useQuery({
    queryKey: ['league-bonuses', leagueId],
    queryFn: () => leagueApi.getMyBonuses(leagueId),
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl text-indigo-900 dark:text-indigo-100">
            <Gift className="w-5 h-5 mr-2 text-indigo-500" />
            Mis Bonos Disponibles
          </DialogTitle>
          <DialogDescription>
            Historial de bonos recibidos en esta liga.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Error al cargar los bonos.
            </div>
          ) : bonuses && bonuses.length > 0 ? (
            <div className="overflow-y-auto h-[300px] pr-4">
              <div className="space-y-3">
                {bonuses.map((bonus, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-indigo-100 dark:border-indigo-900/50 rounded-xl bg-white dark:bg-neutral-900 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 dark:text-neutral-100">
                          Bono S/. {bonus.amount.toFixed(2)}
                        </h4>
                        <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDateDDMMYYYY(bonus.created_at)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        bonus.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        bonus.status === 'USED' ? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400' :
                        'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {bonus.status === 'PENDING' ? 'Disponible' : bonus.status === 'USED' ? 'Usado' : 'Expirado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
              <Gift className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Sin bonos disponibles</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Aún no tienes bonos en esta liga.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
