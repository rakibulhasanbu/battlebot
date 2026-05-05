import { getAllRedditPosts } from '@/lib/social-data';
import { simpleSentiment } from '@/lib/social-data';
import RedditPostCard from '@/components/social/RedditPostCard';
import { MessageSquare, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Community Pulse — BattleBot Arena AI' };

export default function CommunityPage() {
  const posts = getAllRedditPosts().slice(0, 30);

  const sentiments = posts.map((p) => simpleSentiment(p.title));
  const avgSentiment = sentiments.length
    ? sentiments.reduce((s, v) => s + v, 0) / sentiments.length
    : 0;
  const sentimentPct  = Math.round(((avgSentiment + 1) / 2) * 100);
  const positiveCount = sentiments.filter((s) => s > 0.2).length;
  const negativeCount = sentiments.filter((s) => s < -0.2).length;
  const neutralCount  = sentiments.length - positiveCount - negativeCount;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-7 h-7 text-neon-blue" />
          <h1 className="font-display text-4xl text-white tracking-wider">
            COMMUNITY <span className="text-neon-blue">PULSE</span>
          </h1>
        </div>
        <p className="text-gray-500">r/battlebots posts via BrightData</p>
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
            <p className="text-gray-600">No posts yet. Add reddit-posts.json to the data folder.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {posts.map((post) => (
              <RedditPostCard key={post.post_id || post.url} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
