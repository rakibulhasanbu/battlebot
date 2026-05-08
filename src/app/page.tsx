import { getAllRobots } from "@/lib/robots-data";
import { computeHypeScores } from "@/lib/social-data";
import HeroSection from "@/components/dashboard/HeroSection";
import StatsRow from "@/components/dashboard/StatsRow";
import NewsTicker from "@/components/dashboard/NewsTicker";
import RobotCard from "@/components/robots/RobotCard";
import MotionStaggerGrid from "@/components/motion/MotionStaggerGrid";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function HomePage () {
  const robots = getAllRobots();
  const hypeScores = computeHypeScores(robots);
  const hypeMap = new Map(hypeScores.map((h) => [ h.slug, h ]));
  const topRobots = hypeScores.slice(0, 20);

  return (
    <>
      <NewsTicker robots={ robots } />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8">
        <HeroSection />
        <StatsRow robotCount={ robots.length } />

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl tracking-wider text-white text-glow-muted">
              TOP ROBOTS <span className="text-neon-orange text-glow-hero-orange">BY HYPE</span>
            </h2>
            <Link
              href="/robots"
              className="text-sm font-medium text-neon-blue transition-colors hover:text-cyan-200 hover:underline hover:drop-shadow-[0_0_8px_rgba(0,232,255,0.35)]"
            >
              View all →
            </Link>
          </div>
          <MotionStaggerGrid className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            { topRobots.map((hype) => {
              const robot = robots.find((r) => r.slug === hype.slug);
              if (!robot) return null;
              return (
                <RobotCard
                  key={ robot.slug }
                  robot={ robot }
                  hype={ hypeMap.get(robot.slug) }
                />
              );
            }) }
          </MotionStaggerGrid>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Link
            href="/predictor"
            className="feature-tile-link feature-tile-link--hybrid glass-panel group relative block cursor-pointer select-none rounded-2xl p-8 no-underline transition-[border-color,box-shadow] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[var(--neon-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--arena-bg)]"
          >
            <div className="mb-3 inline-block text-4xl opacity-90 transition-opacity duration-300 group-hover:opacity-100">
              ⚡
            </div>
            <h3 className="font-display mb-2 text-2xl tracking-wider text-neon-orange opacity-95 transition-opacity duration-300 drop-shadow-[0_0_12px_rgba(255,87,34,0.25)] group-hover:opacity-100">
              AI FIGHT PREDICTOR
            </h3>
            <p className="text-sm text-gray-500/90 transition-colors duration-300 group-hover:text-gray-200">
              Pick any two robots and let Google Gemini analyze stats, fight
              records, and fan sentiment to predict the winner.
            </p>
          </Link>
          <Link
            href="/leaderboard"
            className="feature-tile-link feature-tile-link--cyan glass-panel group relative block cursor-pointer select-none rounded-2xl p-8 no-underline transition-[border-color,box-shadow] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[var(--neon-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--arena-bg)]"
          >
            <div className="mb-3 inline-block text-4xl opacity-90 transition-opacity duration-300 group-hover:opacity-100">
              🏆
            </div>
            <h3 className="font-display mb-2 text-2xl tracking-wider text-neon-blue opacity-95 transition-opacity duration-300 drop-shadow-[0_0_10px_rgba(0,232,255,0.2)] group-hover:opacity-100">
              ARENA LEADERBOARD
            </h3>
            <p className="text-sm text-gray-500/90 transition-colors duration-300 group-hover:text-gray-200">
              Full rankings by win rate, hype score, and weapon type
              effectiveness across all seasons.
            </p>
          </Link>
        </section>
      </div>
    </>
  );
}
