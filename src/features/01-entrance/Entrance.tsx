import { FloatingHearts } from '@/components/FloatingHearts';
import { SparkleBurst, SwipeSequenceDetector } from '@/features/easter-eggs/EasterEggs';
import { unlockAudio } from '@/hooks/useAudio';
import { useHaptic } from '@/hooks/useHaptic';
import { useAppStore } from '@/stores/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { PaperUnfold } from './PaperUnfold';
import { SecretInput } from './SecretInput';

export function Entrance() {
  const [isUnfolding, setIsUnfolding] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [sparkleBurst, setSparkleBurst] = useState(false);
  const unlock = useAppStore((s) => s.unlock);
  const setInteracted = useAppStore((s) => s.setInteracted);
  const addEasterEgg = useAppStore((s) => s.addEasterEgg);
  const { hapticSuccess } = useHaptic();

  const handleCorrectPassword = useCallback(() => {
    hapticSuccess();
    unlockAudio();
    setInteracted();
    setShowInput(false);
    // Brief delay before unfolding starts
    setTimeout(() => setIsUnfolding(true), 300);
  }, [hapticSuccess, setInteracted]);

  const handleUnfoldComplete = useCallback(() => {
    unlock();
  }, [unlock]);

  const handleSwipeEasterEgg = useCallback(() => {
    setSparkleBurst(true);
    addEasterEgg('swipe-sequence');
    setTimeout(() => setSparkleBurst(false), 3000);
  }, [addEasterEgg]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-(--color-midnight)">
      {/* Ambient hearts */}
      <FloatingHearts />

      {/* Swipe sequence easter egg detector */}
      <SwipeSequenceDetector onActivate={handleSwipeEasterEgg} />
      <AnimatePresence>
        {sparkleBurst && <SparkleBurst active />}
      </AnimatePresence>

      {/* Aurora romantic glow */}
      <div className="aurora-bg" aria-hidden="true" />

      {/* Starfield background */}
      <div className="absolute inset-0" aria-hidden="true">
        <StarfieldCanvas />
      </div>

      {/* Vignette overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(15,15,26,0.6) 100%)',
        }}
      />

      {/* Content */}
      <AnimatePresence mode="wait">
        {showInput && !isUnfolding && (
          <SecretInput key="input" onSuccess={handleCorrectPassword} />
        )}
      </AnimatePresence>

      {isUnfolding && (
        <PaperUnfold onComplete={handleUnfoldComplete} />
      )}

      {/* Romantic bottom decorative element */}
      {showInput && !isUnfolding && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          aria-hidden="true"
          style={{
            background: 'linear-gradient(to top, rgba(230,57,70,0.06), transparent)',
          }}
        />
      )}
    </div>
  );
}

// Simple starfield using CSS radial gradients — no canvas needed for this
function StarfieldCanvas() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Static stars using box-shadow trick */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.8) 50%, transparent 100%),
            radial-gradient(1px 1px at 30% 65%, rgba(255,255,255,0.6) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 50% 10%, rgba(255,255,255,0.9) 50%, transparent 100%),
            radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,0.5) 50%, transparent 100%),
            radial-gradient(1px 1px at 85% 75%, rgba(255,255,255,0.7) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 20% 85%, rgba(255,255,255,0.6) 50%, transparent 100%),
            radial-gradient(1px 1px at 60% 90%, rgba(255,255,255,0.5) 50%, transparent 100%),
            radial-gradient(1px 1px at 40% 50%, rgba(255,255,255,0.7) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 90% 15%, rgba(255,255,255,0.8) 50%, transparent 100%),
            radial-gradient(1px 1px at 15% 45%, rgba(255,255,255,0.4) 50%, transparent 100%),
            radial-gradient(1px 1px at 75% 55%, rgba(255,255,255,0.6) 50%, transparent 100%),
            radial-gradient(1px 1px at 45% 30%, rgba(255,255,255,0.5) 50%, transparent 100%)
          `,
        }}
      />
      {/* Twinkling animated stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${10 + (i * 11) % 85}%`,
              top: `${5 + (i * 17) % 90}%`,
              animation: `twinkle ${2 + i * 0.7}s ${i * 0.5}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Soft nebula gradient */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(230,57,70,0.15), transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(184,169,201,0.12), transparent 50%)',
        }}
      />
    </div>
  );
}
