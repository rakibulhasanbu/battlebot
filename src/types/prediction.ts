export interface FactorScore {
  category: string;
  robotAScore: number;
  robotBScore: number;
  explanation: string;
}

export interface FanMomentum {
  robotA: 'strong' | 'moderate' | 'weak';
  robotB: 'strong' | 'moderate' | 'weak';
  impact: string;
}

export interface FightPrediction {
  winner: string;
  winnerSlug: string;
  loser: string;
  winProbability: number;
  reasoning: string;
  factors: FactorScore[];
  fanMomentum: FanMomentum;
  dramaticMoment: string;
  confidenceLevel: 'high' | 'medium' | 'low';
}

export interface HypeScore {
  slug: string;
  name: string;
  score: number;
  image_url: string;
  weapon_type: string;
  wins: number;
  losses: number;
}
