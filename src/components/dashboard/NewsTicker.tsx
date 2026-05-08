import { Zap } from 'lucide-react';
import type { Robot } from '@/types/robot';

const MESSAGES = [
  'BattleBot Arena AI — Live fight predictions',
  'Scraping real data from BattleBots.com via BrightData',
  'AI predictions powered by Google Gemini 2.0 Flash',
  'Track hype scores, fight records, and fan sentiment',
  '#battlebotsdev challenge — built with BrightData',
];

export default function NewsTicker({ robots }: { robots: Robot[] }) {
  const items = [
    ...MESSAGES,
    ...robots.slice(0, 8).map((r) => `${r.name}: ${r.wins}W-${r.losses}L`),
  ];

  return (
    <div className="glass-nav relative overflow-hidden border-y border-transparent py-3">
      <div className="flex items-center">
        <div className="z-10 mr-5 flex shrink-0 items-center gap-2 px-5 py-1 text-xs font-bold tracking-wide text-white live-pulse">
          <span className="rounded-sm bg-orange-600 px-3 py-1 shadow-[0_0_20px_rgba(255,87,34,0.45)]">
            <span className="inline-flex items-center gap-2">
              <Zap className="h-3 w-3 fill-current" />
              LIVE
            </span>
          </span>
        </div>
        <div className="min-w-0 flex-1 overflow-hidden ticker-mask">
          <div className="ticker-inner flex gap-14 whitespace-nowrap text-sm text-gray-400">
            {[...items, ...items].map((item, i) => (
              <span key={i} className="inline-flex shrink-0 items-center">
                <span className="mr-2 text-[var(--neon-orange)] opacity-90">◆</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
