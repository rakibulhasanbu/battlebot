import { NextResponse } from 'next/server';
import { scrapeYoutubeForRobot } from '@/lib/brightdata/scrapers/youtube';
import { getAllRobots } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (req.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json() as { slug?: string };
  const robots = body.slug
    ? [{ slug: body.slug, name: body.slug }]
    : getAllRobots().slice(0, 5).map((r) => ({ slug: r.slug, name: r.name }));

  const results = [];
  for (const { slug, name } of robots) {
    const r = await scrapeYoutubeForRobot(slug, name);
    results.push({ slug, ...r });
  }
  return NextResponse.json(results);
}
