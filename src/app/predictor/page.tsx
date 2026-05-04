'use client';

import { useState, useEffect } from 'react';
import type { Robot } from '@/types/robot';
import type { FightPrediction } from '@/types/prediction';
import RobotSelector from '@/components/predictor/RobotSelector';
import PredictionResult from '@/components/predictor/PredictionResult';
import { Brain, Swords, Loader2 } from 'lucide-react';

export default function PredictorPage() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [robotA, setRobotA] = useState<Robot | null>(null);
  const [robotB, setRobotB] = useState<Robot | null>(null);
  const [prediction, setPrediction] = useState<FightPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/robots').then((r) => r.json()).then(setRobots);

    const params = new URLSearchParams(window.location.search);
    const aSlug = params.get('a');
    if (aSlug) {
      fetch(`/api/robots/${aSlug}`).then((r) => r.json()).then(setRobotA);
    }
  }, []);

  async function handlePredict() {
    if (!robotA || !robotB) return;
    if (robotA.slug === robotB.slug) {
      setError('Select two different robots');
      return;
    }
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ robotASlug: robotA.slug, robotBSlug: robotB.slug }),
      });
      if (!res.ok) throw new Error(await res.text());
      setPrediction(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Prediction failed');
    } finally {
      setLoading(false);
    }
  }

  const canPredict = robotA && robotB && robotA.slug !== robotB.slug && !loading;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-neon-purple bg-purple-950/30 border border-purple-800/50 px-4 py-1.5 rounded-full">
          <Brain className="w-3.5 h-3.5" />
          POWERED BY GOOGLE GEMINI 2.0 FLASH
        </div>
        <h1 className="font-display text-5xl text-white tracking-wider">
          AI FIGHT <span className="text-neon-orange">PREDICTOR</span>
        </h1>
        <p className="text-gray-500">Select two robots · AI analyzes stats, records & fan sentiment</p>
      </div>

      {/* Robot selectors */}
      <div className="arena-card p-6">
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          <RobotSelector
            label="ROBOT A"
            robots={robots}
            selected={robotA}
            onSelect={(r) => { setRobotA(r); setPrediction(null); }}
            accentColor="orange"
            disabled={loading}
          />

          <div className="flex items-center justify-center shrink-0">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 border border-arena">
              <Swords className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <RobotSelector
            label="ROBOT B"
            robots={robots}
            selected={robotB}
            onSelect={(r) => { setRobotB(r); setPrediction(null); }}
            accentColor="blue"
            disabled={loading}
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handlePredict}
            disabled={!canPredict}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors glow-orange flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gemini is analyzing…
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                PREDICT THE WINNER
              </>
            )}
          </button>

          {error && (
            <p className="mt-3 text-center text-neon-red text-sm">{error}</p>
          )}

          {!robotA || !robotB ? (
            <p className="mt-3 text-center text-gray-600 text-xs">
              Select both robots to enable prediction
            </p>
          ) : null}
        </div>
      </div>

      {/* Result */}
      {prediction && robotA && robotB && (
        <PredictionResult prediction={prediction} robotA={robotA} robotB={robotB} />
      )}
    </div>
  );
}
