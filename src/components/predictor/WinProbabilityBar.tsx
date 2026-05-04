'use client';

import { useEffect, useState } from 'react';
import type { Robot } from '@/types/robot';

interface Props {
  robotA: Robot;
  robotB: Robot;
  winnerSlug: string;
  winProbability: number;
}

export default function WinProbabilityBar({ robotA, robotB, winnerSlug, winProbability }: Props) {
  const [aWidth, setAWidth] = useState(50);

  useEffect(() => {
    const t = setTimeout(() => {
      const aWins = winnerSlug === robotA.slug;
      setAWidth(aWins ? winProbability : 100 - winProbability);
    }, 300);
    return () => clearTimeout(t);
  }, [winnerSlug, winProbability, robotA.slug]);

  const bWidth = 100 - aWidth;
  const aWins = winnerSlug === robotA.slug;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-semibold">
        <span className={aWins ? 'text-neon-orange' : 'text-gray-500'}>{robotA.name}</span>
        <span className={!aWins ? 'text-neon-blue' : 'text-gray-500'}>{robotB.name}</span>
      </div>
      <div className="relative h-8 rounded-full overflow-hidden bg-gray-800">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-1000 ease-out flex items-center"
          style={{ width: `${aWidth}%` }}
        >
          {aWidth > 20 && (
            <span className="absolute right-2 text-xs text-white font-bold">{Math.round(aWidth)}%</span>
          )}
        </div>
        <div
          className="absolute inset-y-0 right-0 bg-gradient-to-l from-blue-600 to-cyan-400 transition-all duration-1000 ease-out flex items-center"
          style={{ width: `${bWidth}%` }}
        >
          {bWidth > 20 && (
            <span className="absolute left-2 text-xs text-white font-bold">{Math.round(bWidth)}%</span>
          )}
        </div>
        {/* center divider */}
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-black/40 z-10" />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Win Probability</span>
        <span>Win Probability</span>
      </div>
    </div>
  );
}
