import { cn } from '@/lib/utils/cn';
import { weaponLabel } from '@/lib/utils/format';

const COLORS: Record<string, string> = {
  'full-body-spinner': 'bg-red-950/55 text-red-200 border-red-400/35',
  'vertical-spinner': 'bg-orange-950/55 text-orange-200 border-orange-400/35',
  'horizontal-spinner': 'bg-yellow-950/55 text-yellow-200 border-yellow-400/35',
  'drum-spinner': 'bg-amber-950/55 text-amber-200 border-amber-400/35',
  flipper: 'bg-blue-950/55 text-blue-200 border-blue-400/35',
  hammer: 'bg-purple-950/55 text-purple-200 border-purple-400/35',
  thwackbot: 'bg-pink-950/55 text-pink-200 border-pink-400/35',
  wedge: 'bg-emerald-950/55 text-emerald-200 border-emerald-400/35',
  clamper: 'bg-cyan-950/55 text-cyan-200 border-cyan-400/35',
  other: 'bg-gray-950/60 text-gray-200 border-gray-500/35',
};

/** Floats on imagery: frosted capsule with subtle tint */
const ON_MEDIA_COLORS: Record<string, string> = {
  'full-body-spinner':
    'bg-red-950/45 text-red-100 border-red-300/35 shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md',
  'vertical-spinner':
    'bg-orange-950/45 text-orange-100 border-orange-300/35 shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md',
  'horizontal-spinner':
    'bg-yellow-950/45 text-yellow-100 border-yellow-300/35 shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md',
  'drum-spinner':
    'bg-amber-950/45 text-amber-100 border-amber-300/35 shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md',
  flipper:
    'bg-blue-950/45 text-blue-100 border-blue-300/35 shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md',
  hammer:
    'bg-purple-950/45 text-purple-100 border-purple-300/35 shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md',
  thwackbot:
    'bg-pink-950/45 text-pink-100 border-pink-300/35 shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md',
  wedge:
    'bg-emerald-950/45 text-emerald-100 border-emerald-300/35 shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md',
  clamper:
    'bg-cyan-950/45 text-cyan-100 border-cyan-300/35 shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md',
  other:
    'bg-black/55 text-gray-100 border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md',
};

export default function WeaponTypeBadge({
  type,
  className,
  variant = 'default',
}: {
  type: string;
  className?: string;
  variant?: 'default' | 'onMedia';
}) {
  const preset = variant === 'onMedia' ? ON_MEDIA_COLORS : COLORS;
  return (
    <span
      className={cn(
        'inline-flex max-w-[min(100%,11rem)] items-center truncate rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] leading-none',
        preset[type] ?? preset.other,
        variant === 'onMedia' && 'ring-1 ring-white/15',
        className,
      )}
    >
      {weaponLabel(type)}
    </span>
  );
}
