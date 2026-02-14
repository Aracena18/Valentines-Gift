import { useHaptic } from '@/hooks/useHaptic';
import { useAppStore } from '@/stores/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Easter Eggs system — tracks hidden interactions across the app:
 * 1. Tap-heart counter: Tap the finale celebration heart 7 times for a secret message
 * 2. Long-press on the map title reveals a hidden note
 * 3. Konami-style swipe sequence (up-up-down-down) on entrance unlocks sparkle burst
 */

interface EasterEggState {
  heartTaps: number;
  showSecretMessage: boolean;
  showHiddenNote: boolean;
  showSparkleBurst: boolean;
}

// ── Heart tap counter Easter Egg ──
export function HeartTapEasterEgg() {
  const [state, setState] = useState<EasterEggState>({
    heartTaps: 0,
    showSecretMessage: false,
    showHiddenNote: false,
    showSparkleBurst: false,
  });
  const { hapticPattern, hapticSuccess } = useHaptic();
  const easterEggFound = useAppStore((s) => s.easterEggsFound);
  const addEasterEgg = useAppStore((s) => s.addEasterEgg);

  const handleHeartTap = useCallback(() => {
    setState((prev) => {
      const newTaps = prev.heartTaps + 1;
      if (newTaps >= 7 && !prev.showSecretMessage) {
        hapticPattern([50, 80, 50, 80, 50, 80, 200]);
        hapticSuccess();
        addEasterEgg('heart-tap-7');
        return { ...prev, heartTaps: newTaps, showSecretMessage: true };
      }
      return { ...prev, heartTaps: newTaps };
    });
  }, [hapticPattern, hapticSuccess, addEasterEgg]);

  return (
    <div className="relative">
      <motion.div
        onClick={handleHeartTap}
        className="cursor-pointer"
        whileTap={{ scale: 0.9 }}
        role="button"
        aria-label="Tap the heart"
      >
        <motion.div
          style={{ animation: 'heartbeat 1.5s ease-in-out infinite' }}
        >
          <motion.div
            animate={{
              filter: [
                'drop-shadow(0 0 10px rgba(230,57,70,0.3))',
                'drop-shadow(0 0 30px rgba(230,57,70,0.6))',
                'drop-shadow(0 0 10px rgba(230,57,70,0.3))',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="var(--color-rose)"
              className="mx-auto"
              style={{ filter: 'drop-shadow(0 0 20px rgba(230,57,70,0.5))' }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Tap counter hint */}
      <AnimatePresence>
        {state.heartTaps > 2 && state.heartTaps < 7 && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-(--color-lavender)/30 whitespace-nowrap"
          >
            {7 - state.heartTaps} more taps...
          </motion.p>
        )}
      </AnimatePresence>

      {/* Secret message */}
      <AnimatePresence>
        {state.showSecretMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="absolute top-full mt-4 left-1/2 -translate-x-1/2 glass-card rounded-2xl px-5 py-3 w-64 text-center"
          >
            <p className="font-handwriting text-sm text-(--color-cream)/90">
              🥚 You found a secret! Every tap is a heartbeat — and my heart beats only for you. 💗
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Long-press Easter Egg ──
export function LongPressEasterEgg({
  children,
  message,
  eggId,
}: {
  children: React.ReactNode;
  message: string;
  eggId: string;
}) {
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { hapticSuccess } = useHaptic();
  const addEasterEgg = useAppStore((s) => s.addEasterEgg);

  const handleStart = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setShow(true);
      hapticSuccess();
      addEasterEgg(eggId);
    }, 1500);
  }, [hapticSuccess, addEasterEgg, eggId]);

  const handleEnd = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <div
        onPointerDown={handleStart}
        onPointerUp={handleEnd}
        onPointerLeave={handleEnd}
        className="cursor-pointer select-none"
      >
        {children}
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-20 glass-card rounded-xl px-4 py-2.5 w-56 text-center"
          >
            <p className="font-handwriting text-xs text-(--color-cream)/80">
              🥚 {message}
            </p>
            <button
              onClick={() => setShow(false)}
              className="mt-2 text-[10px] text-(--color-lavender)/40 hover:text-(--color-lavender)/60"
            >
              close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Swipe sequence Easter Egg (for entrance) ──
export function SwipeSequenceDetector({
  onActivate,
}: {
  onActivate: () => void;
}) {
  const sequenceRef = useRef<string[]>([]);
  const target = ['up', 'up', 'down', 'down'];
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const { hapticPattern } = useHaptic();

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!lastTouchRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - lastTouchRef.current.x;
      const dy = touch.clientY - lastTouchRef.current.y;

      // Minimum swipe distance
      if (Math.abs(dy) < 40 && Math.abs(dx) < 40) return;

      let direction: string;
      if (Math.abs(dy) > Math.abs(dx)) {
        direction = dy < 0 ? 'up' : 'down';
      } else {
        direction = dx < 0 ? 'left' : 'right';
      }

      sequenceRef.current.push(direction);
      if (sequenceRef.current.length > target.length) {
        sequenceRef.current.shift();
      }

      if (
        sequenceRef.current.length === target.length &&
        sequenceRef.current.every((d, i) => d === target[i])
      ) {
        hapticPattern([100, 50, 100, 50, 300]);
        onActivate();
        sequenceRef.current = [];
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onActivate, hapticPattern]);

  return null;
}

// ── Sparkle Burst overlay (triggered by easter egg) ──
export function SparkleBurst({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg"
          initial={{
            x: '50%',
            y: '50%',
            opacity: 1,
            scale: 0,
          }}
          animate={{
            x: `${20 + Math.random() * 60}%`,
            y: `${10 + Math.random() * 80}%`,
            opacity: [1, 1, 0],
            scale: [0, 1.2, 0.5],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 1.5 + Math.random(),
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
        >
          {['✨', '💖', '⭐', '🌟', '💫'][i % 5]}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Easter Egg badge counter ──
export function EasterEggBadge() {
  const count = useAppStore((s) => s.easterEggsFound.length);

  if (count === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-4 left-4 z-50 glass-card rounded-full px-3 py-1.5 flex items-center gap-1.5"
      style={{ paddingBottom: 'calc(var(--safe-bottom, 0px) + 6px)' }}
    >
      <span className="text-sm">🥚</span>
      <span className="text-xs text-(--color-cream)/70 font-handwriting">
        {count}/3
      </span>
    </motion.div>
  );
}
