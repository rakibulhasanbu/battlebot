'use client';

import { useEffect, useState } from 'react';
import { Bot, Swords, TrendingUp } from 'lucide-react';

interface Stat { icon: React.ReactNode; label: string; value: number; suffix?: string }

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const step = Math.ceil(value / 40);
    const timer = setInterval(() => {
      setCurrent((c) => {
        const next = c + step;
        if (next >= value) { clearInterval(timer); return value; }
        return next;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{current.toLocaleString()}{suffix}</span>;
}

export default function StatsRow({ robotCount }: { robotCount: number }) {
  const stats: Stat[] = [
    { icon: <Bot className="w-5 h-5 text-neon-blue" />, label: 'Robots Tracked', value: robotCount },
    { icon: <Swords className="w-5 h-5 text-neon-orange" />, label: 'Fights Analyzed', value: robotCount * 6 },
    { icon: <TrendingUp className="w-5 h-5 text-neon-green" />, label: 'Hype Score Updates', value: 24, suffix: '/day' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map(({ icon, label, value, suffix }) => (
        <div key={label} className="arena-card p-5 text-center">
          <div className="flex justify-center mb-2">{icon}</div>
          <div className="font-display text-3xl text-white">
            <AnimatedCounter value={value} suffix={suffix} />
          </div>
          <div className="text-xs text-gray-500 mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}
