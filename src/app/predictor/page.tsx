'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Robot } from '@/types/robot';
import type { FightPrediction } from '@/types/prediction';
import RobotSelector from '@/components/predictor/RobotSelector';
import PredictionResult from '@/components/predictor/PredictionResult';
import {
  fadeUpItem,
  fadeUpStaggerParent,
  instantReveal,
} from '@/components/motion/motion-variants';
import { Cpu, Swords, Loader2 } from 'lucide-react';

export default function PredictorPage() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [robotA, setRobotA] = useState<Robot | null>(null);
  const [robotB, setRobotB] = useState<Robot | null>(null);
  const [prediction, setPrediction] = useState<FightPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reduceMotion = useReducedMotion();
  const headerParent = reduceMotion ? instantReveal : fadeUpStaggerParent;
  const headerItem = reduceMotion ? instantReveal : fadeUpItem;

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
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <motion.div
        className="space-y-2 text-center"
        variants={headerParent}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={headerItem} className="inline-block">
          <div className="glass-chip mb-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold tracking-[0.2em] text-neon-purple ring-1 ring-purple-400/25">
            <Cpu className="h-3.5 w-3.5" />
            ALGORITHM-POWERED PREDICTOR
          </div>
        </motion.div>
        <motion.h1 variants={headerItem} className="font-display text-5xl tracking-wider text-white text-glow-muted">
          FIGHT{' '}
          <span className="text-neon-orange text-glow-hero-orange">PREDICTOR</span>
        </motion.h1>
        <motion.p variants={headerItem} className="text-gray-500">
          Select two robots · Analyzes weapon matchups, fight records & fan sentiment
        </motion.p>
      </motion.div>

      <div className="glass-panel p-6">
        <div className="flex flex-col items-stretch gap-4 md:flex-row">
          <RobotSelector
            label="ROBOT A"
            robots={robots}
            selected={robotA}
            onSelect={(r) => {
              setRobotA(r);
              setPrediction(null);
            }}
            accentColor="orange"
            disabled={loading}
          />

          <div className="flex shrink-0 items-center justify-center">
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              animate={
                reduceMotion ? undefined : { boxShadow: ['0 0 0 0 transparent', '0 0 18px rgba(0,232,255,0.35)', '0 0 0 0 transparent'] }
              }
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
            >
              <Swords className="h-6 w-6 text-neon-blue drop-shadow-[0_0_8px_rgba(0,232,255,0.4)]" />
            </motion.div>
          </div>

          <RobotSelector
            label="ROBOT B"
            robots={robots}
            selected={robotB}
            onSelect={(r) => {
              setRobotB(r);
              setPrediction(null);
            }}
            accentColor="blue"
            disabled={loading}
          />
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handlePredict}
            disabled={!canPredict}
            className="cta-glow-orange glow-orange flex w-full items-center justify-center gap-3 rounded-xl bg-orange-600 py-4 text-lg font-bold text-white transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing matchup…
              </>
            ) : (
              <>
                <Cpu className="h-5 w-5" />
                PREDICT THE WINNER
              </>
            )}
          </button>

          {error && (
            <p className="mt-3 text-center text-sm text-neon-red">{error}</p>
          )}

          {!robotA || !robotB ? (
            <p className="mt-3 text-center text-xs text-gray-600">
              Select both robots to enable prediction
            </p>
          ) : null}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {prediction && robotA && robotB && (
          <motion.div
            key={`${robotA.slug}-${robotB.slug}-${prediction.winnerSlug}`}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <PredictionResult prediction={prediction} robotA={robotA} robotB={robotB} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
