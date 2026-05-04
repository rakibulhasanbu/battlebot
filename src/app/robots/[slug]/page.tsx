import { notFound } from 'next/navigation';
import { getRobotBySlug, getFightsByRobot, getRedditStatsForRobot, getYoutubeComments } from '@/lib/db/queries';
import WeaponTypeBadge from '@/components/robots/WeaponTypeBadge';
import { winRate } from '@/lib/utils/format';
import { Trophy, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const robot = getRobotBySlug(slug);
  return { title: robot ? `${robot.name} — BattleBot Arena AI` : 'Robot Not Found' };
}

export default async function RobotPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const robot = getRobotBySlug(slug);
  if (!robot) notFound();

  const fights = getFightsByRobot(slug);
  const { posts, avgSentiment, mentions } = getRedditStatsForRobot(slug, robot.name);
  const youtubeComments = getYoutubeComments(slug, 5);
  const wr = winRate(robot.wins, robot.losses);
  const sentimentPct = Math.round(((avgSentiment + 1) / 2) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="arena-card p-8">
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-700 to-red-900 flex items-center justify-center text-3xl font-display text-white shrink-0">
            {robot.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl text-white tracking-wider">{robot.name}</h1>
              <WeaponTypeBadge type={robot.weapon_type} />
            </div>
            <p className="text-gray-500 mb-4">{robot.team} · Seasons: {robot.seasons}</p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-display text-3xl text-neon-green">{robot.wins}</div>
                <div className="text-xs text-gray-500">WINS</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl text-neon-red">{robot.losses}</div>
                <div className="text-xs text-gray-500">LOSSES</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl text-neon-orange">{wr}%</div>
                <div className="text-xs text-gray-500">WIN RATE</div>
              </div>
            </div>
          </div>
          <Link
            href={`/predictor?a=${slug}`}
            className="shrink-0 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Predict Fight →
          </Link>
        </div>
      </div>

      {/* Social sentiment */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="arena-card p-5 text-center">
          <div className="font-display text-3xl text-neon-blue mb-1">{mentions}</div>
          <div className="text-xs text-gray-500">Reddit Mentions (7d)</div>
        </div>
        <div className="arena-card p-5 text-center">
          <div className={`font-display text-3xl mb-1 ${sentimentPct >= 60 ? 'text-neon-green' : sentimentPct >= 40 ? 'text-yellow-400' : 'text-neon-red'}`}>
            {sentimentPct}%
          </div>
          <div className="text-xs text-gray-500">Fan Sentiment</div>
        </div>
        <div className="arena-card p-5 text-center">
          <div className="font-display text-3xl text-neon-purple mb-1">{youtubeComments.length}</div>
          <div className="text-xs text-gray-500">YouTube Comments</div>
        </div>
      </div>

      {/* Fight history */}
      {fights.length > 0 && (
        <div className="arena-card p-6">
          <h2 className="font-display text-xl text-white tracking-wider mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-neon-orange" />
            FIGHT HISTORY
          </h2>
          <div className="space-y-2">
            {fights.map((f) => (
              <div key={f.id} className="flex items-center justify-between py-2 border-b border-arena last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${f.result === 'win' ? 'bg-green-950/50 text-neon-green' : 'bg-red-950/50 text-neon-red'}`}>
                    {f.result.toUpperCase()}
                  </span>
                  <span className="text-gray-300">{f.opponent_name || f.opponent_slug}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{f.season}</div>
                  <div className="text-xs text-gray-600">{f.method}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reddit posts */}
      {posts.length > 0 && (
        <div className="arena-card p-6">
          <h2 className="font-display text-xl text-white tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-neon-orange" />
            REDDIT BUZZ
          </h2>
          <div className="space-y-3">
            {posts.slice(0, 5).map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:bg-white/3 p-2 rounded-lg transition-colors group"
              >
                <div className="text-center shrink-0 w-10">
                  <div className="text-neon-orange font-bold text-sm">{post.score}</div>
                  <div className="text-gray-600 text-xs">pts</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2">{post.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{post.num_comments} comments</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* YouTube comments */}
      {youtubeComments.length > 0 && (
        <div className="arena-card p-6">
          <h2 className="font-display text-xl text-white tracking-wider mb-4">YOUTUBE FANS</h2>
          <div className="space-y-3">
            {youtubeComments.map((c) => (
              <div key={c.id} className="flex items-start gap-3 py-2 border-b border-arena last:border-0">
                <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-400 shrink-0">Y</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{c.comment_text}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <span>👍 {c.likes}</span>
                    <span className="truncate">{c.video_title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
