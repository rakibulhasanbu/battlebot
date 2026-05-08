import { getAllRobots } from '@/lib/robots-data';
import { computeHypeScores } from '@/lib/social-data';
import { winRate } from '@/lib/utils/format';
import WeaponTypeBadge from '@/components/robots/WeaponTypeBadge';
import Link from 'next/link';
import { ChevronRight, Medal, Sparkles, Trophy } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Arena Leaderboard — BattleBot Arena AI' };

const RANK_ICON = [
  { className: 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.45)]', label: '1st' },
  { className: 'text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.35)]', label: '2nd' },
  { className: 'text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.4)]', label: '3rd' },
] as const;

export default function LeaderboardPage() {
  const robots = getAllRobots();
  const hypeScores = computeHypeScores(robots);
  const robotMap = new Map(robots.map((r) => [r.slug, r]));

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,rgba(255,87,34,0.09),transparent_70%)]" aria-hidden />

      <div className="relative mb-10">
        <div className="glass-chip mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-neon-blue ring-1 ring-cyan-400/20">
          <Sparkles className="size-3.5" />
          Rankings
        </div>
        <div className="mb-3 flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="size-8 text-neon-orange drop-shadow-[0_0_14px_rgba(255,87,34,0.45)] sm:size-10" fill="currentColor" />
            <h1 className="font-display text-4xl tracking-wider text-white text-glow-muted sm:text-5xl">
              ARENA <span className="text-neon-orange text-glow-hero-orange">LEADERBOARD</span>
            </h1>
          </div>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-gray-400">
          Every row opens the robot profile. Ranked by hype score, win rate, and social momentum.
          <span className="text-gray-500"> · Click or tap a row to explore.</span>
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#080b12]/90 shadow-[0_24px_56px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/5 backdrop-blur-xl">
        {/* Column labels */}
        <div
          role="row"
          className="hidden border-b border-white/10 bg-black/40 px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 md:grid md:grid-cols-[3rem_minmax(0,1fr)_minmax(5.5rem,8rem)_4.75rem_4.25rem_6.75rem_auto] md:items-center md:gap-3 md:px-6"
        >
          <span className="text-center">#</span>
          <span>Robot</span>
          <span className="min-w-0">Weapon</span>
          <span className="text-right">W-L</span>
          <span className="text-right">Win%</span>
          <span className="text-right">Hype</span>
          <span className="w-5 shrink-0" aria-hidden />
        </div>
        {/* Mobile column hint */}
        <p className="border-b border-white/8 bg-black/35 px-4 py-2.5 text-center text-[11px] text-gray-500 md:hidden">
          Tap a row · <span className="text-neon-blue">view robot profile →</span>
        </p>

        <div className="divide-y divide-white/[0.06]">
          {hypeScores.map((h, i) => {
            const robot = robotMap.get(h.slug);
            if (!robot) return null;
            const wr = winRate(robot.wins, robot.losses);
            const rank = i + 1;

            return (
              <Link
                key={h.slug}
                href={`/robots/${robot.slug}`}
                prefetch={rank <= 20}
                className="group relative grid cursor-pointer grid-cols-[2.75rem_1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-3.5 outline-none transition-colors duration-200 hover:bg-white/[0.035] focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[var(--neon-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--arena-bg)] md:grid-cols-[3rem_minmax(0,1fr)_minmax(5.5rem,8rem)_4.75rem_4.25rem_6.75rem_auto] md:gap-x-3 md:px-6 md:py-4"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-0 rounded-r-sm bg-linear-to-b from-neon-blue to-neon-orange opacity-0 transition-[width,opacity] duration-200 group-hover:w-1 group-hover:opacity-90 group-focus-visible:w-1 group-focus-visible:opacity-100"
                />

                <div className="relative z-[1] flex justify-center md:justify-center">
                  {i < 3 ? (
                    <Medal
                      className={`size-5 ${RANK_ICON[i].className}`}
                      fill="currentColor"
                      aria-label={RANK_ICON[i].label}
                    />
                  ) : (
                    <span className="font-display text-lg font-bold tabular-nums text-gray-500 group-hover:text-gray-300">
                      {rank}
                    </span>
                  )}
                </div>

                <div className="relative z-[1] min-w-0">
                  <div className="font-display text-lg tracking-wide text-white transition-colors group-hover:text-neon-blue">
                    {robot.name}
                  </div>
                  <div className="truncate text-xs text-gray-500 group-hover:text-gray-400">{robot.team}</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:hidden">
                    <span>
                      <span className="font-semibold text-neon-green">{robot.wins}W</span>
                      <span className="text-gray-600"> · </span>
                      <span className="font-semibold text-neon-red">{robot.losses}L</span>
                      <span className="text-gray-600"> · </span>
                      <span className={wr >= 70 ? 'text-neon-green' : wr >= 50 ? 'text-yellow-400' : 'text-neon-red'}>
                        {wr}%
                      </span>
                    </span>
                    <span className="text-neon-orange font-bold tabular-nums">Hype {h.score}</span>
                  </div>
                </div>

                <div className="relative z-[1] hidden md:block">
                  <WeaponTypeBadge type={robot.weapon_type} />
                </div>

                <div className="relative z-[1] hidden text-right tabular-nums md:block">
                  <span className="font-semibold text-neon-green">{robot.wins}</span>
                  <span className="text-gray-600">-</span>
                  <span className="font-semibold text-neon-red">{robot.losses}</span>
                </div>

                <div className="relative z-[1] hidden text-right md:block">
                  <span
                    className={`font-bold tabular-nums ${wr >= 70 ? 'text-neon-green' : wr >= 50 ? 'text-yellow-400' : 'text-neon-red'}`}
                  >
                    {wr}%
                  </span>
                </div>

                <div className="relative z-[1] hidden items-center justify-end gap-2 md:flex">
                  <div className="h-1.5 w-14 overflow-hidden rounded-full bg-black/60 ring-1 ring-inset ring-white/10">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-orange-500 to-neon-blue shadow-[0_0_8px_rgba(0,232,255,0.25)]"
                      style={{ width: `${h.score}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-sm font-bold tabular-nums text-neon-orange">{h.score}</span>
                </div>

                <div className="relative z-[1] flex justify-end text-gray-600 transition-colors group-hover:text-neon-blue">
                  <ChevronRight className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  <span className="sr-only">Open {robot.name} profile</span>
                </div>

                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-0 bg-linear-to-r from-white/[0.03] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
