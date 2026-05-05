import path from 'path';
import fs from 'fs';
import { slugify } from '@/lib/utils/format';
import type { Robot, Fight, WeaponType } from '@/types/robot';

interface JsonRobot {
  robot_name: string;
  robot_type: string;
  team_name: string;
  image_urls: string[];
  career_stats: {
    total_wins: number;
    losses: number;
  };
}

function inferWeaponType(robotType: string): WeaponType {
  const t = robotType.toLowerCase();
  if (t.includes('full body') || t.includes('full-body')) return 'full-body-spinner';
  if (t.includes('vertical') || t.includes('vert')) return 'vertical-spinner';
  if (t.includes('horizontal')) return 'horizontal-spinner';
  if (t.includes('drum') || t.includes('beater')) return 'drum-spinner';
  if (t.includes('flipper') || t.includes('launch')) return 'flipper';
  if (t.includes('hammer') || t.includes('axe') || t.includes('saw')) return 'hammer';
  if (t.includes('wedge') || t.includes('plow')) return 'wedge';
  if (t.includes('clamp') || t.includes('grip') || t.includes('grappler')) return 'clamper';
  if (t.includes('thwack')) return 'thwackbot';
  return 'other';
}

let _robots: Robot[] | null = null;

function loadRobots(): Robot[] {
  if (_robots) return _robots;
  const filePath = path.join(process.cwd(), 'data', 'robots.json');
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as JsonRobot[];
  const seen = new Set<string>();
  _robots = raw
    .filter((r) => r.robot_name?.trim())
    .map((r) => {
      const name = r.robot_name.trim();
      const base = slugify(name);
      let slug = base;
      let n = 2;
      while (seen.has(slug)) slug = `${base}-${n++}`;
      seen.add(slug);
      return {
        slug,
        name,
        weapon_type: inferWeaponType(r.robot_type ?? ''),
        weight_class: 'heavyweight' as const,
        wins: r.career_stats?.total_wins ?? 0,
        losses: r.career_stats?.losses ?? 0,
        team: r.team_name ?? 'Unknown',
        image_url: r.image_urls?.[0] ?? '',
        seasons: '',
        scraped_at: new Date().toISOString(),
      } satisfies Robot;
    });
  return _robots;
}

export function getAllRobots(): Robot[] {
  return loadRobots();
}

export function getRobotBySlug(slug: string): Robot | null {
  return loadRobots().find((r) => r.slug === slug) ?? null;
}

export function getFightsForRobot(_slug: string): Fight[] {
  return [];
}
