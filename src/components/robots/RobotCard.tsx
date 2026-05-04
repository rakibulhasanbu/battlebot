import Link from 'next/link';
import Image from 'next/image';
import type { Robot } from '@/types/robot';
import type { HypeScore } from '@/types/prediction';
import WeaponTypeBadge from './WeaponTypeBadge';
import HypeScoreBar from './HypeScoreBar';
import { winRate } from '@/lib/utils/format';
import { Trophy } from 'lucide-react';

const WEAPON_BG: Record<string, string> = {
  'full-body-spinner':   'bg-gradient-to-br from-red-900 to-red-950',
  'vertical-spinner':   'bg-gradient-to-br from-orange-900 to-orange-950',
  'horizontal-spinner': 'bg-gradient-to-br from-yellow-900 to-yellow-950',
  'drum-spinner':       'bg-gradient-to-br from-amber-900 to-amber-950',
  flipper:              'bg-gradient-to-br from-blue-900 to-blue-950',
  hammer:               'bg-gradient-to-br from-purple-900 to-purple-950',
  thwackbot:            'bg-gradient-to-br from-pink-900 to-pink-950',
  wedge:                'bg-gradient-to-br from-green-900 to-green-950',
  clamper:              'bg-gradient-to-br from-cyan-900 to-cyan-950',
  other:                'bg-gradient-to-br from-gray-800 to-gray-900',
};

interface Props {
  robot: Robot;
  hype?: HypeScore;
}

export default function RobotCard({ robot, hype }: Props) {
  const wr = winRate(robot.wins, robot.losses);

  return (
    <Link href={`/robots/${robot.slug}`} className="arena-card block overflow-hidden group">
      <div className="relative h-40 overflow-hidden">
        {robot.image_url && robot.image_url.startsWith('http') ? (
          <Image
            src={robot.image_url}
            alt={robot.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${WEAPON_BG[robot.weapon_type] ?? WEAPON_BG.other}`}>
            <span className="font-display text-[120px] text-white/10 select-none leading-none absolute">
              {robot.name[0]}
            </span>
            <div className="relative w-16 h-16 rounded-full bg-black/40 border-2 border-white/20 flex items-center justify-center">
              <span className="font-display text-4xl text-white">{robot.name[0]}</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-arena-card/90 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3">
          <WeaponTypeBadge type={robot.weapon_type} />
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display text-lg text-white tracking-wider truncate">{robot.name}</h3>
          <p className="text-xs text-gray-500 truncate">{robot.team}</p>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1 text-neon-green">
            <Trophy className="w-3.5 h-3.5" />
            <span className="font-semibold">{robot.wins}W</span>
          </div>
          <span className="text-gray-600">·</span>
          <span className="text-neon-red font-semibold">{robot.losses}L</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-300">{wr}%</span>
        </div>

        {hype && <HypeScoreBar score={hype.score} />}
      </div>
    </Link>
  );
}
