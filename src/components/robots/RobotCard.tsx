import Link from 'next/link';
import Image from 'next/image';
import type { Robot } from '@/types/robot';
import type { HypeScore } from '@/types/prediction';
import WeaponTypeBadge from './WeaponTypeBadge';
import HypeScoreBar from './HypeScoreBar';
import { winRate } from '@/lib/utils/format';
import { Trophy } from 'lucide-react';

const WEAPON_BG: Record<string, string> = {
  'full-body-spinner': 'from-red-950 via-red-950/80 to-zinc-950',
  'vertical-spinner': 'from-orange-950 via-orange-900 to-zinc-950',
  'horizontal-spinner': 'from-amber-950 via-yellow-950 to-zinc-950',
  'drum-spinner': 'from-amber-950 via-stone-950 to-zinc-950',
  flipper: 'from-blue-950 via-sky-950 to-zinc-950',
  hammer: 'from-purple-950 via-violet-950 to-zinc-950',
  thwackbot: 'from-pink-950 via-fuchsia-950 to-zinc-950',
  wedge: 'from-emerald-950 via-teal-950 to-zinc-950',
  clamper: 'from-cyan-950 via-sky-950 to-zinc-950',
  other: 'from-zinc-900 via-zinc-900 to-zinc-950',
};

interface Props {
  robot: Robot;
  hype?: HypeScore;
}

export default function RobotCard ({ robot, hype }: Props) {
  const wr = winRate(robot.wins, robot.losses);
  const gradientKey = WEAPON_BG[ robot.weapon_type ] ?? WEAPON_BG.other;

  const hasPhoto = !!(robot.image_url && robot.image_url.startsWith('http'));

  return (
    <Link
      href={ `/robots/${ robot.slug }` }
      className="arena-card group relative block overflow-hidden rounded-xl"
    >
      {/* Media */ }
      <div className="relative isolate aspect-[16/11] max-h-[200px] min-h-[152px] w-full overflow-hidden sm:aspect-[16/10]">
        {/* Subtle cyan/orange HUD tint on imagery */ }
        <div className="pointer-events-none absolute inset-0 z-[3] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 md:duration-500" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_100%,rgba(0,232,255,0.06),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_50%_at_0%_0%,rgba(255,87,34,0.08),transparent_45%)]" />
        </div>

        { hasPhoto ? (
          <Image
            src={ robot.image_url! }
            alt={ robot.name }
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.04] group-hover:brightness-[1.05]"
          />
        ) : (
          <div
            className={ `absolute inset-0 bg-linear-to-br ${ gradientKey } flex items-center justify-center` }
          >
            {/* Texture */ }
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={ {
                backgroundImage: `linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '28px 28px',
              } }
              aria-hidden
            />
            <div className="pointer-events-none absolute -left-1/4 top-1/4 h-[120%] w-[85%] rounded-full bg-black/35 blur-[50px]" aria-hidden />
            <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-3/5 w-3/5 rounded-full bg-white/[0.04] blur-3xl" aria-hidden />

            <span className="font-display pointer-events-none absolute select-none text-[min(52vw,7.5rem)] leading-none tracking-wider text-white/[0.07] drop-shadow-none">
              { robot.name[ 0 ] }
            </span>
            <div className="relative flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-black/55 shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-sm ring ring-white/[0.08]">
              <span className="bg-linear-to-b from-white to-gray-400 bg-clip-text font-display text-4xl text-transparent">{ robot.name[ 0 ] }</span>
            </div>
          </div>
        ) }

        {/* Light bottom fade for badge legibility (no heavy vignette) */ }
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[42%] bg-linear-to-t from-black/45 to-transparent"
          aria-hidden
        />

        {/* Badge */ }
        <div className="absolute bottom-3 left-3 z-[6]">
          <WeaponTypeBadge type={ robot.weapon_type } variant="onMedia" />
        </div>
      </div>

      {/* Meta */ }
      <div className="relative space-y-3 px-4 pb-4 pt-3">
        <div>
          <h3 className="font-display truncate text-lg tracking-wider text-white drop-shadow-sm">
            { robot.name }
          </h3>
          <p className="truncate text-xs tracking-wide text-gray-500">{ robot.team }</p>
        </div>

        <div className="flex items-center gap-2 text-[13px] tabular-nums">
          <div className="flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-0.5 text-neon-green ring-1 ring-white/[0.06]">
            <Trophy className="size-3.5 shrink-0 opacity-90" />
            <span className="font-semibold">{ robot.wins }</span>
            <span className="text-[0.65rem] font-medium uppercase tracking-wide text-green-400/80">w</span>
          </div>
          <span className="select-none max-sm:hidden text-gray-600">·</span>
          <span className="font-semibold text-neon-red">{ robot.losses }L</span>
          <span className="select-none text-gray-600 max-sm:hidden">·</span>
          <span className="font-medium tracking-tight text-gray-200">{ wr }%</span>
        </div>

        { hype && <HypeScoreBar score={ hype.score } className="pt-1" /> }
      </div>
    </Link>
  );
}
