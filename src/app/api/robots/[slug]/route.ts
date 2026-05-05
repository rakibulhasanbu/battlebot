import { NextResponse } from 'next/server';
import { getRobotBySlug, getFightsForRobot } from '@/lib/robots-data';
import { getVideosForRobot, getPostsForRobot } from '@/lib/social-data';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const robot = getRobotBySlug(slug);
  if (!robot) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const videos = getVideosForRobot(robot.name);
  const posts  = getPostsForRobot(robot.name);
  return NextResponse.json({ ...robot, fights: getFightsForRobot(slug), videos, posts });
}
