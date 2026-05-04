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
      <body className="bg-arena min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
