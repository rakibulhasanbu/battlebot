import { collectDataset } from '../dataset-api';
import { upsertYoutubeComment } from '@/lib/db/queries';

const YOUTUBE_DATASET_ID = 'gd_lk56epmy2i5g7lzu0k';

interface RawYoutubeVideo {
  url?: string;
  title?: string;
  comments?: { text?: string; likes?: number }[];
}

function simpleSentiment(text: string): number {
  const positive = ['win', 'won', 'amazing', 'love', 'great', 'dominant', 'beast', 'incredible', 'awesome'];
  const negative = ['lost', 'broke', 'boring', 'bad', 'weak', 'pathetic', 'worst', 'terrible'];
  const lower = text.toLowerCase();
  let score = 0;
  positive.forEach((w) => { if (lower.includes(w)) score += 0.15; });
  negative.forEach((w) => { if (lower.includes(w)) score -= 0.15; });
  return Math.max(-1, Math.min(1, score));
}

export async function scrapeYoutubeForRobot(
  robotSlug: string,
  robotName: string
): Promise<{ imported: number }> {
  const searchUrl = `https://www.youtube.com/results?search_query=battlebots+${encodeURIComponent(robotName)}+fight`;

  const videos = await collectDataset<RawYoutubeVideo>(YOUTUBE_DATASET_ID, [
    { url: searchUrl },
  ]);

  let imported = 0;
  for (const video of videos.slice(0, 3)) {
    for (const comment of (video.comments ?? []).slice(0, 20)) {
      if (!comment.text) continue;
      upsertYoutubeComment({
        robot_slug: robotSlug,
        video_url: video.url ?? '',
        video_title: video.title ?? '',
        comment_text: comment.text,
        likes: comment.likes ?? 0,
        sentiment: simpleSentiment(comment.text),
      });
      imported++;
    }
  }

  return { imported };
}
