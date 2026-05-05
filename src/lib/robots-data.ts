import path from 'path';
import fs from 'fs';
import { slugify } from '@/lib/utils/format';
import type { Robot, Fight, WeaponType } from '@/types/robot';

interface RawMatch {
  season?: string;
  round?: string;
  matchup?: string;
  result?: string;
}

interface JsonRobot {
  robot_name?: string;
  robot_type?: string;
  team_name?: string;
  builder_name?: string;
  builder_job?: string;
  hometown?: string;
  years_competing?: string;
  team_members?: string;
  image_urls?: string[];
  sponsors?: string[];
  website_urls?: string[];
  career_stats?: { win_percentage?: string };
  match_history?: RawMatch[];
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

function parseWinner(result: string): string {
  // Format: "RobotName by KO 1m36s" or "RobotName by JD"
  const byIndex = result.indexOf(' by ');
  if (byIndex === -1) return result.trim();
  return result.slice(0, byIndex).trim();
}

function parseMethod(result: string): string {
  const byIndex = result.indexOf(' by ');
  if (byIndex === -1) return '';
  const afterBy = result.slice(byIndex + 4).trim();
  return afterBy.split(' ')[0]; // "KO" or "JD"
}

let _robots: Robot[] | null = null;
let _fightMap: Map<string, Fight[]> | null = null;

function loadData(): void {
  if (_robots) return;

  const filePath = path.join(process.cwd(), 'data', 'robots.json');
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as JsonRobot[];

  const seen = new Set<string>();
  const slugMap = new Map<string, string>(); // name → slug (for opponent slug lookup)
  const fightMap = new Map<string, Fight[]>();

  // First pass: build slug map
  const validRobots = raw.filter((r) => r.robot_name?.trim());
  validRobots.forEach((r) => {
    const name = r.robot_name!.trim();
    const base = slugify(name);
    let slug = base;
    let n = 2;
    while (seen.has(slug)) slug = `${base}-${n++}`;
    seen.add(slug);
    slugMap.set(name.toLowerCase(), slug);
  });

  // Second pass: build robots + fights
  seen.clear();
  let fightId = 0;

  _robots = validRobots.map((r) => {
    const name = r.robot_name!.trim();
    const base = slugify(name);
    let slug = base;
    let n = 2;
    while (seen.has(slug)) slug = `${base}-${n++}`;
    seen.add(slug);

    const nameLower = name.toLowerCase();
    const history = (r.match_history ?? []).filter(
      (m) => m.result && m.matchup && m.result.includes(' by ')
    );

    let wins = 0;
    let losses = 0;
    const fights: Fight[] = [];

    history.forEach((m) => {
      const winner = parseWinner(m.result!);
      const isWin = winner.toLowerCase() === nameLower;
      if (isWin) wins++; else losses++;

      // Extract opponents from matchup (e.g. "Hydra vs End Game" or 3-way)
      const participants = (m.matchup ?? '').split(' vs ').map((p) => p.trim());
      const opponents = participants.filter((p) => p.toLowerCase() !== nameLower);
      const opponentName = opponents.join(' & ') || winner;
      const opponentSlug = slugMap.get(opponentName.toLowerCase()) ?? slugify(opponentName);

      fights.push({
        id: ++fightId,
        robot_slug: slug,
        opponent_slug: opponentSlug,
        opponent_name: opponentName,
        result: isWin ? 'win' : 'loss',
        season: m.season ?? '',
        method: parseMethod(m.result!),
        scraped_at: new Date().toISOString(),
      });
    });

    fightMap.set(slug, fights);

    return {
      slug,
      name,
      weapon_type: inferWeaponType(r.robot_type ?? ''),
      weight_class: 'heavyweight' as const,
      wins,
      losses,
      team: r.team_name ?? 'Unknown',
      image_url: r.image_urls?.[0] ?? '',
      seasons: '',
      scraped_at: new Date().toISOString(),
      builder_name: r.builder_name,
      builder_job: r.builder_job,
      hometown: r.hometown,
      years_competing: r.years_competing,
      team_members: r.team_members,
      sponsors: r.sponsors?.filter(Boolean),
      website_urls: r.website_urls?.filter(Boolean),
    } satisfies Robot;
  });

  _fightMap = fightMap;
}

export function getAllRobots(): Robot[] {
  loadData();
  return _robots!;
}

export function getRobotBySlug(slug: string): Robot | null {
  loadData();
  return _robots!.find((r) => r.slug === slug) ?? null;
}

export function getFightsForRobot(slug: string): Fight[] {
  loadData();
  return _fightMap!.get(slug) ?? [];
}
