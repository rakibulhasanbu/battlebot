import { cn } from '@/lib/utils/cn';
import { weaponLabel } from '@/lib/utils/format';

const COLORS: Record<string, string> = {
  'full-body-spinner':  'bg-red-900/40 text-red-300 border-red-700/50',
  'vertical-spinner':  'bg-orange-900/40 text-orange-300 border-orange-700/50',
  'horizontal-spinner':'bg-yellow-900/40 text-yellow-300 border-yellow-700/50',
  'drum-spinner':       'bg-amber-900/40 text-amber-300 border-amber-700/50',
  flipper:              'bg-blue-900/40 text-blue-300 border-blue-700/50',
  hammer:               'bg-purple-900/40 text-purple-300 border-purple-700/50',
  thwackbot:            'bg-pink-900/40 text-pink-300 border-pink-700/50',
  wedge:                'bg-green-900/40 text-green-300 border-green-700/50',
  clamper:              'bg-cyan-900/40 text-cyan-300 border-cyan-700/50',
  other:                'bg-gray-800 text-gray-400 border-gray-600/50',
};

export default function WeaponTypeBadge({ type, className }: { type: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        COLORS[type] ?? COLORS.other,
        className
      )}
    >
      {weaponLabel(type)}
    </span>
  );
}
