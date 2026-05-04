import { NextResponse } from 'next/server';
import { getAllRobots } from '@/lib/db/queries';
import { seedDatabase } from '@/lib/db/seed';

export const dynamic = 'force-dynamic';

export async function GET() {
  seedDatabase();
  const robots = getAllRobots();
  return NextResponse.json(robots);
}
