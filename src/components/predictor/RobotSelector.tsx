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

export default function RobotSelector({
  label,
  robots,
  selected,
  onSelect,
  accentColor,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = robots.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );

  const accent =
    accentColor === 'orange'
      ? 'border-orange-500 text-neon-orange'
      : 'border-neon-blue text-neon-blue';

  const selectedOutline =
    selected && accentColor === 'orange'
      ? 'border-orange-500/60 shadow-[0_0_24px_rgba(255,87,34,0.12)]'
      : selected && accentColor === 'blue'
        ? 'border-neon-blue shadow-[0_0_22px_rgba(0,232,255,0.12)]'
        : '';

  return (
    <div className={`relative min-w-0 flex-1 ${open ? 'z-[300]' : 'z-10'}`}>
      <div className={`${accent} mb-2 text-xs font-bold tracking-widest`}>
        {label}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          className={`glass-panel flex w-full items-center gap-3 p-4 text-left transition-all ${selectedOutline} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gray-700 to-gray-900">
            {selected ? (
              <span className="font-display text-lg text-white">{selected.name[0]}</span>
            ) : (
              <Bot className="size-5 text-gray-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            {selected ? (
              <>
                <div className="font-display truncate text-lg text-white">{selected.name}</div>
                <div className="mt-0.5 flex items-center gap-2">
                  <WeaponTypeBadge type={selected.weapon_type} />
                  <span className="text-xs text-gray-500">
                    {winRate(selected.wins, selected.losses)}% WR
                  </span>
                </div>
              </>
            ) : (
              <span className="text-gray-500">Select a robot…</span>
            )}
          </div>
          <ChevronDown className={`size-4 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div
            className="absolute left-0 right-0 top-full z-[310] mt-1.5 max-h-[min(18rem,calc(100vh-14rem))] overflow-hidden rounded-xl border border-white/14 bg-[#0e121a] shadow-[0_28px_64px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <div className="border-b border-white/12 bg-[#080b10] px-3 py-2">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search robots…"
                className="w-full rounded-md border border-white/12 bg-black/65 px-2.5 py-2 text-sm text-white caret-neon-orange outline-none transition-colors placeholder:text-gray-600 focus-visible:border-orange-400/35 focus-visible:ring-2 focus-visible:ring-neon-orange/20"
              />
            </div>
            <div className="max-h-56 overflow-y-auto overscroll-contain bg-[#0e121a] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-black/35">
              {filtered.map((robot) => (
                <button
                  key={robot.slug}
                  type="button"
                  onClick={() => {
                    onSelect(robot);
                    setOpen(false);
                    setSearch('');
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10 active:bg-white/12"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-800">
                    <span className="font-display text-sm text-white">{robot.name[0]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{robot.name}</div>
                    <div className="flex items-center gap-2">
                      <WeaponTypeBadge type={robot.weapon_type} />
                    </div>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-gray-400">{winRate(robot.wins, robot.losses)}%</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No robots found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
