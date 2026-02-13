import { lazy, Suspense, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';
import { Entrance } from '@/features/01-entrance/Entrance';
import { AudioToggle } from '@/components/AudioToggle';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { FloatingHearts } from '@/components/FloatingHearts';

// Lazy-load heavy sections for code splitting
const DreamMap = lazy(() =>
  import('@/features/02-map/DreamMap').then((m) => ({ default: m.DreamMap }))
);
const Memories = lazy(() =>
  import('@/features/03-memories/Memories').then((m) => ({ default: m.Memories }))
);
const Finale = lazy(() =>
  import('@/features/04-finale/Finale').then((m) => ({ default: m.Finale }))
);

const TOTAL_SECTIONS = 3; // Map, Memories (implicit), Finale

function LoadingFallback() {
  return (
    <div className="min-h-[50dvh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div
          className="w-8 h-8 mx-auto rounded-full border-2 border-(--color-rose) border-t-transparent animate-spin"
        />
        <p className="text-(--color-lavender) text-sm font-handwriting">
          Loading memories...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const isUnlocked = useAppStore((s) => s.isUnlocked);
  const currentSection = useAppStore((s) => s.currentSection);
  const [activeMemoryId, setActiveMemoryId] = useState<string | null>(null);

  const handlePinClick = useCallback((memoryId: string) => {
    setActiveMemoryId(memoryId);
  }, []);

  const handleCloseMemory = useCallback(() => {
    setActiveMemoryId(null);
  }, []);

  return (
    <div className="relative min-h-dvh">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <Entrance key="entrance" />
        ) : (
          <main key="main" className="relative">
            {/* Ambient background */}
            <FloatingHearts />

            {/* Progress indicator */}
            <ProgressIndicator total={TOTAL_SECTIONS} current={currentSection} />

            {/* Audio toggle */}
            <AudioToggle />

            {/* ─── Section 1: Dream Map ─── */}
            <Suspense fallback={<LoadingFallback />}>
              <DreamMap onPinClick={handlePinClick} />
            </Suspense>

            {/* ─── Memory Bottom Sheet (overlays on map) ─── */}
            <Suspense fallback={null}>
              <Memories activeMemoryId={activeMemoryId} onClose={handleCloseMemory} />
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
