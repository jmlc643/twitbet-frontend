import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { leagueApi } from '@/features/league/api/league.api';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import type { MarketOptionRequest, MarketResponse, MarketOptionStatus } from '@/features/league/types/league.types';

import { MarketResolveModal } from './MarketResolveModal';
import { MarketCancelModal } from './MarketCancelModal';
import { MarketHeader } from './MarketHeader';
import { MarketOptionsGrid } from './MarketOptionsGrid';
import { MarketAddOptions } from './MarketAddOptions';

export const MarketLiveEditor = ({ market }: { market: MarketResponse }) => {
  const queryClient = useQueryClient();
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

  const invalidateMarket = () => {
    if (market.match_id) {
      queryClient.invalidateQueries({ queryKey: ['match-markets', market.match_id] });
    } else {
      queryClient.invalidateQueries({ queryKey: ['league-markets', market.league_id] });
    }
  };

  const statusMutation = useMutation({
    mutationFn: (newStatus: 'ACTIVE' | 'SUSPENDED') =>
      leagueApi.updateMarketStatus(market.id, { status: newStatus }),
    onSuccess: invalidateMarket
  });

  const oddsMutation = useMutation({
    mutationFn: (newOdds: Record<string, number>) =>
      leagueApi.updateMarketOdds(market.id, { options_odds: newOdds }),
    onSuccess: (data) => {
      if (data?.odds) {
        setOdds(data.odds);
      }
      invalidateMarket();
      toast.success(data?.message || 'Cuotas actualizadas exitosamente');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { status?: number; data?: { error?: string; hint?: string } } };
      const errorData = error.response?.data;
      
      if (error.response?.status === 422) {
        if (errorData?.hint) {
          toast.error(errorData.hint);
        } else {
          toast.error(errorData?.error ? `Error: ${errorData.error}` : 'Error de validación al actualizar cuotas.');
        }
      } else {
        toast.error(errorData?.error || 'Error al actualizar las cuotas.');
      }
    }
  });

  const optionStatusMutation = useMutation({
    mutationFn: ({ optionId, status }: { optionId: string; status: MarketOptionStatus }) =>
      leagueApi.updateMarketOptionStatus(market.id, optionId, { status }),
    onSuccess: () => {
      invalidateMarket();
      toast.success('El estado de la opción fue actualizado.');
    }
  });

  const addOptionsMutation = useMutation({
    mutationFn: (options: MarketOptionRequest[]) =>
      leagueApi.addMarketOptions(market.id, { options }),
    onSuccess: () => {
      invalidateMarket();
      setNewOptions([]);
      setIsAddingOptions(false);
      toast.success('Opciones agregadas exitosamente.');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string; hint?: string } } };
      const errorData = error.response?.data;
      toast.error(errorData?.hint || errorData?.error || 'Error al agregar las opciones.');
    }
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
      />

      <MarketOptionsGrid
        market={market}
        odds={odds}
        isFinished={isFinished}
        isPendingStatus={optionStatusMutation.isPending}
        onOddsChange={handleOddsChange}
        onToggleOptionStatus={handleToggleOptionStatus}
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
    </div>
  );
};