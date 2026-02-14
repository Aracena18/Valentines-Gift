import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  total: number;
  current: number;
}

export function ProgressIndicator({ total, current }: ProgressIndicatorProps) {
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3"
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
          className="relative flex items-center justify-center"
          animate={{
            scale: i === current ? 1.1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {i === current ? (
            /* Active section — small heart */
            <motion.svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="var(--color-rose)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              style={{ filter: 'drop-shadow(0 0 6px rgba(230,57,70,0.5))' }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </motion.svg>
          ) : (
            /* Inactive — small dot */
            <motion.div
              className="rounded-full"
              animate={{
                width: 8,
                height: 8,
                backgroundColor: i < current ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
