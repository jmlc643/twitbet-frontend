import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import type { MarketResponse, GetMatchesResponse } from '@/features/league/types/league.types';
import { useBetSlipStore } from '@/store/useBetSlipStore';

export const useActiveBetBlocks = (leagueId: string | undefined) => {
  const queryClient = useQueryClient();
  const selections = useBetSlipStore(s => s.selections);

  const { data: singleBets } = useQuery({
    queryKey: ['participantBets', leagueId, 'ACCEPTED', 1, 50],
    queryFn: () => leagueApi.getParticipantBets(leagueId!, 'ACCEPTED', 1, 50),
    enabled: !!leagueId,
    staleTime: 30000,
  });

  const { data: combinedBets } = useQuery({
    queryKey: ['user-combined-bets-blocks', leagueId],
    queryFn: () => leagueApi.getUserCombinedBets(leagueId!, 'PENDING', 1, 50),
    enabled: !!leagueId,
    staleTime: 30000,
  });

  const blockedKeys = useMemo(() => {
    const keys = new Set<string>();

    // Helper: resolver market por id desde cache
    const findMarket = (marketId: string): MarketResponse | undefined => {
      const leagueMarkets = queryClient.getQueryData<MarketResponse[]>(['league-markets', leagueId]);
      if (leagueMarkets) {
        const m = leagueMarkets.find(x => x.id === marketId);
        if (m) return m;
      }
      const matchesData = queryClient.getQueryData<GetMatchesResponse>(['league-matches', leagueId]);
      if (matchesData?.matches) {
        for (const match of matchesData.matches) {
          const found = (match.markets || []).find(x => x.id === marketId);
          if (found) return found;
        }
      }
      // try generic keys without league param (MatchDetailsPage uses match-markets with matchId)
      const allQueries = queryClient.getQueriesData<MarketResponse[]>({ queryKey: ['match-markets'] });
      for (const [, data] of allQueries) {
        const found = data?.find(x => x.id === marketId);
        if (found) return found;
      }
      return undefined;
    };

    // apuestas simples activas
    if (singleBets?.data) {
      for (const bet of singleBets.data) {
        const market = findMarket(bet.market_id);
        if (!market) continue;
        const type = market.type ?? 'OTHER';
        if (type === 'OTHER') continue;
        const matchId = market.match_id ?? null;
        keys.add(`${type}::${matchId ?? 'null'}`);
      }
    }

    // combinadas pendientes: cada leg aporta su mercado
    if (combinedBets?.data) {
      for (const cb of combinedBets.data) {
        if (cb.status !== 'PENDING' && cb.status !== 'ACCEPTED') continue;
        for (const leg of cb.legs) {
          const market = findMarket(leg.market_id);
          if (!market) continue;
          const type = market.type ?? 'OTHER';
          if (type === 'OTHER') continue;
          const matchId = market.match_id ?? leg.match_id ?? null;
          keys.add(`${type}::${matchId ?? 'null'}`);
        }
      }
    }

    // slip actual (intra)
    for (const sel of selections) {
      const type = sel.marketType ?? 'OTHER';
      if (type === 'OTHER') continue;
      const matchId = sel.matchId ?? null;
      keys.add(`${type}::${matchId ?? 'null'}`);
    }

    return keys;
  }, [singleBets, combinedBets, selections, leagueId, queryClient]);

  const isBlocked = (marketType: string | undefined, matchId: string | null | undefined, marketId: string): boolean => {
    const type = marketType ?? 'OTHER';
    if (type === 'OTHER') return false;
    const key = `${type}::${matchId ?? 'null'}`;
    if (!blockedKeys.has(key)) return false;
    // no bloquear el propio mercado ya seleccionado (permitir cambiar opción dentro mismo mercado)
    const selForMarket = selections.find(s => s.marketId === marketId);
    if (selForMarket) return false;
    // pero sí bloquear otros mercados del mismo tipo/match
    // Si el mercado actual ya tiene una selección distinta dentro del slip, está bloqueado por otro
    // La comprobación simple de key ya cubre eso
    return true;
  };

  return { blockedKeys, isBlocked };
};
