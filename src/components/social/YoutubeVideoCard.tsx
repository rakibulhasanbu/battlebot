import type { YoutubeVideo } from '@/types/social';
import { Play } from 'lucide-react';

function formatDuration(seconds: number): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export default function YoutubeVideoCard({ video }: { video: YoutubeVideo }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-panel group overflow-hidden transition-colors hover:border-red-400/55 hover:shadow-[0_0_24px_rgba(239,68,68,0.15)]"
    >
      <div className="relative aspect-video bg-gray-900">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-900/40 to-gray-900 flex items-center justify-center">
            <Play className="w-10 h-10 text-red-500/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>
        {video.duration_s > 0 && (
          <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-mono">
            {formatDuration(video.duration_s)}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm text-gray-200 group-hover:text-white transition-colors line-clamp-2 mb-2 leading-snug">
          {video.title}
        </p>
        <div className="text-xs text-gray-500 truncate mb-2">{video.channel}</div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="text-gray-400">{formatViews(video.views)} views</span>
          {video.likes > 0 && <span>👍 {formatViews(video.likes)}</span>}
        </div>
      </div>
    </a>
  );
}
