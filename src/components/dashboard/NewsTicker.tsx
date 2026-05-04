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
    <div className="border-y border-arena bg-black/40 overflow-hidden py-2.5">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 bg-orange-600 text-white text-xs font-bold px-4 py-0.5 mr-4 z-10">
          <Zap className="w-3 h-3" fill="currentColor" />
          LIVE
        </div>
        <div className="overflow-hidden flex-1">
          <div className="ticker-inner flex gap-12 whitespace-nowrap text-sm text-gray-400">
            {[...items, ...items].map((item, i) => (
              <span key={i} className="shrink-0">
                <span className="text-neon-orange mr-2">◆</span>{item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
