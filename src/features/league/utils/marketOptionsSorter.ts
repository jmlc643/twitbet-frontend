import type { MarketOptionResponse } from '../types/league.types';

export const sortMarketOptions = (options: MarketOptionResponse[], marketType: string | undefined): MarketOptionResponse[] => {
  if (!options || options.length === 0) return [];
  const type = marketType || 'OTHER';
  
  if (type === 'TOTALS' || type === 'HANDICAP') {
    const getNum = (name: string) => {
      const m = name.match(/\d+(\.\d+)?/);
      return m ? parseFloat(m[0]) : 0;
    };

    return [...options].sort((a, b) => {
      const numA = getNum(a.name);
      const numB = getNum(b.name);
      if (numA === numB) {
        return a.name.localeCompare(b.name);
      }
      return numA - numB;
    });
  }

  return options;
};

export const getGridClassForMarket = (marketType: string | undefined, defaultGridClass: string = 'grid-cols-2 md:grid-cols-3'): string => {
  const type = marketType || 'OTHER';
  
  if (type === 'TOTALS' || type === 'HANDICAP') {
    return 'grid-cols-2';
  }
  if (type === 'MATCH_ODDS' || type === '1X2') {
    return 'grid-cols-3';
  }
  
  return defaultGridClass;
};
