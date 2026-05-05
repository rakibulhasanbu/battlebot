import { NextResponse } from 'next/server';
import { getRobotBySlug, getFightsForRobot } from '@/lib/robots-data';
import { getPostsForRobot, getVideosForRobot, simpleSentiment } from '@/lib/social-data';
import { predictFight } from '@/lib/predict';
import type { SocialData } from '@/types/social';

export const dynamic = 'force-dynamic';

function buildSocialData(name: string, slug: string): SocialData {
  const posts  = getPostsForRobot(name);
  const videos = getVideosForRobot(name);
  const fights = getFightsForRobot(slug);

  const avgSentiment = posts.length
    ? posts.reduce((s, p) => s + simpleSentiment(p.title), 0) / posts.length
    : 0;

  const seasons = fights.map((f) => f.season).filter(Boolean);
  const latestSeason = seasons.length ? Math.max(...seasons.map(Number).filter((n) => !isNaN(n))) : 0;
  const foughtRecently = latestSeason >= 2023;

  return {
    redditMentions7d:    posts.length,
    avgRedditSentiment:  avgSentiment,
    totalYoutubeLikes:   videos.reduce((s, v) => s + v.likes, 0),
    youtubeCommentCount: videos.reduce((s, v) => s + v.comments, 0),
    foughtRecently,
    topRedditPosts:      posts.slice(0, 5),
    topYoutubeVideos:    videos.slice(0, 3),
  };
}

export async function POST(req: Request) {
  const body = await req.json() as { robotASlug?: string; robotBSlug?: string };
  const { robotASlug, robotBSlug } = body;
  if (!robotASlug || !robotBSlug) {
    return NextResponse.json({ error: 'robotASlug and robotBSlug required' }, { status: 400 });
  }

  const [robotA, robotB] = [getRobotBySlug(robotASlug), getRobotBySlug(robotBSlug)];
  if (!robotA || !robotB) {
    return NextResponse.json({ error: 'One or both robots not found' }, { status: 404 });
  }

  const [socialA, socialB] = [buildSocialData(robotA.name, robotASlug), buildSocialData(robotB.name, robotBSlug)];
  const [fightsA, fightsB] = [getFightsForRobot(robotASlug), getFightsForRobot(robotBSlug)];

  const prediction = predictFight(robotA, socialA, robotB, socialB, fightsA, fightsB);
  return NextResponse.json(prediction);
}
