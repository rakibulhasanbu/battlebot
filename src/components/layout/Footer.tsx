import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-glass mt-auto border-t border-arena backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-500 md:flex-row">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 fill-current text-neon-orange drop-shadow-[0_0_8px_rgba(255,87,34,0.4)]" />
          <span className="font-display text-base tracking-widest text-white">
            BATTLEBOT <span className="text-neon-orange">ARENA AI</span>
          </span>
        </div>
        <p className="text-center md:text-left">
          Data scraped via{' '}
          <a
            href="https://brdta.com/codemyhobby"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-neon-blue hover:text-cyan-200 hover:underline"
          >
            BrightData
          </a>{' '}
          · Predictions by Google Gemini
        </p>
        <div className="flex gap-6">
          <Link href="/robots" className="transition-colors hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,232,255,0.25)]">
            Robots
          </Link>
          <Link href="/predictor" className="transition-colors hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,87,34,0.25)]">
            Predictor
          </Link>
          <Link href="/community" className="transition-colors hover:text-white hover:drop-shadow-[0_0_8px_rgba(147,107,247,0.25)]">
            Community
          </Link>
        </div>
      </div>
    </footer>
  );
}
