import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export const metadata: Metadata = {
  title: 'BattleBot Arena AI — Fight Predictions & Robot Intel',
  description:
    'AI-powered BattleBots fight predictions, robot statistics, and real-time fan sentiment. Powered by BrightData and Google Gemini.',
  openGraph: {
    title: 'BattleBot Arena AI',
    description: 'AI-powered fight predictions for BattleBots — real data, real drama.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} dark`}>
      <body className="relative bg-arena min-h-screen flex flex-col antialiased">
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden" aria-hidden>
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,232,255,0.25) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,232,255,0.22) 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
            }}
          />
          <div className="absolute top-[-18%] left-[-12%] w-[min(55vw,560px)] h-[min(55vw,560px)] rounded-full bg-orange-600/22 blur-[100px] ambient-orb-1" />
          <div className="absolute bottom-[-22%] right-[-8%] w-[min(50vw,520px)] h-[min(50vw,520px)] rounded-full bg-[var(--neon-blue)]/18 blur-[110px] ambient-orb-2" />
        </div>
        <Navbar />
        <main className="relative z-0 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
