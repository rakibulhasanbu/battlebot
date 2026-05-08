'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  fadeUpGridItem,
  fadeUpStaggerParentFast,
  instantReveal,
} from '@/components/motion/motion-variants';
import { Bot, Swords, TrendingUp } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
}

function AnimatedCounter ({
  value,
  suffix = '',
}: {
  value: number;
  suffix?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [ current, setCurrent ] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setCurrent(value);
      return;
    }
    const step = Math.ceil(value / 40);
    const timer = setInterval(() => {
      setCurrent((c) => {
        const next = c + step;
        if (next >= value) {
          clearInterval(timer);
          return value;
        }
        return next;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [ value, reduceMotion ]);

  return (
    <span>
      { current.toLocaleString() }
      { suffix }
    </span>
  );
}

export default function StatsRow ({ robotCount }: { robotCount: number }) {
  const reduceMotion = useReducedMotion();
  const parentVar = reduceMotion ? instantReveal : fadeUpStaggerParentFast;
  const itemVar = reduceMotion ? instantReveal : fadeUpGridItem;

  const stats: Stat[] = [
    {
      icon: (
        <Bot className="h-5 w-5 text-neon-blue drop-shadow-[0_0_8px_rgba(0,232,255,0.35)]" />
      ),
      label: 'Robots Tracked',
      value: robotCount,
    },
    {
      icon: (
        <Swords className="h-5 w-5 text-neon-orange drop-shadow-[0_0_8px_rgba(255,87,34,0.35)]" />
      ),
      label: 'Fights Analyzed',
      value: robotCount * 6,
    },
    {
      icon: (
        <TrendingUp className="h-5 w-5 text-neon-green drop-shadow-[0_0_8px_rgba(0,255,136,0.3)]" />
      ),
      label: 'Hype Score Updates',
      value: 24,
      suffix: '/day',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-3 gap-4"
      variants={ parentVar }
      initial="hidden"
      animate="visible"
    >
      { stats.map(({ icon, label, value, suffix }) => (
        <motion.div key={ label } variants={ itemVar } className="stat-glass p-5 text-center">
          <div className="mb-3 flex justify-center">{ icon }</div>
          <div className="font-display text-2xl sm:text-3xl text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.06)]">
            <AnimatedCounter value={ value } suffix={ suffix } />
          </div>
          <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">{ label }</div>
        </motion.div>
      )) }
    </motion.div>
  );
}
