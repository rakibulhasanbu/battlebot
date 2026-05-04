import { collectDataset } from '../dataset-api';
import { upsertRedditPost, getAllRobots } from '@/lib/db/queries';
import { slugify } from '@/lib/utils/format';

const REDDIT_DATASET_ID = 'gd_lvz8ah06191smkebj4';

interface RawRedditPost {
  title?: string;
  score?: number;
  num_comments?: number;
  url?: string;
  author?: string;
  selftext?: string;
}

function simpleSentiment(text: string): number {
  const positive = ['win', 'won', 'great', 'amazing', 'beast', 'dominant', 'champion', 'love', 'awesome', 'incredible', 'powerful', 'best'];
  const negative = ['lost', 'broke', 'terrible', 'weak', 'boring', 'bad', 'worst', 'pathetic', 'slow', 'boring'];
  const lower = text.toLowerCase();
  let score = 0;
  positive.forEach((w) => { if (lower.includes(w)) score += 0.1; });
  negative.forEach((w) => { if (lower.includes(w)) score -= 0.1; });
  return Math.max(-1, Math.min(1, score));
}

function detectRobotMentions(text: string, robotNames: string[]): string {
  const lower = text.toLowerCase();
  return robotNames
    .filter((name) => lower.includes(name.toLowerCase()))
    .map((name) => slugify(name))
    .join(',');
}

export async function scrapeReddit(): Promise<{ imported: number }> {
  const posts = await collectDataset<RawRedditPost>(REDDIT_DATASET_ID, [
    { url: 'https://www.reddit.com/r/battlebots/' },
    { url: 'https://www.reddit.com/r/battlebots/top/?t=week' },
  ]);

  const allRobots = getAllRobots();
  const robotNames = allRobots.map((r) => r.name);

  let imported = 0;
  for (const post of posts) {
    if (!post.title) continue;
    const text = `${post.title} ${post.selftext ?? ''}`;
    upsertRedditPost({
      title: post.title,
      score: post.score ?? 0,
      num_comments: post.num_comments ?? 0,
      robot_mentions: detectRobotMentions(text, robotNames),
      sentiment: simpleSentiment(text),
      url: post.url ?? '',
      author: post.author ?? '',
    });
    imported++;
  }

  return { imported };
}
