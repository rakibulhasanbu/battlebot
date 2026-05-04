export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function winRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function sentimentLabel(score: number): 'positive' | 'neutral' | 'negative' {
  if (score > 0.2) return 'positive';
  if (score < -0.2) return 'negative';
  return 'neutral';
}

export function weaponLabel(type: string): string {
  const labels: Record<string, string> = {
    'full-body-spinner': 'Full-Body Spinner',
    'vertical-spinner': 'Vertical Spinner',
    'horizontal-spinner': 'Horizontal Spinner',
    'drum-spinner': 'Drum Spinner',
    flipper: 'Flipper',
    hammer: 'Hammer',
    thwackbot: 'Thwackbot',
    wedge: 'Wedge',
    clamper: 'Clamper',
    other: 'Other',
  };
  return labels[type] ?? type;
}
