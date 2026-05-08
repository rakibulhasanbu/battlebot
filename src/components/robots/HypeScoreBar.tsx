'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export default function HypeScoreBar ({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const color =
    score >= 70 ? 'from-orange-500 via-orange-400 to-red-400' :
    score >= 40 ? 'from-amber-500 via-orange-400 to-orange-600' :
    'from-cyan-600 via-neon-blue to-blue-700';

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
        <span className="text-gray-400">Hype</span>
        <span className="text-neon-orange tabular-nums drop-shadow-[0_0_8px_rgba(255,87,34,0.35)]">{score}</span>
      </div>
      <div className="h-[7px] overflow-hidden rounded-full bg-black/55 p-px ring ring-inset ring-white/[0.08]">
        <div
          role="presentation"
          className={cn(
            'h-full rounded-full bg-linear-to-r shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_12px_rgba(255,140,55,0.25)] transition-all duration-1000 ease-out',
            color,
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
