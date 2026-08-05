import { useState, useEffect, useRef, type ReactNode } from 'react';

interface AnimatedOddsProps {
  odds: number;
  children: (flash: 'up' | 'down' | null, currentOdds: number) => ReactNode;
}

export const AnimatedOdds = ({ odds, children }: AnimatedOddsProps) => {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevOddsRef = useRef(odds);

  useEffect(() => {
    if (prevOddsRef.current !== odds) {
      if (odds > prevOddsRef.current) {
        setFlash('up');
      } else {
        setFlash('down');
      }
      prevOddsRef.current = odds;
      
      const timer = setTimeout(() => {
        setFlash(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [odds]);

  return <>{children(flash, odds)}</>;
};
