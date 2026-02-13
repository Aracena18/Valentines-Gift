import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { motion } from 'framer-motion';

interface PaperUnfoldProps {
  onComplete: () => void;
}

export function PaperUnfold({ onComplete }: PaperUnfoldProps) {
  const prefersReduced = useReducedMotion();
  const { tier } = useDeviceCapability();

  // Reduced or low-power: simple fade
  if (prefersReduced || tier === 'low') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={onComplete}
        className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-midnight)"
      >
        <div className="text-center px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-handwriting text-3xl text-(--color-cream) mb-4"
          >
            Welcome, my love
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-(--color-lavender) text-sm"
          >
            Let me take you on a journey...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      {/* Background fade to warm */}
      <motion.div
        className="absolute inset-0"
        initial={{ backgroundColor: 'var(--color-midnight)' }}
        animate={{ backgroundColor: '#1a1520' }}
        transition={{ duration: 2 }}
      />

      {/* Paper layers unfolding */}
      <div className="relative w-72 h-96 md:w-80 md:h-112">
        {/* Back panel (appears first) */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-linear-to-b from-[#2a1f35] to-[#1a1520] border border-white/5 shadow-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Top flap */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl origin-top"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: -180 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.645, 0.045, 0.355, 1] }}
        >
          {/* Front face */}
          <div
            className="absolute inset-0 rounded-t-2xl bg-linear-to-b from-[#3d2c4a] to-[#2a1f35] border border-white/10 flex items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Wax seal circle */}
            <motion.div
              className="w-16 h-16 rounded-full bg-(--color-rose) flex items-center justify-center shadow-lg"
              style={{
                boxShadow: '0 0 30px rgba(230,57,70,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
              }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(230,57,70,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
                  '0 0 40px rgba(230,57,70,0.6), inset 0 2px 4px rgba(255,255,255,0.2)',
                  '0 0 20px rgba(230,57,70,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </motion.div>
          </div>
          {/* Back face */}
          <div
            className="absolute inset-0 rounded-t-2xl bg-linear-to-b from-[#2a1f35] to-[#1a1520]"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
          />
        </motion.div>

        {/* Content that reveals */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          onAnimationComplete={() => {
            setTimeout(onComplete, 1500);
          }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.8, type: 'spring', stiffness: 200, damping: 15 }}
              className="mb-6"
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--color-rose)" className="mx-auto">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="font-handwriting text-2xl md:text-3xl text-(--color-cream) mb-3"
            >
              Welcome, my love
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="text-(--color-lavender) text-sm"
            >
              Let me take you on a journey...
            </motion.p>

            {/* Scroll down indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 6, 0] }}
              transition={{
                opacity: { delay: 3, duration: 0.5 },
                y: { delay: 3, duration: 1.5, repeat: Infinity },
              }}
              className="mt-8"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" className="mx-auto opacity-60">
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
