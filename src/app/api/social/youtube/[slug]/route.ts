import { NextResponse } from 'next/server';
import { getYoutubeComments, getYoutubeStatsForRobot } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comments = getYoutubeComments(slug, 10);
  const stats = getYoutubeStatsForRobot(slug);
  return NextResponse.json({ comments, ...stats });
}
