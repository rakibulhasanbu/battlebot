import { NextResponse } from 'next/server';
import { getRecentRedditPosts, getRedditStatsForRobot, getRobotBySlug } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const robot = searchParams.get('robot');

  if (robot) {
    const robotData = getRobotBySlug(robot);
    if (!robotData) return NextResponse.json({ posts: [], sentimentScore: 0 });
    const stats = getRedditStatsForRobot(robot, robotData.name);
    return NextResponse.json({
      posts: stats.posts,
      sentimentScore: stats.avgSentiment,
      mentions: stats.mentions,
    });
  }

  const posts = getRecentRedditPosts(40);
  return NextResponse.json(posts);
}
