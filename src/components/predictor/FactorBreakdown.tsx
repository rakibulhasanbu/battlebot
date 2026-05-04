import type { FactorScore } from '@/types/prediction';
import type { Robot } from '@/types/robot';

interface Props {
  factors: FactorScore[];
  robotA: Robot;
  robotB: Robot;
}

export default function FactorBreakdown({ factors, robotA, robotB }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold tracking-widest text-gray-500">FACTOR BREAKDOWN</h3>
      {factors.map((f) => (
        <div key={f.category} className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300 font-medium">{f.category}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{robotA.name}</span>
                <span className="text-neon-orange font-bold">{f.robotAScore}/10</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                  style={{ width: `${f.robotAScore * 10}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{robotB.name}</span>
                <span className="text-neon-blue font-bold">{f.robotBScore}/10</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                  style={{ width: `${f.robotBScore * 10}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600">{f.explanation}</p>
        </div>
      ))}
    </div>
  );
}
