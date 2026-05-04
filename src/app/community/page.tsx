import { getRecentRedditPosts } from '@/lib/db/queries';
import { seedDatabase } from '@/lib/db/seed';
import { ExternalLink, MessageSquare, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Community Pulse — BattleBot Arena AI' };

export default function CommunityPage() {
  seedDatabase();
  const posts = getRecentRedditPosts(20);

  const avgSentiment = posts.length
    ? posts.reduce((s, p) => s + p.sentiment, 0) / posts.length
    : 0;
  const sentimentPct = Math.round(((avgSentiment + 1) / 2) * 100);
  const positiveCount = posts.filter((p) => p.sentiment > 0.2).length;
  const negativeCount = posts.filter((p) => p.sentiment < -0.2).length;
  const neutralCount = posts.length - positiveCount - negativeCount;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-7 h-7 text-neon-blue" />
          <h1 className="font-display text-4xl text-white tracking-wider">
            COMMUNITY <span className="text-neon-blue">PULSE</span>
          </h1>
        </div>
        <p className="text-gray-500">Live r/battlebots data scraped via BrightData</p>
      </div>

      {/* Sentiment overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="arena-card p-5 text-center">
          <div className={`font-display text-3xl mb-1 ${sentimentPct >= 60 ? 'text-neon-green' : sentimentPct >= 40 ? 'text-yellow-400' : 'text-neon-red'}`}>
            {sentimentPct}%
          </div>
          <div className="text-xs text-gray-500">Fan Positivity</div>
        </div>
        <div className="arena-card p-5 text-center">
          <div className="font-display text-3xl text-neon-green mb-1">{positiveCount}</div>
          <div className="text-xs text-gray-500">Positive Posts</div>
        </div>
        <div className="arena-card p-5 text-center">
          <div className="font-display text-3xl text-gray-400 mb-1">{neutralCount}</div>
          <div className="text-xs text-gray-500">Neutral Posts</div>
        </div>
        <div className="arena-card p-5 text-center">
          <div className="font-display text-3xl text-neon-red mb-1">{negativeCount}</div>
          <div className="text-xs text-gray-500">Critical Posts</div>
        </div>
      </div>

      {/* Reddit posts */}
      <div className="arena-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">r</div>
          <h2 className="font-display text-xl text-white tracking-wider">r/battlebots FEED</h2>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-600">No posts yet. Trigger a Reddit scrape via the admin API.</p>
            <p className="text-gray-700 text-xs mt-2">POST /api/admin/scrape/reddit</p>
          </div>
        ) : (
          <div className="space-y-1">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/3 transition-colors group"
              >
                <div className="text-center shrink-0 w-12">
                  <div className="text-neon-orange font-bold">{post.score.toLocaleString()}</div>
                  <div className="text-gray-600 text-xs">upvotes</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 group-hover:text-white transition-colors line-clamp-2 text-sm">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <span>💬 {post.num_comments} comments</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${
                        post.sentiment > 0.2
                          ? 'bg-green-950/50 text-neon-green'
                          : post.sentiment < -0.2
                          ? 'bg-red-950/50 text-neon-red'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {post.sentiment > 0.2 ? '↑ Positive' : post.sentiment < -0.2 ? '↓ Critical' : '→ Neutral'}
                    </span>
                    {post.robot_mentions && (
                      <span className="text-neon-blue">#{post.robot_mentions.split(',')[0]}</span>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-1" />
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-gray-600">
        Data collected from Reddit via{' '}
        <a href="https://brdta.com/codemyhobby" target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">
          BrightData
        </a>
      </div>
    </div>
  );
}
