'use client';

import type { Robot } from '@/types/robot';
import WeaponTypeBadge from '@/components/robots/WeaponTypeBadge';
import { winRate } from '@/lib/utils/format';
import { ChevronDown, Bot } from 'lucide-react';
import { useState } from 'react';

interface Props {
  label: string;
  robots: Robot[];
  selected: Robot | null;
  onSelect: (robot: Robot) => void;
  accentColor: 'orange' | 'blue';
  disabled?: boolean;
}

export default function RobotSelector({ label, robots, selected, onSelect, accentColor, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = robots.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const accent = accentColor === 'orange' ? 'border-orange-500 text-neon-orange' : 'border-neon-blue text-neon-blue';

  return (
    <div className="flex-1 min-w-0">
      <div className={`text-xs font-bold tracking-widest mb-2 ${accent}`}>{label}</div>
      <div className="relative">
        <button
          onClick={() => !disabled && setOpen(!open)}
          className={`w-full arena-card p-4 flex items-center gap-3 text-left transition-all ${
            selected ? `border-${accentColor === 'orange' ? 'orange-500' : 'neon-blue'}` : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shrink-0">
            {selected ? (
              <span className="font-display text-lg text-white">{selected.name[0]}</span>
            ) : (
              <Bot className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {selected ? (
              <>
                <div className="font-display text-white text-lg truncate">{selected.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <WeaponTypeBadge type={selected.weapon_type} />
                  <span className="text-xs text-gray-500">{winRate(selected.wins, selected.losses)}% WR</span>
                </div>
              </>
            ) : (
              <span className="text-gray-500">Select a robot…</span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 arena-card shadow-xl max-h-72 overflow-hidden">
            <div className="p-2 border-b border-arena">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search robots…"
                className="w-full bg-transparent text-white text-sm outline-none px-2 py-1 placeholder-gray-600"
              />
            </div>
            <div className="overflow-y-auto max-h-56">
              {filtered.map((robot) => (
                <button
                  key={robot.slug}
                  onClick={() => { onSelect(robot); setOpen(false); setSearch(''); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <span className="font-display text-sm text-white">{robot.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{robot.name}</div>
                    <div className="flex items-center gap-2">
                      <WeaponTypeBadge type={robot.weapon_type} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">{winRate(robot.wins, robot.losses)}%</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-600 text-sm">No robots found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
