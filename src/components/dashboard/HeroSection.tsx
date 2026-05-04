import Link from 'next/link';
import { Zap, Brain } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative py-20 text-center overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-orange-950/30 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-orange-950/40 border border-orange-800/50 rounded-full px-4 py-1.5 text-sm text-orange-300 mb-6">
          <Zap className="w-3.5 h-3.5" fill="currentColor" />
          Live Data · AI Predictions · #battlebotsdev
        </div>

        <h1 className="font-display text-6xl md:text-8xl text-white leading-none tracking-wider mb-4">
          BATTLEBOT<br />
          <span className="text-neon-orange">ARENA AI</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Real-time robot intelligence scraped from BattleBots.com · Reddit · YouTube.
          AI-powered fight predictions using Google Gemini.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/predictor"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors glow-orange"
          >
            <Brain className="w-5 h-5" />
            AI Fight Predictor
          </Link>
          <Link
            href="/robots"
            className="inline-flex items-center gap-2 border border-neon-blue text-neon-blue hover:bg-blue-950/30 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Robots
          </Link>
        </div>
      </div>
    </div>
  );
}
