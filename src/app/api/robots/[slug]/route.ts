import { NextResponse } from 'next/server';
import { getRobotBySlug, getFightsByRobot } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const robot = getRobotBySlug(slug);
  if (!robot) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const fights = getFightsByRobot(slug);
  return NextResponse.json({ ...robot, fights });
}
