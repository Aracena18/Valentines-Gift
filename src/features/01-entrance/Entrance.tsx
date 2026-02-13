import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SecretInput } from './SecretInput';
import { PaperUnfold } from './PaperUnfold';
import { FloatingHearts } from '@/components/FloatingHearts';
import { useAppStore } from '@/stores/useAppStore';
import { useHaptic } from '@/hooks/useHaptic';
import { unlockAudio } from '@/hooks/useAudio';

export function Entrance() {
  const [isUnfolding, setIsUnfolding] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const unlock = useAppStore((s) => s.unlock);
  const setInteracted = useAppStore((s) => s.setInteracted);
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

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-(--color-midnight)">
      {/* Ambient hearts */}
      <FloatingHearts />

      {/* Starfield background */}
      <div className="absolute inset-0" aria-hidden="true">
        <StarfieldCanvas />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {showInput && !isUnfolding && (
          <SecretInput key="input" onSuccess={handleCorrectPassword} />
        )}
      </AnimatePresence>

      {isUnfolding && (
        <PaperUnfold onComplete={handleUnfoldComplete} />
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
