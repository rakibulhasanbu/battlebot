import { NextResponse } from 'next/server';
import { scrapeAllRobots } from '@/lib/brightdata/scrapers/robots';

export const dynamic = 'force-dynamic';

function checkAuth(req: Request): boolean {
  return req.headers.get('x-admin-secret') === process.env.ADMIN_SECRET;
}

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await scrapeAllRobots();
  return NextResponse.json(result);
}
