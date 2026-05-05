import { getAllRobots } from '@/lib/robots-data';
import { computeHypeScores } from '@/lib/social-data';
import RobotCard from '@/components/robots/RobotCard';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'All Robots — BattleBot Arena AI' };

export default function RobotsPage() {
  const robots = getAllRobots();
  const hypeScores = computeHypeScores(robots);
  const hypeMap = new Map(hypeScores.map((h) => [h.slug, h]));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white tracking-wider mb-2">
          ROBOT <span className="text-neon-orange">DATABASE</span>
        </h1>
        <p className="text-gray-500">
          {robots.length} robots · Data from BattleBots.com
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {robots.map((robot) => (
          <RobotCard key={robot.slug} robot={robot} hype={hypeMap.get(robot.slug)} />
        ))}
      </div>
    </div>
  );
}
