import { NextResponse } from 'next/server';
import { getRobotBySlug } from '@/lib/robots-data';
import { getPostsForRobot, getVideosForRobot, simpleSentiment } from '@/lib/social-data';
import { predictFight } from '@/lib/ai/gemini';
import type { SocialData } from '@/types/social';

export const dynamic = 'force-dynamic';

function buildSocialData(name: string): SocialData {
  const posts  = getPostsForRobot(name);
  const videos = getVideosForRobot(name);
  const avgSentiment = posts.length
    ? posts.reduce((s, p) => s + simpleSentiment(p.title), 0) / posts.length
    : 0;
  return {
    redditMentions7d:    posts.length,
    avgRedditSentiment:  avgSentiment,
    totalYoutubeLikes:   videos.reduce((s, v) => s + v.likes, 0),
    youtubeCommentCount: videos.length,
    foughtRecently:      false,
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

  const [socialA, socialB] = [buildSocialData(robotA.name), buildSocialData(robotB.name)];
  const prediction = await predictFight(robotA, socialA, robotB, socialB);
  return NextResponse.json(prediction);
}
