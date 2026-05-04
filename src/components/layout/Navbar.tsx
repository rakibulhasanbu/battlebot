'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';

const LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/robots', label: 'Robots' },
  { href: '/predictor', label: '⚡ Predictor' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/community', label: 'Community' },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 bg-arena-card border-b border-arena backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Zap className="w-6 h-6 text-neon-orange group-hover:animate-pulse" fill="currentColor" />
          <span className="font-display text-xl text-white tracking-widest">
            BATTLEBOT <span className="text-neon-orange">ARENA</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-neon-blue bg-white/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <a
          href="https://brdta.com/codemyhobby"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors border border-arena px-3 py-1.5 rounded-full"
        >
          Powered by <span className="text-neon-blue font-semibold">BrightData</span>
        </a>
      </div>
    </nav>
  );
}
