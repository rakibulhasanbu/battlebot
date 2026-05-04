import { NextResponse } from 'next/server';
import {
  getRobotBySlug,
  getRedditStatsForRobot,
  getYoutubeComments,
  getYoutubeStatsForRobot,
  getCachedPrediction,
  savePrediction,
} from '@/lib/db/queries';
import { predictFight } from '@/lib/ai/gemini';
import type { SocialData } from '@/types/social';

export const dynamic = 'force-dynamic';

function buildSocialData(slug: string, name: string): SocialData {
  const reddit = getRedditStatsForRobot(slug, name);
  const ytStats = getYoutubeStatsForRobot(slug);
  const ytComments = getYoutubeComments(slug, 3);
  return {
    redditMentions7d: reddit.mentions,
    avgRedditSentiment: reddit.avgSentiment,
    totalYoutubeLikes: ytStats.totalLikes,
    youtubeCommentCount: ytStats.count,
    foughtRecently: false,
    topRedditPosts: reddit.posts,
    topYoutubeComments: ytComments,
  };
}

export async function POST(req: Request) {
  const body = await req.json() as { robotASlug?: string; robotBSlug?: string };
  const { robotASlug, robotBSlug } = body;
  if (!robotASlug || !robotBSlug) {
    return NextResponse.json({ error: 'robotASlug and robotBSlug required' }, { status: 400 });
  }

  const cached = getCachedPrediction(robotASlug, robotBSlug);
  if (cached) return NextResponse.json(cached);

  const [robotA, robotB] = [getRobotBySlug(robotASlug), getRobotBySlug(robotBSlug)];
  if (!robotA || !robotB) {
    return NextResponse.json({ error: 'One or both robots not found' }, { status: 404 });
  }

  const [socialA, socialB] = [
    buildSocialData(robotASlug, robotA.name),
    buildSocialData(robotBSlug, robotB.name),
  ];

  const prediction = await predictFight(robotA, socialA, robotB, socialB);
  savePrediction(robotASlug, robotBSlug, prediction);
  return NextResponse.json(prediction);
}
