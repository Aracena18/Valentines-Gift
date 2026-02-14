import { useAudio } from '@/hooks/useAudio';
import { useAppStore } from '@/stores/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function BackgroundMusic() {
  const hasInteracted = useAppStore((s) => s.hasInteracted);
  const isPlaying = useRef(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const { fadeIn, fadeOut } = useAudio({
    src: '/audio/ambient.mp3',
    loop: true,
    volume: 0.3,
    preload: false, // Stream instead of preloading for faster start
  });

  useEffect(() => {
    if (hasInteracted && !isPlaying.current) {
      isPlaying.current = true;
      
      // Start immediately, no delay
      try {
        fadeIn(1500); // Faster fade-in
        // Hide prompt if music starts successfully
        setTimeout(() => setShowPrompt(false), 2000);
      } catch (error) {
        console.warn('Audio playback failed:', error);
        // Show prompt to manually start music
        setShowPrompt(true);
      }
    }
  }, [hasInteracted, fadeIn]);

  useEffect(() => {
    return () => {
      if (isPlaying.current) {
        fadeOut(1000);
        isPlaying.current = false;
      }
    };
  }, [fadeOut]);

  const handleManualPlay = () => {
    if (!isPlaying.current) {
      isPlaying.current = true;
      fadeIn(1500); // Faster fade-in
    }
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={handleManualPlay}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full
                     text-sm font-serif text-(--color-cream) cursor-pointer
                     flex items-center gap-2 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(230,57,70,0.9), rgba(212,165,116,0.9))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
          Tap to play music
        </motion.button>
      )}
    </AnimatePresence>
  );
}
