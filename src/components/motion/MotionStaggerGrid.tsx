'use client';

import { Children, isValidElement, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  fadeUpGridParent,
  fadeUpGridItem,
  instantReveal,
} from '@/components/motion/motion-variants';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function MotionStaggerGrid({ children, className }: Props) {
  const reduceMotion = useReducedMotion();
  const parent = reduceMotion ? instantReveal : fadeUpGridParent;
  const itemVar = reduceMotion ? instantReveal : fadeUpGridItem;

  const items = Children.toArray(children);

  return (
    <motion.div
      className={className}
      variants={parent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-32px 0px' }}
    >
      {items.map((child, index) =>
        isValidElement(child)
          ? (
              <motion.div
                key={child.key ?? `stagger-${String(index)}`}
                variants={itemVar}
                className="h-full min-h-0"
              >
                {child}
              </motion.div>
            )
          : child,
      )}
    </motion.div>
  );
}
