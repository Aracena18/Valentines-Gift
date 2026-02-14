import { useAudio } from '@/hooks/useAudio';
import { useAppStore } from '@/stores/useAppStore';
import { useEffect } from 'react';

export function BackgroundMusic() {
  const hasInteracted = useAppStore((s) => s.hasInteracted);
  const { fadeIn, fadeOut } = useAudio({
    src: '/audio/ambient.mp3',
    loop: true,
    volume: 0.3, // Subtle background volume (0.0 - 1.0)
    preload: true,
  });

  useEffect(() => {
    // Only start music after user has interacted (required for iOS/browsers)
    if (hasInteracted) {
      fadeIn(2000); // 2-second fade-in
    }

    return () => {
      fadeOut(1000); // 1-second fade-out on cleanup
    };
  }, [hasInteracted, fadeIn, fadeOut]);

  return null; // This component doesn't render anything
}
