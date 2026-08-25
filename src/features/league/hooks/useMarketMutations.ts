import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { leagueApi } from '@/features/league/api/league.api';
import type { MarketOptionRequest, MarketResponse, MarketOptionStatus } from '@/features/league/types/league.types';

export const useMarketMutations = (
  market: MarketResponse, 
  options?: { onOddsUpdate?: (odds: Record<string, number>) => void }
) => {
  const queryClient = useQueryClient();

  const invalidateMarket = () => {
    if (market.match_id) {
      queryClient.invalidateQueries({ queryKey: ['match-markets', market.match_id] });
      queryClient.invalidateQueries({ queryKey: ['league-matches', market.league_id] });
      queryClient.invalidateQueries({ queryKey: ['match-details'] });
    } else {
      queryClient.invalidateQueries({ queryKey: ['league-markets', market.league_id] });
    }
    queryClient.invalidateQueries({ queryKey: ['league-markets'] });
    queryClient.invalidateQueries({ queryKey: ['league-matches'] });
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
      if (data?.odds && options?.onOddsUpdate) {
        options.onOddsUpdate(data.odds);
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
      toast.success('Opciones agregadas exitosamente.');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string; hint?: string } } };
      const errorData = error.response?.data;
      toast.error(errorData?.hint || errorData?.error || 'Error al agregar las opciones.');
    }
  });

  const deleteMarketMutation = useMutation({
    mutationFn: () => leagueApi.deleteMarket(market.id),
    onSuccess: (data) => {
      toast.success(data?.message || 'Mercado eliminado correctamente.');
      invalidateMarket();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { status?: number; data?: { error?: string; code?: string } } };
      const msg = error.response?.data?.error;
      if (error.response?.status === 409) {
        toast.error(msg || 'No se puede eliminar el mercado porque tiene apuestas asociadas.');
      } else {
        toast.error(msg || 'Error al eliminar el mercado.');
      }
    }
  });

  const deleteOptionMutation = useMutation({
    mutationFn: (optionId: string) => leagueApi.deleteMarketOption(market.id, optionId),
    onSuccess: (data) => {
      toast.success(data?.message || 'Opción eliminada correctamente.');
      invalidateMarket();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { status?: number; data?: { error?: string } } };
      const msg = error.response?.data?.error;
      if (error.response?.status === 409) {
        toast.error(msg || 'No se puede eliminar la opción (mínimo 2 opciones o tiene apuestas).');
      } else {
        toast.error(msg || 'Error al eliminar la opción.');
      }
    }
  });

  return {
    statusMutation,
    oddsMutation,
    optionStatusMutation,
    addOptionsMutation,
    deleteMarketMutation,
    deleteOptionMutation,
  };
};
