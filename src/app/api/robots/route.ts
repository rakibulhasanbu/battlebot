import { NextResponse } from 'next/server';
import { getAllRobots } from '@/lib/robots-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getAllRobots());
}
