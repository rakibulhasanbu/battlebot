import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-arena mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-neon-orange" fill="currentColor" />
          <span className="font-display text-base text-white tracking-widest">
            BATTLEBOT <span className="text-neon-orange">ARENA AI</span>
          </span>
        </div>
        <p>
          Data scraped via{' '}
          <a
            href="https://brdta.com/codemyhobby"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-blue hover:underline"
          >
            BrightData
          </a>{' '}
          · Predictions by Google Gemini
        </p>
        <div className="flex gap-4">
          <Link href="/robots" className="hover:text-white transition-colors">Robots</Link>
          <Link href="/predictor" className="hover:text-white transition-colors">Predictor</Link>
          <Link href="/community" className="hover:text-white transition-colors">Community</Link>
        </div>
      </div>
    </footer>
  );
}
