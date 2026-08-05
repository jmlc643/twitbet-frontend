import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import type { MarketResponse, WebSocketEvent } from '@/features/league/types/league.types';
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
        console.log("Conectado al servidor de apuestas en vivo");
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
        } catch (error) {
          console.error("Error al procesar mensaje WS", error);
        }
      };

      ws.onclose = () => {
        console.log("Desconectado del servidor WS. Intentando reconectar en 3s...");
        setTimeout(() => {
          if (isAuthenticated) {
            connectWs();
          }
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error("Error en conexión WS", error);
        ws.close();
      };
    };

    connectWs();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isAuthenticated, queryClient]);
};
