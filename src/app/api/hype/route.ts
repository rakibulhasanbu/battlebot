import { NextResponse } from 'next/server';
import { computeHypeScores } from '@/lib/db/queries';
import { seedDatabase } from '@/lib/db/seed';

export const dynamic = 'force-dynamic';

export async function GET() {
  seedDatabase();
  const scores = computeHypeScores();
  return NextResponse.json(scores);
}
