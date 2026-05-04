import { getDb } from './client';
import type { Robot, Fight } from '@/types/robot';
import type { RedditPost, YouTubeComment } from '@/types/social';
import type { FightPrediction, HypeScore } from '@/types/prediction';
import { winRate } from '@/lib/utils/format';

// ── Robots ──────────────────────────────────────────────────────────────────

export function getAllRobots(): Robot[] {
  return getDb().prepare('SELECT * FROM robots ORDER BY wins DESC').all() as Robot[];
}

export function getRobotBySlug(slug: string): Robot | null {
  return (getDb().prepare('SELECT * FROM robots WHERE slug = ?').get(slug) as Robot) ?? null;
}

export function upsertRobot(robot: Omit<Robot, 'scraped_at'>): void {
  getDb()
    .prepare(
      `INSERT INTO robots (slug, name, weapon_type, weight_class, wins, losses, team, image_url, seasons)
       VALUES (@slug, @name, @weapon_type, @weight_class, @wins, @losses, @team, @image_url, @seasons)
       ON CONFLICT(slug) DO UPDATE SET
         name = excluded.name,
         weapon_type = excluded.weapon_type,
         weight_class = excluded.weight_class,
         wins = excluded.wins,
         losses = excluded.losses,
         team = excluded.team,
         image_url = excluded.image_url,
         seasons = excluded.seasons,
         scraped_at = datetime('now')`
    )
    .run(robot);
}

// ── Fights ───────────────────────────────────────────────────────────────────

export function getFightsByRobot(slug: string): Fight[] {
  return getDb()
    .prepare('SELECT * FROM fights WHERE robot_slug = ? ORDER BY season DESC')
    .all(slug) as Fight[];
}

export function insertFight(fight: Omit<Fight, 'id' | 'scraped_at'>): void {
  getDb()
    .prepare(
      `INSERT OR IGNORE INTO fights (robot_slug, opponent_slug, opponent_name, result, season, method)
       VALUES (@robot_slug, @opponent_slug, @opponent_name, @result, @season, @method)`
    )
    .run(fight);
}

// ── Reddit ───────────────────────────────────────────────────────────────────

export function getRecentRedditPosts(limit = 30): RedditPost[] {
  return getDb()
    .prepare('SELECT * FROM reddit_posts ORDER BY scraped_at DESC, score DESC LIMIT ?')
    .all(limit) as RedditPost[];
}

export function upsertRedditPost(post: Omit<RedditPost, 'id' | 'scraped_at'>): void {
  getDb()
    .prepare(
      `INSERT OR REPLACE INTO reddit_posts (title, score, num_comments, robot_mentions, sentiment, url, author)
       VALUES (@title, @score, @num_comments, @robot_mentions, @sentiment, @url, @author)`
    )
    .run(post);
}

export function getRedditStatsForRobot(slug: string, name: string) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const posts = getDb()
    .prepare(
      `SELECT * FROM reddit_posts
       WHERE (robot_mentions LIKE ? OR title LIKE ?)
       AND scraped_at > ?
       ORDER BY score DESC LIMIT 10`
    )
    .all(`%${slug}%`, `%${name}%`, sevenDaysAgo) as RedditPost[];

  const mentions = posts.length;
  const avgSentiment =
    mentions > 0 ? posts.reduce((s, p) => s + p.sentiment, 0) / mentions : 0;
  return { mentions, avgSentiment, posts };
}

// ── YouTube ──────────────────────────────────────────────────────────────────

export function getYoutubeComments(robotSlug: string, limit = 10): YouTubeComment[] {
  return getDb()
    .prepare(
      'SELECT * FROM youtube_comments WHERE robot_slug = ? ORDER BY likes DESC LIMIT ?'
    )
    .all(robotSlug, limit) as YouTubeComment[];
}

export function upsertYoutubeComment(comment: Omit<YouTubeComment, 'id' | 'scraped_at'>): void {
  getDb()
    .prepare(
      `INSERT OR REPLACE INTO youtube_comments (robot_slug, video_url, video_title, comment_text, likes, sentiment)
       VALUES (@robot_slug, @video_url, @video_title, @comment_text, @likes, @sentiment)`
    )
    .run(comment);
}

export function getYoutubeStatsForRobot(slug: string) {
  const row = getDb()
    .prepare(
      'SELECT COUNT(*) as count, COALESCE(SUM(likes),0) as total_likes FROM youtube_comments WHERE robot_slug = ?'
    )
    .get(slug) as { count: number; total_likes: number };
  return { count: row.count, totalLikes: row.total_likes };
}

// ── Predictions ───────────────────────────────────────────────────────────────

export function getCachedPrediction(
  slugA: string,
  slugB: string
): FightPrediction | null {
  const [a, b] = [slugA, slugB].sort();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const row = getDb()
    .prepare(
      'SELECT prediction_json FROM predictions WHERE robot_a_slug = ? AND robot_b_slug = ? AND created_at > ?'
    )
    .get(a, b, oneDayAgo) as { prediction_json: string } | undefined;
  if (!row) return null;
  try {
    return JSON.parse(row.prediction_json) as FightPrediction;
  } catch {
    return null;
  }
}

export function savePrediction(
  slugA: string,
  slugB: string,
  prediction: FightPrediction
): void {
  const [a, b] = [slugA, slugB].sort();
  getDb()
    .prepare(
      `INSERT OR REPLACE INTO predictions (robot_a_slug, robot_b_slug, prediction_json, created_at)
       VALUES (?, ?, ?, datetime('now'))`
    )
    .run(a, b, JSON.stringify(prediction));
}

// ── Hype Scores ───────────────────────────────────────────────────────────────

export function computeHypeScores(): HypeScore[] {
  const robots = getAllRobots();
  return robots
    .map((r) => {
      const { mentions, avgSentiment } = getRedditStatsForRobot(r.slug, r.name);
      const { totalLikes } = getYoutubeStatsForRobot(r.slug);

      const wr = winRate(r.wins, r.losses);
      const redditMentionScore = Math.min(mentions / 20, 1) * 100;
      const redditSentimentScore = ((avgSentiment + 1) / 2) * 100;
      const youtubeLikeScore = Math.min(totalLikes / 5000, 1) * 100;

      const score = Math.round(
        wr * 0.4 +
          redditMentionScore * 0.2 +
          redditSentimentScore * 0.2 +
          youtubeLikeScore * 0.2
      );

      return {
        slug: r.slug,
        name: r.name,
        score,
        image_url: r.image_url,
        weapon_type: r.weapon_type,
        wins: r.wins,
        losses: r.losses,
      } satisfies HypeScore;
    })
    .sort((a, b) => b.score - a.score);
}
