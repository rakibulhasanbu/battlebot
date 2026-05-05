import { getAllRobots } from '@/lib/robots-data';
import { computeHypeScores } from '@/lib/social-data';
import { winRate, weaponLabel } from '@/lib/utils/format';
import WeaponTypeBadge from '@/components/robots/WeaponTypeBadge';
import Link from 'next/link';
import { Trophy, Medal } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Arena Leaderboard — BattleBot Arena AI' };

const RANK_STYLES = [
  'text-yellow-400',
  'text-gray-300',
  'text-amber-600',
];

export default function LeaderboardPage() {
  const robots = getAllRobots();
  const hypeScores = computeHypeScores(robots);
  const robotMap = new Map(robots.map((r) => [r.slug, r]));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-7 h-7 text-neon-orange" fill="currentColor" />
          <h1 className="font-display text-4xl text-white tracking-wider">
            ARENA <span className="text-neon-orange">LEADERBOARD</span>
          </h1>
        </div>
        <p className="text-gray-500">Ranked by hype score · win rate · social momentum</p>
      </div>

      <div className="arena-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-arena text-xs text-gray-500 font-bold tracking-widest">
              <th className="text-left py-4 px-5">RANK</th>
              <th className="text-left py-4 px-5">ROBOT</th>
              <th className="text-left py-4 px-5 hidden sm:table-cell">WEAPON</th>
              <th className="text-right py-4 px-5">W-L</th>
              <th className="text-right py-4 px-5">WIN %</th>
              <th className="text-right py-4 px-5">HYPE</th>
            </tr>
          </thead>
          <tbody>
            {hypeScores.map((h, i) => {
              const robot = robotMap.get(h.slug);
              if (!robot) return null;
              const wr = winRate(robot.wins, robot.losses);
              return (
                <tr
                  key={h.slug}
                  className="border-b border-arena last:border-0 hover:bg-white/3 transition-colors"
                >
                  <td className="py-4 px-5">
                    {i < 3 ? (
                      <Medal className={`w-5 h-5 ${RANK_STYLES[i]}`} fill="currentColor" />
                    ) : (
                      <span className="text-gray-600 font-bold">{i + 1}</span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    <Link href={`/robots/${robot.slug}`} className="hover:text-neon-blue transition-colors">
                      <div className="font-display text-white text-lg tracking-wide">{robot.name}</div>
                      <div className="text-xs text-gray-600">{robot.team}</div>
                    </Link>
                  </td>
                  <td className="py-4 px-5 hidden sm:table-cell">
                    <WeaponTypeBadge type={robot.weapon_type} />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className="text-neon-green font-semibold">{robot.wins}W</span>
                    <span className="text-gray-600 mx-1">-</span>
                    <span className="text-neon-red font-semibold">{robot.losses}L</span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className={`font-bold ${wr >= 70 ? 'text-neon-green' : wr >= 50 ? 'text-yellow-400' : 'text-neon-red'}`}>
                      {wr}%
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-600 to-neon-blue rounded-full"
                          style={{ width: `${h.score}%` }}
                        />
                      </div>
                      <span className="text-neon-orange font-bold text-sm">{h.score}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
