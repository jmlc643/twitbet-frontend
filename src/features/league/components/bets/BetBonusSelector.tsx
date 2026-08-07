import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BonusResponse } from '@/features/league/types/league.types';

interface BetBonusSelectorProps {
  pendingBonuses: BonusResponse[];
  selectedBonusId: string | null;
  onSelectBonus: (bonusId: string | null, amount: number | null) => void;
}

export const BetBonusSelector = ({
  pendingBonuses,
  selectedBonusId,
  onSelectBonus
}: BetBonusSelectorProps) => {
  if (pendingBonuses.length === 0) return null;

  return (
    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-amber-800 dark:text-amber-400 text-sm font-medium">
          <Gift className="w-4 h-4 mr-2" />
          Apuesta Gratuita Disponible
        </div>
        {pendingBonuses.length === 1 ? (
          <Button 
            variant="outline" 
            size="sm"
            className={`text-xs h-7 px-3 rounded-full transition-colors ${selectedBonusId ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:text-white' : 'text-amber-700 border-amber-300 hover:bg-amber-100 hover:text-amber-800 dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-900'}`}
            onClick={() => {
              if (selectedBonusId) {
                onSelectBonus(null, null);
              } else {
                onSelectBonus(pendingBonuses[0].id, pendingBonuses[0].amount);
              }
            }}
          >
            {selectedBonusId ? 'Bono Aplicado' : `Usar S/. ${pendingBonuses[0].amount.toFixed(2)}`}
          </Button>
        ) : (
          <select 
            className="text-xs bg-white dark:bg-neutral-900 border border-amber-300 dark:border-amber-700 rounded-md px-2 py-1 text-amber-900 dark:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            value={selectedBonusId || ''}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                onSelectBonus(null, null);
              } else {
                const b = pendingBonuses.find(x => x.id === val);
                if (b) onSelectBonus(val, b.amount);
              }
            }}
          >
            <option value="">No usar bono</option>
            {pendingBonuses.map(b => (
              <option key={b.id} value={b.id}>Usar S/. {b.amount.toFixed(2)}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};
