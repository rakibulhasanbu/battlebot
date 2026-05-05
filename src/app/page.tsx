import { getAllRobots } from '@/lib/robots-data';
import { computeHypeScores } from '@/lib/social-data';
import HeroSection from '@/components/dashboard/HeroSection';
import StatsRow from '@/components/dashboard/StatsRow';
import NewsTicker from '@/components/dashboard/NewsTicker';
import RobotCard from '@/components/robots/RobotCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const robots = getAllRobots();
  const hypeScores = computeHypeScores(robots);
  const hypeMap = new Map(hypeScores.map((h) => [h.slug, h]));
  const topRobots = hypeScores.slice(0, 6);

  return (
    <>
      <NewsTicker robots={robots} />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <HeroSection />
        <StatsRow robotCount={robots.length} />

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-white tracking-wider">
              TOP ROBOTS <span className="text-neon-orange">BY HYPE</span>
            </h2>
            <Link href="/robots" className="text-neon-blue text-sm hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topRobots.map((hype) => {
              const robot = robots.find((r) => r.slug === hype.slug);
              if (!robot) return null;
              return (
                <RobotCard
                  key={robot.slug}
                  robot={robot}
                  hype={hypeMap.get(robot.slug)}
                />
              );
            })}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Link href="/predictor" className="arena-card p-8 group hover:border-orange-500">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-display text-2xl text-neon-orange tracking-wider mb-2">AI FIGHT PREDICTOR</h3>
            <p className="text-gray-500 text-sm">
              Pick any two robots and let Google Gemini analyze stats, fight records, and fan sentiment to predict the winner.
            </p>
          </Link>
          <Link href="/leaderboard" className="arena-card p-8 group hover:border-neon-blue">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="font-display text-2xl text-neon-blue tracking-wider mb-2">ARENA LEADERBOARD</h3>
            <p className="text-gray-500 text-sm">
              Full rankings by win rate, hype score, and weapon type effectiveness across all seasons.
            </p>
          </Link>
        </section>
      </div>
    </>
  );
}
