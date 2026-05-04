import { withScrapingBrowser } from '../scraping-browser';
import { upsertRobot, insertFight } from '@/lib/db/queries';
import { slugify } from '@/lib/utils/format';
import type { WeaponType, WeightClass } from '@/types/robot';

const SEASON_URLS = [
  'https://battlebots.com/robots/world-championship-vii-robots/',
  'https://battlebots.com/robots/2021-robots/',
];

function inferWeaponType(description: string): WeaponType {
  const d = description.toLowerCase();
  if (d.includes('full body') || d.includes('full-body')) return 'full-body-spinner';
  if (d.includes('vertical spinner') || d.includes('vert')) return 'vertical-spinner';
  if (d.includes('horizontal spinner') || d.includes('horizontal')) return 'horizontal-spinner';
  if (d.includes('drum')) return 'drum-spinner';
  if (d.includes('flipper') || d.includes('launch')) return 'flipper';
  if (d.includes('hammer') || d.includes('axe')) return 'hammer';
  if (d.includes('wedge') || d.includes('plow')) return 'wedge';
  if (d.includes('clamp') || d.includes('grip')) return 'clamper';
  return 'other';
}

export async function scrapeRobotList(seasonUrl: string): Promise<string[]> {
  return withScrapingBrowser(seasonUrl, async (page) => {
    await page.waitForSelector('.robot-card, article, .entry-title', { timeout: 15000 }).catch(() => {});
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href*="/robot/"]'));
      return anchors
        .map((a) => (a as HTMLAnchorElement).href)
        .filter((href, i, arr) => arr.indexOf(href) === i);
    });
    return links as string[];
  });
}

export async function scrapeRobotProfile(robotUrl: string): Promise<void> {
  await withScrapingBrowser(robotUrl, async (page) => {
    await page.waitForSelector('h1, .robot-name, .entry-title', { timeout: 15000 }).catch(() => {});

    const data = await page.evaluate(() => {
      const getText = (sel: string) =>
        (document.querySelector(sel) as HTMLElement)?.innerText?.trim() ?? '';
      const getAttr = (sel: string, attr: string) =>
        (document.querySelector(sel) as HTMLElement)?.getAttribute(attr) ?? '';

      const name =
        getText('h1.entry-title') ||
        getText('.robot-name') ||
        getText('h1') ||
        document.title.replace(' - BattleBots', '').trim();

      const imageUrl =
        getAttr('.robot-image img, .wp-post-image, .entry-thumbnail img, article img', 'src') ||
        getAttr('meta[property="og:image"]', 'content');

      const bodyText = getText('.entry-content, article, main') || document.body.innerText;

      const teamMatch = bodyText.match(/team[:\s]+([^\n,]+)/i);
      const winsMatch = bodyText.match(/(\d+)\s*wins?/i);
      const lossesMatch = bodyText.match(/(\d+)\s*loss(?:es)?/i);

      return {
        name,
        imageUrl,
        bodyText: bodyText.slice(0, 2000),
        team: teamMatch?.[1]?.trim() ?? 'Unknown',
        wins: parseInt(winsMatch?.[1] ?? '0', 10),
        losses: parseInt(lossesMatch?.[1] ?? '0', 10),
      };
    });

    if (!data.name) return;

    const slug = slugify(data.name);
    const weaponType = inferWeaponType(data.bodyText);
    const seasonMatch = robotUrl.match(/world-championship-(\w+)|(\d{4})/);
    const season = seasonMatch?.[1] ?? seasonMatch?.[2] ?? 'Unknown';

    upsertRobot({
      slug,
      name: data.name,
      weapon_type: weaponType,
      weight_class: 'heavyweight' as WeightClass,
      wins: data.wins,
      losses: data.losses,
      team: data.team,
      image_url: data.imageUrl,
      seasons: season,
    });
  });
}

export async function scrapeAllRobots(): Promise<{ scraped: number; errors: string[] }> {
  const errors: string[] = [];
  let scraped = 0;

  for (const seasonUrl of SEASON_URLS) {
    let robotUrls: string[] = [];
    try {
      robotUrls = await scrapeRobotList(seasonUrl);
    } catch (e) {
      errors.push(`Failed to get robot list from ${seasonUrl}: ${e}`);
      continue;
    }

    for (const url of robotUrls.slice(0, 30)) {
      try {
        await scrapeRobotProfile(url);
        scraped++;
        await new Promise((r) => setTimeout(r, 1000));
      } catch (e) {
        errors.push(`Failed to scrape ${url}: ${e}`);
      }
    }
  }

  return { scraped, errors };
}
