'use client';

import Link from 'next/link';
import { Zap, Brain } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  fadeUpStaggerParent,
  fadeUpItem,
  instantReveal,
} from '@/components/motion/motion-variants';

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const parentVar = reduceMotion ? instantReveal : fadeUpStaggerParent;
  const itemVar = reduceMotion ? instantReveal : fadeUpItem;

  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl px-4 py-16 text-center md:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,232,255,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,232,255,0.35) 1px, transparent 1px)`,
          backgroundSize: '52px 52px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,87,34,0.18),transparent_55%)]" />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-2"
        variants={parentVar}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVar}>
          <div className="glass-chip mb-7 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium tracking-wide text-orange-200 shadow-[0_0_24px_rgba(255,87,34,0.15)] ring-1 ring-orange-400/25">
            <Zap className="h-3.5 w-3.5" fill="currentColor" />
            Live Data · AI Predictions · #battlebotsdev
          </div>
        </motion.div>

        <motion.div variants={itemVar}>
          <h1 className="font-display text-6xl leading-none tracking-wider text-white md:text-8xl mb-4">
            BATTLEBOT
            <br />
            <span className="text-neon-orange text-glow-hero-orange">
              ARENA AI
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={itemVar}
          className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 text-glow-muted"
        >
          Real-time robot intelligence scraped from BattleBots.com · Reddit ·
          YouTube. AI-powered fight predictions using Google Gemini.
        </motion.p>

        <motion.div
          variants={itemVar}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/predictor"
            className="cta-glow-orange inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-8 py-3.5 font-semibold text-white glow-orange hover:bg-orange-500"
          >
            <Brain className="h-5 w-5" />
            AI Fight Predictor
          </Link>
          <Link
            href="/robots"
            className="cta-outline-blue inline-flex items-center justify-center gap-2 rounded-xl border border-neon-blue/80 bg-transparent px-8 py-3.5 font-semibold text-neon-blue hover:bg-cyan-400/10"
          >
            View All Robots
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
