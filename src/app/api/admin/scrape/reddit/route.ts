import { NextResponse } from 'next/server';
import { scrapeReddit } from '@/lib/brightdata/scrapers/reddit';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (req.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await scrapeReddit();
  return NextResponse.json(result);
}
