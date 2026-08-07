import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift } from 'lucide-react';
import { toast } from 'sonner';

interface GrantBonusModalProps {
  leagueId: string;
}

export const GrantBonusModal = ({ leagueId }: GrantBonusModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const grantBonusMutation = useMutation({
    mutationFn: (bonusAmount: number) => 
      leagueApi.grantBonus(leagueId, { amount: bonusAmount }),
    onSuccess: () => {
      setIsOpen(false);
      setAmount('');
      setError(null);
      toast.success('Bonos otorgados exitosamente a todos los participantes.');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Error al otorgar bonos');
    }
  });

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Por favor, ingresa un monto válido.');
      return;
    }
    setError(null);
    grantBonusMutation.mutate(numAmount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 dark:border-amber-900/50 dark:text-amber-500 dark:hover:bg-amber-950/30 transition-colors"
        >
          <Gift className="w-4 h-4 mr-2" />
          Otorgar Bono
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl text-indigo-900 dark:text-indigo-100">
            <Gift className="w-5 h-5 mr-2 text-indigo-500" />
            Otorgar Bono Global
          </DialogTitle>
          <DialogDescription>
            Este bono se otorgará a todos los participantes de la liga. Los bonos no son acumulables.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Monto del Bono (S/.)
            </label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={grantBonusMutation.isPending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={grantBonusMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {grantBonusMutation.isPending ? 'Otorgando...' : 'Otorgar Bonos'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
