'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export default function HypeScoreBar({ score, className }: { score: number; className?: string }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const color =
    score >= 70 ? 'from-orange-500 to-red-500' :
    score >= 40 ? 'from-yellow-500 to-orange-500' :
                  'from-blue-600 to-cyan-500';

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between text-xs text-gray-400">
        <span>HYPE</span>
        <span className="text-neon-orange font-bold">{score}</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out', color)}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
