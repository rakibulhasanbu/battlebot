import type { FightPrediction } from '@/types/prediction';
import type { Robot } from '@/types/robot';
import WinProbabilityBar from './WinProbabilityBar';
import FactorBreakdown from './FactorBreakdown';
import { Trophy, Zap, TrendingUp } from 'lucide-react';

interface Props {
  prediction: FightPrediction;
  robotA: Robot;
  robotB: Robot;
}

const CONFIDENCE_COLORS: Record<string, string> = {
  high:   'text-neon-green border-green-700/50 bg-green-950/30',
  medium: 'text-yellow-400 border-yellow-700/50 bg-yellow-950/30',
  low:    'text-orange-400 border-orange-700/50 bg-orange-950/30',
};

const MOMENTUM_COLORS: Record<string, string> = {
  strong:   'text-neon-green',
  moderate: 'text-yellow-400',
  weak:     'text-gray-500',
};

export default function PredictionResult({ prediction, robotA, robotB }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Winner banner */}
      <div className="arena-card border-neon-orange glow-orange p-6 text-center">
        <div className="text-xs text-gray-500 font-bold tracking-widest mb-2">AI PREDICTS</div>
        <div className="flex items-center justify-center gap-3 mb-1">
          <Trophy className="w-6 h-6 text-neon-orange" fill="currentColor" />
          <span className="font-display text-4xl text-neon-orange tracking-wider">{prediction.winner}</span>
        </div>
        <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${CONFIDENCE_COLORS[prediction.confidenceLevel]}`}>
          {prediction.confidenceLevel.toUpperCase()} CONFIDENCE
        </div>
      </div>

      {/* Dramatic moment */}
      <div className="arena-card border-purple-800/50 bg-purple-950/20 p-4">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-neon-purple mt-0.5 shrink-0" fill="currentColor" />
          <div>
            <div className="text-xs text-purple-400 font-bold tracking-widest mb-1">THE MOMENT</div>
            <p className="text-white italic">&ldquo;{prediction.dramaticMoment}&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Probability bar */}
      <div className="arena-card p-5">
        <WinProbabilityBar
          robotA={robotA}
          robotB={robotB}
          winnerSlug={prediction.winnerSlug}
          winProbability={prediction.winProbability}
        />
      </div>

      {/* Reasoning */}
      <div className="arena-card p-5">
        <h3 className="text-xs font-bold tracking-widest text-gray-500 mb-2">ANALYSIS</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{prediction.reasoning}</p>
      </div>

      {/* Factor breakdown */}
      <div className="arena-card p-5">
        <FactorBreakdown factors={prediction.factors} robotA={robotA} robotB={robotB} />
      </div>

      {/* Fan momentum */}
      <div className="arena-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-neon-blue" />
          <h3 className="text-xs font-bold tracking-widest text-gray-500">FAN MOMENTUM</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">{robotA.name}</span>
            <div className={`font-bold ${MOMENTUM_COLORS[prediction.fanMomentum.robotA]}`}>
              {prediction.fanMomentum.robotA.toUpperCase()}
            </div>
          </div>
          <div>
            <span className="text-gray-500">{robotB.name}</span>
            <div className={`font-bold ${MOMENTUM_COLORS[prediction.fanMomentum.robotB]}`}>
              {prediction.fanMomentum.robotB.toUpperCase()}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600">{prediction.fanMomentum.impact}</p>
      </div>
    </div>
  );
}
