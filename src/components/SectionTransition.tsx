import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { ReactNode } from 'react';

interface SectionTransitionProps {
  children: ReactNode;
  id: string;
  className?: string;
}

export function SectionTransition({ children, id, className = '' }: SectionTransitionProps) {
  const prefersReduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={id}
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
        whileInView={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={
          prefersReduced
            ? { duration: 0.2 }
            : { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
        }
        className={`relative ${className}`}
      >
        {children}
      </motion.section>
    </AnimatePresence>
  );
}
