'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Zap } from 'lucide-react';

const LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/robots', label: 'Robots' },
  { href: '/predictor', label: '⚡ Predictor' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/community', label: 'Community' },
];

export default function Navbar () {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2">
          <motion.span
            animate={
              reduceMotion
                ? undefined
                : { filter: [ 'brightness(1)', 'brightness(1.25)', 'brightness(1)' ] }
            }
            transition={ { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } }
          >
            <Zap className="h-6 w-6 fill-current text-neon-orange drop-shadow-[0_0_10px_rgba(255,87,34,0.55)]" />
          </motion.span>
          <span className="font-display text-xl tracking-widest text-white drop-shadow-[0_0_12px_rgba(0,232,255,0.08)]">
            BATTLEBOT <span className="text-neon-orange">ARENA</span>
          </span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-0.5">
          { LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={ href }
                href={ href }
                className={ `relative rounded-md px-4 py-2 text-sm font-medium transition-colors ${ active
                  ? ' text-neon-blue drop-shadow-[0_0_8px_rgba(0,232,255,0.25)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }` }
              >
                { label }
                { active && (
                  <span className="absolute inset-x-3 bottom-1.5 z-0 h-0.5 rounded-full bg-linear-to-r from-neon-orange to-neon-blue shadow-[0_0_12px_rgba(0,232,255,0.35)]" />
                ) }
              </Link>
            );
          }) }
        </div>

        <a
          href="https://brdta.com/codemyhobby"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-chip hover:border-neon-blue/35 hidden rounded-full px-3 py-1.5 text-xs text-gray-400 transition-colors hover:text-gray-300 md:flex md:items-center md:gap-1.5"
        >
          Powered by{ ' ' }
          <span className="font-semibold text-neon-blue">BrightData</span>
        </a>
      </div>
    </nav>
  );
}
