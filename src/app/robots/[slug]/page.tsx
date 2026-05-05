import { notFound } from 'next/navigation';
import { getRobotBySlug, getFightsForRobot } from '@/lib/robots-data';
import { getPostsForRobot, getVideosForRobot, simpleSentiment } from '@/lib/social-data';
import WeaponTypeBadge from '@/components/robots/WeaponTypeBadge';
import YoutubeVideoCard from '@/components/social/YoutubeVideoCard';
import RedditPostCard from '@/components/social/RedditPostCard';
import { winRate } from '@/lib/utils/format';
import { Trophy, Users, Play, Wrench, Tag, Globe, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const robot = getRobotBySlug(slug);
  return { title: robot ? `${robot.name} — BattleBot Arena` : 'Robot Not Found' };
}

function detectLinkType(url: string): string {
  if (url.includes('facebook.com')) return 'Facebook';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter / X';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('youtube.com')) return 'YouTube';
  if (url.includes('tiktok.com')) return 'TikTok';
  return 'Website';
}

export default async function RobotPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const robot = getRobotBySlug(slug);
  if (!robot) notFound();

  const fights   = getFightsForRobot(slug);
  const posts    = getPostsForRobot(robot.name);
  const videos   = getVideosForRobot(robot.name);
  const wr       = winRate(robot.wins, robot.losses);

  const avgSentiment = posts.length
    ? posts.reduce((s, p) => s + simpleSentiment(p.title), 0) / posts.length
    : 0;
  const sentimentPct = Math.round(((avgSentiment + 1) / 2) * 100);

  const hasBuilderInfo = robot.builder_name || robot.hometown || robot.years_competing || robot.team_members;
  const hasSponsors    = (robot.sponsors?.length ?? 0) > 0;
  const hasLinks       = (robot.website_urls?.length ?? 0) > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="arena-card p-8">
        <div className="flex flex-wrap items-start gap-6">
          {robot.image_url ? (
            <img
              src={robot.image_url}
              alt={robot.name}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-700 to-red-900 flex items-center justify-center text-3xl font-display text-white shrink-0">
              {robot.name[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl text-white tracking-wider">{robot.name}</h1>
              <WeaponTypeBadge type={robot.weapon_type} />
            </div>
            <p className="text-gray-500 mb-4">{robot.team}</p>
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

      {/* Social stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="arena-card p-5 text-center">
          <div className="font-display text-3xl text-neon-blue mb-1">{posts.length}</div>
          <div className="text-xs text-gray-500">Reddit Posts</div>
        </div>
        <div className="arena-card p-5 text-center">
          <div className={`font-display text-3xl mb-1 ${sentimentPct >= 60 ? 'text-neon-green' : sentimentPct >= 40 ? 'text-yellow-400' : 'text-neon-red'}`}>
            {sentimentPct}%
          </div>
          <div className="text-xs text-gray-500">Fan Sentiment</div>
        </div>
        <div className="arena-card p-5 text-center">
          <div className="font-display text-3xl text-neon-purple mb-1">{videos.length}</div>
          <div className="text-xs text-gray-500">YouTube Videos</div>
        </div>
      </div>

      {/* Fight history */}
      {fights.length > 0 && (
        <div className="arena-card p-6">
          <h2 className="font-display text-xl text-white tracking-wider mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-neon-orange" />
            FIGHT HISTORY ({fights.length} fights)
          </h2>
          <div className="space-y-2">
            {fights.map((f) => (
              <div key={f.id} className="flex items-center justify-between py-2 border-b border-arena last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${f.result === 'win' ? 'bg-green-950/50 text-neon-green' : 'bg-red-950/50 text-neon-red'}`}>
                    {f.result.toUpperCase()}
                  </span>
                  <span className="text-gray-300">{f.opponent_name}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Season {f.season}</div>
                  <div className="text-xs text-gray-600">{f.method}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Builder & Team Info */}
      {hasBuilderInfo && (
        <div className="arena-card p-6">
          <h2 className="font-display text-xl text-white tracking-wider mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-neon-blue" />
            BUILDER & TEAM
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {robot.builder_name && (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Lead Builder</div>
                <div className="text-white font-semibold">{robot.builder_name}</div>
                {robot.builder_job && <div className="text-gray-400 text-xs mt-0.5">{robot.builder_job}</div>}
              </div>
            )}
            {robot.hometown && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Hometown</div>
                  <div className="text-white">{robot.hometown}</div>
                </div>
              </div>
            )}
            {robot.years_competing && (
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Experience</div>
                  <div className="text-white">{robot.years_competing}</div>
                </div>
              </div>
            )}
            {robot.team_members && (
              <div className="sm:col-span-2">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Team Members</div>
                <div className="text-gray-300">{robot.team_members}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sponsors */}
      {hasSponsors && (
        <div className="arena-card p-6">
          <h2 className="font-display text-xl text-white tracking-wider mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-yellow-400" />
            SPONSORS
          </h2>
          <div className="flex flex-wrap gap-2">
            {robot.sponsors!.map((sponsor) => (
              <span
                key={sponsor}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-950/30 text-yellow-300 border border-yellow-800/40"
              >
                {sponsor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social / Website Links */}
      {hasLinks && (
        <div className="arena-card p-6">
          <h2 className="font-display text-xl text-white tracking-wider mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-neon-blue" />
            LINKS
          </h2>
          <div className="space-y-2">
            {robot.website_urls!.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-neon-blue hover:text-blue-300 transition-colors"
              >
                <Globe className="w-4 h-4 shrink-0" />
                <span className="truncate">{detectLinkType(url)}: {url}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* YouTube fight videos */}
      {videos.length > 0 && (
        <div className="arena-card p-6">
          <h2 className="font-display text-xl text-white tracking-wider mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-red-500" />
            FIGHT VIDEOS
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {videos.slice(0, 4).map((v) => (
              <YoutubeVideoCard key={v.video_id || v.url} video={v} />
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
          <div className="space-y-1">
            {posts.slice(0, 5).map((post) => (
              <RedditPostCard key={post.post_id || post.url} post={post} />
            ))}
          </div>
        </div>
      )}

      {posts.length === 0 && videos.length === 0 && (
        <div className="arena-card p-8 text-center">
          <p className="text-gray-600">No social data found for {robot.name} yet.</p>
        </div>
      )}
    </div>
  );
}
