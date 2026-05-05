import type { RedditPost } from '@/types/social';
import { simpleSentiment } from '@/lib/social-data';
import { ExternalLink } from 'lucide-react';

export default function RedditPostCard({ post }: { post: RedditPost }) {
  const sentiment = simpleSentiment(post.title);
  const sentimentLabel = sentiment > 0.2 ? '↑ Positive' : sentiment < -0.2 ? '↓ Critical' : '→ Neutral';
  const sentimentClass = sentiment > 0.2
    ? 'bg-green-950/50 text-neon-green'
    : sentiment < -0.2
    ? 'bg-red-950/50 text-neon-red'
    : 'bg-gray-800 text-gray-500';

  const date = post.date_posted
    ? new Date(post.date_posted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/3 transition-colors group"
    >
      <div className="text-center shrink-0 w-12">
        <div className="text-neon-orange font-bold">{post.upvotes.toLocaleString()}</div>
        <div className="text-gray-600 text-xs">upvotes</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-300 group-hover:text-white transition-colors line-clamp-2 text-sm">
          {post.title}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 flex-wrap">
          <span>💬 {post.comments} comments</span>
          <span className={`px-1.5 py-0.5 rounded text-xs ${sentimentClass}`}>
            {sentimentLabel}
          </span>
          {date && <span>{date}</span>}
          {post.author && <span className="text-gray-700">u/{post.author}</span>}
        </div>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-1" />
    </a>
  );
}
