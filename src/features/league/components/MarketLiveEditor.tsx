import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import type { MarketResponse, MarketOptionStatus } from '@/features/league/types/league.types';

import { MarketResolveModal } from './MarketResolveModal';
import { MarketCancelModal } from './MarketCancelModal';
import { MarketHeader } from './MarketHeader';
import { MarketOptionsGrid } from './MarketOptionsGrid';
import { MarketAddOptions } from './MarketAddOptions';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useMarketMutations } from '../hooks/useMarketMutations';

export const MarketLiveEditor = ({ market }: { market: MarketResponse }) => {
  const [odds, setOdds] = useState<Record<string, number>>(() => {
    const initialOdds: Record<string, number> = {};
    market.options.forEach(opt => {
      initialOdds[opt.id] = opt.current_odds;
    });
    return initialOdds;
  });

  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isAddingOptions, setIsAddingOptions] = useState(false);
  const [newOptions, setNewOptions] = useState<{ name: string; odds: string }[]>([]);
  
  const [isDeleteMarketModalOpen, setIsDeleteMarketModalOpen] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState<string | null>(null);

  useEffect(() => {
    setOdds((prevOdds) => {
      let changed = false;
      const newOdds = { ...prevOdds };
      market.options.forEach(opt => {
        if (newOdds[opt.id] !== opt.current_odds) {
          newOdds[opt.id] = opt.current_odds;
          changed = true;
        }
      });
      return changed ? newOdds : prevOdds;
    });
  }, [market.options]);

  const {
    statusMutation,
    oddsMutation,
    optionStatusMutation,
    addOptionsMutation,
    deleteMarketMutation,
    deleteOptionMutation,
  } = useMarketMutations(market, {
    onOddsUpdate: (newOdds) => setOdds(newOdds),
  });

  const handleStatusToggle = () => {
    const newStatus = market.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    statusMutation.mutate(newStatus);
  };

  const handleOddsChange = (optionId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setOdds(prev => ({ ...prev, [optionId]: numValue }));
    }
  };

  const handleSaveOdds = () => {
    const payload: Record<string, number> = {};
    market.options.forEach(opt => {
      payload[opt.id] = odds[opt.id] ?? opt.current_odds;
    });
    oddsMutation.mutate(payload);
  };

  const handleToggleOptionStatus = (optionId: string, currentStatus: MarketOptionStatus | undefined) => {
    optionStatusMutation.mutate({
      optionId,
      status: currentStatus === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED',
    });
  };

  const handleAddOptionRow = () => {
    setNewOptions(prev => [...prev, { name: '', odds: '' }]);
  };

  const handleRemoveOptionRow = (index: number) => {
    setNewOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewOptionChange = (index: number, field: 'name' | 'odds', value: string) => {
    setNewOptions(prev => prev.map((opt, i) => i === index ? { ...opt, [field]: value } : opt));
  };

  const handleSubmitNewOptions = () => {
    const validOptions = newOptions
      .filter(opt => opt.name.trim() !== '' && !isNaN(parseFloat(opt.odds)) && parseFloat(opt.odds) >= 1.01)
      .map(opt => ({ name: opt.name.trim(), odds: parseFloat(opt.odds) }));

    if (validOptions.length === 0) {
      toast.error('Ingresa al menos una opción válida (nombre y cuota mayor a 1).');
      return;
    }

    addOptionsMutation.mutate(validOptions);
  };

  const isSuspended = market.status === 'SUSPENDED';
  const isAutoCooldown = isSuspended && market.suspend_reason === 'AUTO_COOLDOWN';
  const isResolved = market.status === 'RESOLVED';
  const isVoided = market.status === 'VOIDED' || market.status === 'CANCELLED';
  const isFinished = isResolved || isVoided;

  return (
    <div className={`p-4 rounded-xl border ${isSuspended ? 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20' : isFinished ? 'border-neutral-200 bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 opacity-75' : 'border-indigo-200 dark:border-indigo-800/50 bg-white/50 dark:bg-neutral-900/50'}`}>
      
      {isAutoCooldown && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-sm font-medium rounded-lg border border-amber-200 dark:border-amber-800/50 flex items-center">
          <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-amber-500"></span>
          Mercado en enfriamiento automático por cambio brusco de cuotas.
        </div>
      )}
      
      <MarketHeader
        market={market}
        isSuspended={isSuspended}
        isFinished={isFinished}
        isResolved={isResolved}
        isVoided={isVoided}
        isPending={statusMutation.isPending}
        onCancel={() => setIsCancelModalOpen(true)}
        onResolve={() => setIsResolveModalOpen(true)}
        onToggleStatus={handleStatusToggle}
        onDelete={isFinished ? undefined : () => {
          setIsDeleteMarketModalOpen(true);
        }}
        isDeleting={deleteMarketMutation.isPending}
      />

      <MarketOptionsGrid
        market={market}
        odds={odds}
        isFinished={isFinished}
        isPendingStatus={optionStatusMutation.isPending}
        onOddsChange={handleOddsChange}
        onToggleOptionStatus={handleToggleOptionStatus}
        onDeleteOption={(optionId) => {
          if (market.options.length <= 2) {
            toast.error('El mercado debe tener al menos 2 opciones.');
            return;
          }
          setOptionToDelete(optionId);
        }}
        isDeletingOption={deleteOptionMutation.isPending}
      />

      {!isFinished && (
        <div className="flex justify-end mt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveOdds}
            disabled={oddsMutation.isPending || isSuspended}
            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Cuotas
          </Button>
        </div>
      )}

      {!isFinished && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <MarketAddOptions
            isAddingOptions={isAddingOptions}
            newOptions={newOptions}
            isPending={addOptionsMutation.isPending}
            onStartAdding={() => { setIsAddingOptions(true); setNewOptions([{ name: '', odds: '' }]); }}
            onCancelAdding={() => { setIsAddingOptions(false); setNewOptions([]); }}
            onAddRow={handleAddOptionRow}
            onRemoveRow={handleRemoveOptionRow}
            onChange={handleNewOptionChange}
            onSubmit={handleSubmitNewOptions}
          />
        </div>
      )}

      <MarketResolveModal
        market={market}
        isOpen={isResolveModalOpen}
        onOpenChange={setIsResolveModalOpen}
      />

      <MarketCancelModal
        market={market}
        isOpen={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
      />

      <ConfirmModal
        isOpen={isDeleteMarketModalOpen}
        onOpenChange={setIsDeleteMarketModalOpen}
        title="¿Eliminar Mercado?"
        description={`¿Estás seguro de eliminar el mercado "${market.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar Mercado"
        onConfirm={() => deleteMarketMutation.mutate()}
        isConfirming={deleteMarketMutation.isPending}
      />

      <ConfirmModal
        isOpen={optionToDelete !== null}
        onOpenChange={(open) => !open && setOptionToDelete(null)}
        title="¿Eliminar Opción?"
        description="¿Estás seguro de que deseas eliminar esta opción? Esta acción no se puede deshacer."
        confirmText="Eliminar Opción"
        onConfirm={() => {
          if (optionToDelete) {
            deleteOptionMutation.mutate(optionToDelete);
            setOptionToDelete(null);
          }
        }}
        isConfirming={deleteOptionMutation.isPending}
      />
    </div>
  );
};