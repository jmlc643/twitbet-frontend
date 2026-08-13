import type { MarketType } from '@/features/league/types/league.types';

export const MARKET_TYPE_ORDER: MarketType[] = ['RESULT', 'TOTALS', 'HANDICAP', 'CORRECT_SCORE', 'OTHER'];

export const mapMarketType = (type?: MarketType): string => {
  const map: Record<MarketType, string> = {
    RESULT: 'Resultado',
    TOTALS: 'Totales (Más/Menos)',
    HANDICAP: 'Hándicap',
    CORRECT_SCORE: 'Marcador Exacto',
    OTHER: 'Otro',
  };
  return type ? map[type] : map.OTHER;
};

export const getMarketTypeRank = (type?: MarketType): number => {
  const index = type ? MARKET_TYPE_ORDER.indexOf(type) : -1;
  return index === -1 ? MARKET_TYPE_ORDER.length : index;
};

export const sortMarketsByType = <T extends { type?: MarketType }>(markets: T[]): T[] => {
  return [...markets].sort((a, b) => getMarketTypeRank(a.type) - getMarketTypeRank(b.type));
};
