import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { leagueApi } from '@/features/league/api/league.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Unlock, Save, CheckCircle, Ban, Plus, Trash2, Layers } from 'lucide-react';
import type { MarketOptionRequest, MarketResponse, MarketOptionStatus } from '@/features/league/types/league.types';
import { mapMarketType } from '@/features/league/utils/marketTypeMapper';
import { MarketResolveModal } from './MarketResolveModal';
import { MarketCancelModal } from './MarketCancelModal';

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
    onSuccess: invalidateMarket
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
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Error al agregar las opciones.');
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
  const isResolved = market.status === 'RESOLVED';
  const isVoided = market.status === 'VOIDED' || market.status === 'CANCELLED';
  const isFinished = isResolved || isVoided;

  return (
    <div className={`p-4 rounded-xl border ${isSuspended ? 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20' : isFinished ? 'border-neutral-200 bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 opacity-75' : 'border-indigo-200 dark:border-indigo-800/50 bg-white/50 dark:bg-neutral-900/50'}`}>
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            {market.name}
            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-full flex items-center">
              <Layers className="w-3 h-3 mr-1" />
              {mapMarketType(market.type)}
            </span>
            {isSuspended && !isFinished && <span className="text-xs px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded-full">Suspendido</span>}
            {isResolved && <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Resuelto</span>}
            {isVoided && <span className="text-xs px-2 py-1 bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 rounded-full">Anulado</span>}
          </h4>
        </div>
        {!isFinished && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              disabled={statusMutation.isPending}
              className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <Ban className="w-4 h-4 mr-2" />
              Anular
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResolveModalOpen(true)}
              disabled={statusMutation.isPending}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Resolver
            </Button>
            <Button
              variant={isSuspended ? 'default' : 'destructive'}
              size="sm"
              onClick={handleStatusToggle}
              disabled={statusMutation.isPending}
            >
              {isSuspended ? (
                <><Unlock className="w-4 h-4 mr-2" /> Desbloquear</>
              ) : (
                <><Lock className="w-4 h-4 mr-2" /> Bloquear</>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {market.options.map(opt => {
          const isBlocked = opt.status === 'BLOCKED';
          return (
            <div key={opt.id} className={`space-y-1 border rounded-lg p-2 ${isBlocked ? 'border-red-300 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20' : 'border-neutral-200 dark:border-neutral-800'}`}>
              <div className="flex items-center justify-between gap-1">
                <label className={`text-xs font-medium truncate block ${isBlocked ? 'text-red-500 dark:text-red-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                  {opt.name}
                  {isBlocked && <span className="ml-1 text-[10px] font-bold uppercase">(Bloqueada)</span>}
                </label>
                {!isFinished && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 shrink-0 ${isBlocked ? 'text-emerald-600 hover:text-emerald-700' : 'text-red-500 hover:text-red-600'}`}
                    onClick={() => handleToggleOptionStatus(opt.id, opt.status)}
                    disabled={optionStatusMutation.isPending}
                    title={isBlocked ? 'Desbloquear opción' : 'Bloquear opción'}
                  >
                    {isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  </Button>
                )}
              </div>
              <Input
                type="number"
                step="0.01"
                min="1.01"
                value={odds[opt.id] ?? opt.current_odds}
                onChange={(e) => handleOddsChange(opt.id, e.target.value)}
                className="font-mono"
                disabled={isFinished}
              />
            </div>
          );
        })}
      </div>

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
          {!isAddingOptions ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setIsAddingOptions(true); setNewOptions([{ name: '', odds: '' }]); }}
              className="text-indigo-600 dark:text-indigo-400"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Opciones
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Nuevas opciones</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddOptionRow}
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  <Plus className="w-4 h-4 mr-1" /> Agregar fila
                </Button>
              </div>

              <div className="space-y-2">
                {newOptions.map((opt, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Nombre de la opción"
                      value={opt.name}
                      onChange={(e) => handleNewOptionChange(index, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      min="1.01"
                      placeholder="Cuota"
                      value={opt.odds}
                      onChange={(e) => handleNewOptionChange(index, 'odds', e.target.value)}
                      className="w-24 font-mono"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOptionRow(index)}
                      disabled={newOptions.length === 1}
                      className="shrink-0 h-9 w-9 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setIsAddingOptions(false); setNewOptions([]); }}
                  disabled={addOptionsMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitNewOptions}
                  disabled={addOptionsMutation.isPending || newOptions.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {addOptionsMutation.isPending ? 'Agregando...' : 'Agregar Opciones'}
                </Button>
              </div>
            </div>
          )}
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