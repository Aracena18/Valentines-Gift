import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LetterReveal } from './LetterReveal';
import { VideoPlayer } from './VideoPlayer';
import { ConfettiOverlay } from './ConfettiOverlay';
import { Button } from '@/components/Button';
import { useHaptic } from '@/hooks/useHaptic';
import { SectionTransition } from '@/components/SectionTransition';

type FinaleStage = 'waiting' | 'letter' | 'video' | 'celebration';

export function Finale() {
  const [stage, setStage] = useState<FinaleStage>('waiting');
  const { hapticSuccess } = useHaptic();

  const handleReady = useCallback(() => {
    hapticSuccess();
    setStage('letter');
  }, [hapticSuccess]);

  const handleLetterComplete = useCallback(() => {
    setStage('video');
  }, []);

  const handleVideoEnd = useCallback(() => {
    hapticSuccess();
    setStage('celebration');
  }, [hapticSuccess]);

  return (
    <SectionTransition id="finale" className="min-h-dvh flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto px-5">
        <AnimatePresence mode="wait">
          {/* Stage 1: Waiting */}
          {stage === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="56" height="56" viewBox="0 0 24 24" fill="var(--color-rose)" className="mx-auto">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </motion.div>

              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-(--color-cream) mb-3">
                  One Last Thing...
                </h2>
                <p className="text-(--color-lavender) text-sm">
                  I wrote something for you. Are you ready?
                </p>
              </div>

              <Button onClick={handleReady} size="lg" className="font-serif">
                I'm Ready ✨
              </Button>
            </motion.div>
          )}

          {/* Stage 2: Letter reveal */}
          {stage === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LetterReveal onComplete={handleLetterComplete} />
            </motion.div>
          )}

          {/* Stage 3: Video */}
          {stage === 'video' && (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <VideoPlayer onEnd={handleVideoEnd} />
            </motion.div>
          )}

          {/* Stage 4: Celebration */}
          {stage === 'celebration' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-center space-y-6"
            >
              <ConfettiOverlay />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                <svg width="72" height="72" viewBox="0 0 24 24" fill="var(--color-rose)" className="mx-auto">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="font-handwriting text-3xl md:text-4xl text-(--color-cream) text-shadow-glow"
              >
                I love you, always
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-(--color-lavender) text-sm max-w-xs mx-auto"
              >
                Every moment with you is a treasure. Here's to many more memories on our map. 💕
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <Button
                  variant="secondary"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Start from the beginning
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionTransition>
  );
}
