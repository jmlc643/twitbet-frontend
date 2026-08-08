import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import type { MarketResponse, WebSocketEvent } from '@/features/league/types/league.types';
import { leagueApi } from '@/features/league/api/league.api';
import { useAuthStore } from '@/store/useAuthStore';

export const useLiveMarkets = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = Cookies.get('twitbet_token');
    if (!token) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const wsUrlBase = apiUrl.replace(/^http/, 'ws').replace(/\/api\/v1\/?$/, '');
    const wsUrl = `${wsUrlBase}/ws?token=${token}`;

    const connectWs = () => {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketEvent;
          
          if (data.type === 'MARKET_STATUS_CHANGED') {
            const updateMarketStatus = (oldMarkets: MarketResponse[] | undefined) => {
              if (!oldMarkets) return oldMarkets;
              return oldMarkets.map(market => 
                market.id === data.market_id 
                  ? { ...market, status: data.status } 
                  : market
              );
            };

            queryClient.setQueriesData<MarketResponse[]>({ queryKey: ['match-markets'] }, updateMarketStatus);
            queryClient.setQueriesData<MarketResponse[]>({ queryKey: ['league-markets'] }, updateMarketStatus);

            if (data.status === 'CANCELLED') {
              queryClient.invalidateQueries({ queryKey: ['participantMe'] });
              queryClient.invalidateQueries({ queryKey: ['match-markets'] });
              queryClient.invalidateQueries({ queryKey: ['league-markets'] });
              queryClient.invalidateQueries({ queryKey: ['match-details'] });
              toast.info('Un mercado ha sido anulado y tu dinero ha sido devuelto.');
            }
          }

          if (data.type === 'ODDS_UPDATED') {
            const updateMarketOdds = (oldMarkets: MarketResponse[] | undefined) => {
              if (!oldMarkets) return oldMarkets;
              return oldMarkets.map(market => {
                if (market.id !== data.market_id) return market;
                
                const newOptions = market.options.map(opt => {
                  const updatedOpt = data.options.find(o => o.id === opt.id);
                  return updatedOpt ? { ...opt, current_odds: updatedOpt.current_odds } : opt;
                });
                
                return { ...market, options: newOptions };
              });
            };

            queryClient.setQueriesData<MarketResponse[]>({ queryKey: ['match-markets'] }, updateMarketOdds);
            queryClient.setQueriesData<MarketResponse[]>({ queryKey: ['league-markets'] }, updateMarketOdds);
          }
          
          if (data.type === 'MARKET_STATUS_CHANGED' && (data.status === 'RESOLVED' || data.status === 'VOIDED')) {
             queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
          }

          if (data.type === 'MARKET_RESOLVED') {
            const checkBets = async () => {
              try {
                const urlLeagueId = window.location.pathname.split('/leagues/')[1]?.split('/')[0];
                const targetLeagueId = data.league_id || urlLeagueId;
                
                if (!targetLeagueId) {
                  return;
                }

                await new Promise(resolve => setTimeout(resolve, 500));

                const res = await leagueApi.getParticipantBets(targetLeagueId, undefined, 1, 50);
                
                let wonCount = 0;
                let lostCount = 0;
                let totalWonAmount = 0;
                
                for (const bet of res.data) {
                  if (bet.market_id === data.market_id) {
                    if (bet.status === 'WON') {
                      wonCount++;
                      totalWonAmount += bet.potential_win;
                    } else if (bet.status === 'LOST') {
                      lostCount++;
                    }
                  }
                }

                if (wonCount > 0 || lostCount > 0) {
                  if (wonCount > 0 && lostCount === 0) {
                    toast.success(`¡Felicidades! Ganaste ${wonCount === 1 ? 'tu apuesta' : 'tus ' + wonCount + ' apuestas'} (+S/. ${totalWonAmount.toFixed(2)}).`);
                    confetti({
                      particleCount: 150,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#eab308']
                    });
                  } else if (wonCount === 0 && lostCount > 0) {
                    toast.error(`Perdiste ${lostCount === 1 ? 'tu apuesta' : 'tus ' + lostCount + ' apuestas'} en un mercado resuelto.`);
                  } else {
                    toast.success(`Mercado resuelto: Ganaste ${wonCount} apuesta${wonCount > 1 ? 's' : ''} (+S/. ${totalWonAmount.toFixed(2)}) y perdiste ${lostCount}.`);
                    confetti({
                      particleCount: 150,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#eab308']
                    });
                  }
                  
                  queryClient.invalidateQueries({ queryKey: ['participantBets'] });
                  queryClient.invalidateQueries({ queryKey: ['participantMe'] });
                }
              } catch {
                toast.error("Ocurrió un error al verificar los resultados de tus apuestas.");
              }
            };
            
            checkBets();
          }

          if (data.type === 'MATCH_STATUS_CHANGED') {
            queryClient.invalidateQueries({ queryKey: ['league-matches'] });
            queryClient.invalidateQueries({ queryKey: ['match-details', data.match_id] });
            
            if (data.status === 'VOIDED' || data.status === 'FINISHED') {
              queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
            }
          }

          if (data.type === 'PARTICIPANT_BALANCE_UPDATED') {
            queryClient.invalidateQueries({ queryKey: ['participantMe'] });
          }
        } catch {
          // ignorar errores
        }
      };

      ws.onclose = () => {
        setTimeout(() => {
          if (isAuthenticated) {
            connectWs();
          }
        }, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connectWs();

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [isAuthenticated, queryClient]);
};
