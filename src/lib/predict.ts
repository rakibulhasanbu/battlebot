import { slugify, weaponLabel } from '@/lib/utils/format';
import type { Robot, Fight, WeaponType } from '@/types/robot';
import type { SocialData } from '@/types/social';
import type { FightPrediction, FactorScore, FanMomentum } from '@/types/prediction';

// Advantage of row weapon vs column weapon: -3 (bad) to +3 (strong advantage)
const WEAPON_MATCHUP: Record<WeaponType, Record<WeaponType, number>> = {
  'vertical-spinner': {
    'vertical-spinner':   0,
    'horizontal-spinner': +1,
    'drum-spinner':       +1,
    'full-body-spinner':  +2,
    'flipper':            -1,
    'hammer':             +3,
    'wedge':              +3,
    'clamper':            +2,
    'thwackbot':          +3,
    'other':              +2,
  },
  'horizontal-spinner': {
    'vertical-spinner':   -1,
    'horizontal-spinner':  0,
    'drum-spinner':       +1,
    'full-body-spinner':  +1,
    'flipper':            -1,
    'hammer':             +2,
    'wedge':              +3,
    'clamper':            +2,
    'thwackbot':          +2,
    'other':              +2,
  },
  'drum-spinner': {
    'vertical-spinner':   -1,
    'horizontal-spinner': -1,
    'drum-spinner':        0,
    'full-body-spinner':   0,
    'flipper':            -1,
    'hammer':             +2,
    'wedge':              +2,
    'clamper':            +2,
    'thwackbot':          +2,
    'other':              +2,
  },
  'full-body-spinner': {
    'vertical-spinner':   -2,
    'horizontal-spinner': -1,
    'drum-spinner':        0,
    'full-body-spinner':   0,
    'flipper':            -1,
    'hammer':             +2,
    'wedge':              +1,
    'clamper':            +1,
    'thwackbot':          +2,
    'other':              +1,
  },
  'flipper': {
    'vertical-spinner':   +1,
    'horizontal-spinner': +1,
    'drum-spinner':       +1,
    'full-body-spinner':  +1,
    'flipper':             0,
    'hammer':             +2,
    'wedge':              +1,
    'clamper':            +1,
    'thwackbot':          +2,
    'other':              +1,
  },
  'hammer': {
    'vertical-spinner':   -3,
    'horizontal-spinner': -2,
    'drum-spinner':       -2,
    'full-body-spinner':  -2,
    'flipper':            -2,
    'hammer':              0,
    'wedge':               0,
    'clamper':            -1,
    'thwackbot':          +1,
    'other':               0,
  },
  'wedge': {
    'vertical-spinner':   -3,
    'horizontal-spinner': -3,
    'drum-spinner':       -2,
    'full-body-spinner':  -1,
    'flipper':            -1,
    'hammer':              0,
    'wedge':               0,
    'clamper':            +1,
    'thwackbot':          +1,
    'other':              +1,
  },
  'clamper': {
    'vertical-spinner':   -2,
    'horizontal-spinner': -2,
    'drum-spinner':       -2,
    'full-body-spinner':  -1,
    'flipper':            -1,
    'hammer':             +1,
    'wedge':              -1,
    'clamper':             0,
    'thwackbot':          +1,
    'other':              +1,
  },
  'thwackbot': {
    'vertical-spinner':   -3,
    'horizontal-spinner': -2,
    'drum-spinner':       -2,
    'full-body-spinner':  -2,
    'flipper':            -2,
    'hammer':             -1,
    'wedge':              -1,
    'clamper':            -1,
    'thwackbot':           0,
    'other':               0,
  },
  'other': {
    'vertical-spinner':   -2,
    'horizontal-spinner': -2,
    'drum-spinner':       -2,
    'full-body-spinner':  -1,
    'flipper':            -1,
    'hammer':              0,
    'wedge':              -1,
    'clamper':            -1,
    'thwackbot':           0,
    'other':               0,
  },
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

function socialHypeScore(social: SocialData): number {
  const mentionScore = Math.min(social.redditMentions7d / 20, 1);
  const sentimentScore = (social.avgRedditSentiment + 1) / 2;
  const likeScore = Math.min(social.totalYoutubeLikes / 5000, 1);
  return (mentionScore * 0.4 + sentimentScore * 0.3 + likeScore * 0.3) * 10;
}

function momentumLabel(hype: number): 'strong' | 'moderate' | 'weak' {
  if (hype >= 6.5) return 'strong';
  if (hype >= 3.5) return 'moderate';
  return 'weak';
}

function weaponExplanation(a: Robot, b: Robot, advantage: number): string {
  const wA = weaponLabel(a.weapon_type);
  const wB = weaponLabel(b.weapon_type);
  if (advantage > 1) return `${a.name}'s ${wA} has a clear mechanical edge over ${b.name}'s ${wB}.`;
  if (advantage < -1) return `${b.name}'s ${wB} poses a significant threat to ${a.name}'s ${wA}.`;
  return `${wA} vs ${wB} is a near-even matchup — execution will decide it.`;
}

function recentFormExplanation(a: Robot, b: Robot, last5A: Fight[], last5B: Fight[]): string {
  const wA = last5A.filter((f) => f.result === 'win').length;
  const wB = last5B.filter((f) => f.result === 'win').length;
  const parts: string[] = [];
  if (last5A.length > 0) parts.push(`${a.name} is ${wA}-${last5A.length - wA} in their last ${last5A.length}`);
  if (last5B.length > 0) parts.push(`${b.name} is ${wB}-${last5B.length - wB} in their last ${last5B.length}`);
  return parts.length ? parts.join('; ') + '.' : 'Insufficient recent fight data for both robots.';
}

function experienceExplanation(a: Robot, b: Robot, socialA: SocialData, socialB: SocialData): string {
  const totalA = a.wins + a.losses;
  const totalB = b.wins + b.losses;
  const hypeA = socialHypeScore(socialA).toFixed(1);
  const hypeB = socialHypeScore(socialB).toFixed(1);
  return `${a.name} has ${totalA} career fights (hype ${hypeA}/10). ${b.name} has ${totalB} career fights (hype ${hypeB}/10).`;
}

function buildReasoning(
  a: Robot,
  b: Robot,
  scoreA: number,
  scoreB: number,
  factors: FactorScore[],
  h2h: Fight[],
  winProbA: number,
): string {
  const winner = winProbA >= 50 ? a : b;
  const loser  = winProbA >= 50 ? b : a;
  const prob   = winProbA >= 50 ? winProbA : 100 - winProbA;

  const weaponFactor   = factors.find((f) => f.category === 'Weapon Effectiveness')!;
  const historyFactor  = factors.find((f) => f.category === 'Fight History')!;
  const recentFactor   = factors.find((f) => f.category === 'Recent Form')!;

  const weaponEdge = weaponFactor.robotAScore > weaponFactor.robotBScore
    ? `${a.name}'s ${weaponLabel(a.weapon_type)} holds the mechanical edge`
    : `${b.name}'s ${weaponLabel(b.weapon_type)} holds the mechanical edge`;

  const historyEdge = historyFactor.robotAScore > historyFactor.robotBScore
    ? `${a.name} leads on fight record`
    : `${b.name} leads on fight record`;

  const recentEdge = recentFactor.robotAScore > recentFactor.robotBScore
    ? `${a.name} shows better recent form`
    : `${b.name} shows better recent form`;

  let h2hNote = '';
  if (h2h.length > 0) {
    const h2hWins = h2h.filter((f) => f.result === 'win').length;
    h2hNote = ` Head-to-head: ${a.name} leads ${h2hWins}-${h2h.length - h2hWins} in prior meetings.`;
  }

  return `${winner.name} is favored at ${prob}% probability. ${weaponEdge}. ${historyEdge}. ${recentEdge}.${h2hNote} Combined score: ${a.name} ${round1(scoreA)} vs ${b.name} ${round1(scoreB)}.`;
}

function dramaticMoment(winner: Robot, loser: Robot): string {
  const wType = winner.weapon_type;
  if (wType === 'vertical-spinner' || wType === 'horizontal-spinner' || wType === 'drum-spinner') {
    return `${winner.name}'s spinning weapon finds the gap, hurling ${loser.name} into the arena wall in a shower of sparks.`;
  }
  if (wType === 'flipper') {
    return `${winner.name} charges under ${loser.name} and launches it skyward — the robot lands inverted and can't self-right.`;
  }
  if (wType === 'full-body-spinner') {
    return `${winner.name} reaches full speed and the collision sends ${loser.name} skidding across the arena in pieces.`;
  }
  if (wType === 'hammer' || wType === 'thwackbot') {
    return `${winner.name} lands a devastating blow that cracks ${loser.name}'s chassis, ending the fight in dramatic fashion.`;
  }
  return `${winner.name} dominates the final minute, pushing ${loser.name} into the hazards for the decisive KO.`;
}

export function predictFight(
  robotA: Robot,
  socialA: SocialData,
  robotB: Robot,
  socialB: SocialData,
  fightsA: Fight[],
  fightsB: Fight[],
): FightPrediction {
  const totalA = robotA.wins + robotA.losses;
  const totalB = robotB.wins + robotB.losses;

  // 1. Win Rate Score (0-10)
  const winRateA = totalA > 0 ? (robotA.wins / totalA) * 10 : 5;
  const winRateB = totalB > 0 ? (robotB.wins / totalB) * 10 : 5;

  // 2. Weapon Matchup Score (0-10)
  const advantage = WEAPON_MATCHUP[robotA.weapon_type][robotB.weapon_type];
  const weaponScoreA = clamp(5 + (advantage / 3) * 5, 0, 10);
  const weaponScoreB = 10 - weaponScoreA;

  // 3. Experience Score (0-10)
  const expA = clamp((totalA / 30) * 10, 0, 10);
  const expB = clamp((totalB / 30) * 10, 0, 10);

  // 4. Recent Form — last 5 fights (0-10)
  const last5A = fightsA.slice(-5);
  const last5B = fightsB.slice(-5);
  const recentA = last5A.length > 0 ? (last5A.filter((f) => f.result === 'win').length / last5A.length) * 10 : 5;
  const recentB = last5B.length > 0 ? (last5B.filter((f) => f.result === 'win').length / last5B.length) * 10 : 5;

  // 5. Social Hype Score (0-10)
  const hypeA = socialHypeScore(socialA);
  const hypeB = socialHypeScore(socialB);

  // Weighted totals
  let scoreA = winRateA * 0.35 + weaponScoreA * 0.25 + expA * 0.15 + recentA * 0.15 + hypeA * 0.10;
  let scoreB = winRateB * 0.35 + weaponScoreB * 0.25 + expB * 0.15 + recentB * 0.15 + hypeB * 0.10;

  // Head-to-head bonus
  const h2h = fightsA.filter((f) => f.opponent_name.toLowerCase() === robotB.name.toLowerCase());
  if (h2h.length > 0) {
    const h2hWins = h2h.filter((f) => f.result === 'win').length;
    const h2hLosses = h2h.length - h2hWins;
    scoreA += (h2hWins - h2hLosses) * 0.3;
    scoreB += (h2hLosses - h2hWins) * 0.3;
  }

  // Win probability
  const scoreDiff = scoreA - scoreB; // roughly -10 to +10
  const winProbA = Math.round(clamp(50 + scoreDiff * 4, 10, 90));

  const winner = winProbA >= 50 ? robotA : robotB;
  const loser  = winProbA >= 50 ? robotB : robotA;
  const winProbability = winProbA >= 50 ? winProbA : 100 - winProbA;

  const diff = Math.abs(winProbA - 50);
  const confidenceLevel: 'high' | 'medium' | 'low' =
    diff >= 20 ? 'high' : diff >= 10 ? 'medium' : 'low';

  const factors: FactorScore[] = [
    {
      category:    'Weapon Effectiveness',
      robotAScore: round1(weaponScoreA),
      robotBScore: round1(weaponScoreB),
      explanation: weaponExplanation(robotA, robotB, advantage),
    },
    {
      category:    'Fight History',
      robotAScore: round1(winRateA),
      robotBScore: round1(winRateB),
      explanation: `${robotA.name}: ${robotA.wins}W-${robotA.losses}L (${Math.round(winRateA * 10)}%). ${robotB.name}: ${robotB.wins}W-${robotB.losses}L (${Math.round(winRateB * 10)}%).`,
    },
    {
      category:    'Recent Form',
      robotAScore: round1(recentA),
      robotBScore: round1(recentB),
      explanation: recentFormExplanation(robotA, robotB, last5A, last5B),
    },
    {
      category:    'Experience & Momentum',
      robotAScore: round1((expA + hypeA) / 2),
      robotBScore: round1((expB + hypeB) / 2),
      explanation: experienceExplanation(robotA, robotB, socialA, socialB),
    },
  ];

  const fanMomentum: FanMomentum = {
    robotA: momentumLabel(hypeA),
    robotB: momentumLabel(hypeB),
    impact: `Reddit + YouTube hype: ${robotA.name} scores ${round1(hypeA)}/10, ${robotB.name} scores ${round1(hypeB)}/10.`,
  };

  return {
    winner:          winner.name,
    winnerSlug:      winner.slug,
    loser:           loser.name,
    winProbability,
    reasoning:       buildReasoning(robotA, robotB, scoreA, scoreB, factors, h2h, winProbA),
    factors,
    fanMomentum,
    dramaticMoment:  dramaticMoment(winner, loser),
    confidenceLevel,
  };
}
