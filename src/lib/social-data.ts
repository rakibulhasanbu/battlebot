import path from 'path';
import fs from 'fs';
import { slugify, winRate } from '@/lib/utils/format';
import type { YoutubeVideo, RedditPost } from '@/types/social';
import type { Robot } from '@/types/robot';
import type { HypeScore } from '@/types/prediction';

// ── Sentiment (inline from deleted scrapers/reddit.ts) ───────────────────────

export function simpleSentiment(text: string): number {
  const positive = ['win', 'won', 'great', 'amazing', 'beast', 'dominant', 'champion', 'love', 'awesome', 'incredible', 'powerful', 'best'];
  const negative = ['lost', 'broke', 'terrible', 'weak', 'boring', 'bad', 'worst', 'pathetic', 'slow'];
  const lower = text.toLowerCase();
  let score = 0;
  positive.forEach((w) => { if (lower.includes(w)) score += 0.1; });
  negative.forEach((w) => { if (lower.includes(w)) score -= 0.1; });
  return Math.max(-1, Math.min(1, score));
}

// ── Raw JSON shapes ──────────────────────────────────────────────────────────

interface RawRedditPost {
  post_id?: string;
  url?: string;
  title?: string;
  description?: string;
  num_upvotes?: number | string;
  num_comments?: number;
  user_posted?: string;
  community_name?: string;
  date_posted?: string;
}

interface RawYoutubeVideo {
  url?: string;
  title?: string;
  video_id?: string;
  shortcode?: string;
  preview_image?: string;
  thumbnail?: string;
  views?: number;
  likes?: number;
  video_length?: number;
  youtuber?: string;
  handle_name?: string;
  channel_url?: string;
  date_posted?: string;
}

// ── Load robot names for YouTube filtering ───────────────────────────────────

function loadRobotNames(): string[] {
  try {
    const raw = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'robots.json'), 'utf-8')
    ) as { robot_name?: string }[];
    return raw.filter((r) => r.robot_name?.trim()).map((r) => r.robot_name!.trim().toLowerCase());
  } catch {
    return [];
  }
}

// ── YouTube ──────────────────────────────────────────────────────────────────

let _videos: YoutubeVideo[] | null = null;

function loadVideos(): YoutubeVideo[] {
  if (_videos) return _videos;

  const filePath = path.join(process.cwd(), 'data', 'youtube-posts.json');
  if (!fs.existsSync(filePath)) { _videos = []; return _videos; }

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RawYoutubeVideo[];
  const robotNames = loadRobotNames();

  _videos = raw
    .filter((v) => isBattleBotsVideo(v, robotNames))
    .map((v) => ({
      video_id:   v.video_id ?? v.shortcode ?? '',
      url:        v.url ?? '',
      title:      v.title ?? '',
      thumbnail:  v.preview_image ?? v.thumbnail ?? '',
      views:      Number(v.views ?? 0),
      likes:      Number(v.likes ?? 0),
      channel:    v.handle_name ?? v.youtuber ?? '',
      channel_url: v.channel_url ?? '',
      duration_s: Number(v.video_length ?? 0),
      date_posted: v.date_posted ?? '',
    }))
    .sort((a, b) => b.views - a.views);

  return _videos;
}

function isBattleBotsVideo(v: RawYoutubeVideo, robotNames: string[]): boolean {
  const title   = (v.title ?? '').toLowerCase();
  const channel = (v.youtuber ?? v.handle_name ?? '').toLowerCase();

  if (channel.includes('battlebots')) return true;
  if (title.includes('battlebots') || title.includes('battle bots')) return true;

  const hasFightContext = title.includes(' vs') || title.includes('fight') || title.includes('battle');
  if (hasFightContext && robotNames.some((n) => title.includes(n))) return true;

  return false;
}

export function getAllYoutubeVideos(): YoutubeVideo[] {
  return loadVideos();
}

export function getVideosForRobot(robotName: string): YoutubeVideo[] {
  const name = robotName.toLowerCase();
  return loadVideos().filter((v) => v.title.toLowerCase().includes(name));
}

// ── Reddit ────────────────────────────────────────────────────────────────────

let _posts: RedditPost[] | null = null;

function loadPosts(): RedditPost[] {
  if (_posts) return _posts;

  const filePath = path.join(process.cwd(), 'data', 'reddit-posts.json');
  if (!fs.existsSync(filePath)) { _posts = []; return _posts; }

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RawRedditPost[];

  _posts = raw
    .filter(isBattleBotsPost)
    .map((p) => ({
      post_id:    p.post_id ?? '',
      url:        p.url ?? '',
      title:      p.title ?? '',
      upvotes:    Number(p.num_upvotes ?? 0),
      comments:   Number(p.num_comments ?? 0),
      author:     p.user_posted ?? '',
      community:  p.community_name ?? '',
      date_posted: p.date_posted ?? '',
    }))
    .sort((a, b) => b.upvotes - a.upvotes);

  return _posts;
}

function isBattleBotsPost(p: RawRedditPost): boolean {
  const community = (p.community_name ?? '').toLowerCase();
  const title     = (p.title ?? '').toLowerCase();
  const desc      = (p.description ?? '').toLowerCase();
  if (community === 'battlebots') return true;
  if (title.includes('battlebots') || desc.includes('battlebots')) return true;
  return false;
}

export function getAllRedditPosts(): RedditPost[] {
  return loadPosts();
}

export function getPostsForRobot(robotName: string): RedditPost[] {
  const name = robotName.toLowerCase();
  return loadPosts().filter((p) => p.title.toLowerCase().includes(name));
}

// ── Hype Scores (pure JSON, no DB) ────────────────────────────────────────────

export function computeHypeScores(robots: Robot[]): HypeScore[] {
  return robots
    .map((r) => {
      const posts  = getPostsForRobot(r.name);
      const videos = getVideosForRobot(r.name);

      const wr = winRate(r.wins, r.losses);
      const mentionScore    = Math.min(posts.length / 20, 1) * 100;
      const avgSentiment    = posts.length
        ? posts.reduce((s, p) => s + simpleSentiment(p.title), 0) / posts.length
        : 0;
      const sentimentScore  = ((avgSentiment + 1) / 2) * 100;
      const totalLikes      = videos.reduce((s, v) => s + v.likes, 0);
      const likeScore       = Math.min(totalLikes / 5000, 1) * 100;

      const score = Math.round(
        wr * 0.4 +
        mentionScore  * 0.2 +
        sentimentScore * 0.2 +
        likeScore     * 0.2
      );

      return {
        slug:        r.slug,
        name:        r.name,
        score,
        image_url:   r.image_url,
        weapon_type: r.weapon_type,
        wins:        r.wins,
        losses:      r.losses,
      } satisfies HypeScore;
    })
    .sort((a, b) => b.score - a.score);
}
