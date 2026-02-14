import { AudioToggle } from '@/components/AudioToggle';
import { BackgroundMusic } from '@/components/BackgroundMusic';
import { FloatingHearts } from '@/components/FloatingHearts';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { Entrance } from '@/features/01-entrance/Entrance';
import { EasterEggBadge } from '@/features/easter-eggs/EasterEggs';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useAppStore } from '@/stores/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useCallback, useState } from 'react';

// Lazy-load heavy sections for code splitting
const DreamMap = lazy(() =>
  import('@/features/02-map/DreamMap').then((m) => ({ default: m.DreamMap }))
);
const Memories = lazy(() =>
  import('@/features/03-memories/Memories').then((m) => ({ default: m.Memories }))
);
const PhotoGallery = lazy(() =>
  import('@/features/03-memories/PhotoGallery').then((m) => ({ default: m.PhotoGallery }))
);
const Finale = lazy(() =>
  import('@/features/04-finale/Finale').then((m) => ({ default: m.Finale }))
);

const TOTAL_SECTIONS = 3; // Map, Memories (implicit), Finale

function LoadingFallback() {
  return (
    <div className="min-h-[50dvh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <motion.div
          animate={{
            scale: [1, 1.15, 1, 1.1, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--color-rose)" className="mx-auto" style={{ filter: 'drop-shadow(0 0 8px rgba(230,57,70,0.4))' }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.div>
        <p className="text-(--color-lavender) font-handwriting text-lg">
          Gathering our memories...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const isUnlocked = useAppStore((s) => s.isUnlocked);
  const currentSection = useAppStore((s) => s.currentSection);
  const hasInteracted = useAppStore((s) => s.hasInteracted);
  const setInteracted = useAppStore((s) => s.setInteracted);
  const [activeMemoryId, setActiveMemoryId] = useState<string | null>(null);

  // Lenis smooth scrolling
  useSmoothScroll();

  const handlePinClick = useCallback((memoryId: string) => {
    setActiveMemoryId(memoryId);
  }, []);

  const handleCloseMemory = useCallback(() => {
    setActiveMemoryId(null);
  }, []);

  // Ensure interaction is registered on first click/tap (for background music)
  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted) {
      setInteracted();
    }
  }, [hasInteracted, setInteracted]);

  return (
    <div className="relative min-h-dvh">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <Entrance key="entrance" />
        ) : (
          <main key="main" className="relative" onClick={handleFirstInteraction}>
            {/* Aurora ambient background */}
            <div className="aurora-bg" aria-hidden="true" />

            {/* Ambient hearts + sparkles */}
            <FloatingHearts />

            {/* Progress indicator */}
            <ProgressIndicator total={TOTAL_SECTIONS} current={currentSection} />

            {/* Audio toggle */}
            <AudioToggle />

            {/* Background music */}
            <BackgroundMusic />

            {/* Easter egg badge */}
            <EasterEggBadge />

            {/* ─── Section 1: Dream Map ─── */}
            <Suspense fallback={<LoadingFallback />}>
              <DreamMap onPinClick={handlePinClick} />
            </Suspense>

            {/* ─── Memory Bottom Sheet (overlays on map) ─── */}
            <Suspense fallback={null}>
              <Memories activeMemoryId={activeMemoryId} onClose={handleCloseMemory} />
            </Suspense>

            {/* ─── Section 1.5: Swipeable Photo Gallery ─── */}
            <Suspense fallback={<LoadingFallback />}>
              <PhotoGallery />
            </Suspense>

            {/* ─── Section 2: Cinematic Finale ─── */}
            <Suspense fallback={<LoadingFallback />}>
              <Finale />
            </Suspense>
          </main>
        )}
      </AnimatePresence>
    </div>
  );
}
