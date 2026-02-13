import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  total: number;
  current: number;
}

export function ProgressIndicator({ total, current }: ProgressIndicatorProps) {
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2"
      style={{ paddingTop: 'var(--safe-top, 0px)' }}
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Section ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          animate={{
            width: i === current ? 24 : 8,
            height: 8,
            backgroundColor: i === current ? 'var(--color-rose)' : i < current ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      ))}
    </div>
  );
}
