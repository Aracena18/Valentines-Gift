import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';

interface VideoPlayerProps {
  onEnd: () => void;
}

export function VideoPlayer({ onEnd }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (video) {
      video.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => {
        // Autoplay blocked — user must tap again
      });
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onEnd();
  };

  // If no video file is configured, skip directly to celebration
  const hasVideo = false; // Set to true when you add a real video

  if (!hasVideo) {
    return (
      <div className="text-center py-8 space-y-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-handwriting text-xl text-(--color-cream)"
        >
          A video will go here...
        </motion.p>
        <p className="text-(--color-lavender) text-sm opacity-60">
          Add your video to <code className="text-(--color-gold) text-xs">/public/video/reveal.mp4</code>
        </p>
        <Button onClick={onEnd} variant="secondary">
          Skip to celebration →
        </Button>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <video
        ref={videoRef}
        playsInline
        preload="none"
        poster="/video/poster.jpg"
        onEnded={handleEnded}
        className="w-full rounded-2xl"
      >
        <source src="/video/reveal.webm" type="video/webm" />
        <source src="/video/reveal.mp4" type="video/mp4" />
        Your browser doesn't support video playback.
      </video>

      {/* Play overlay */}
      {!isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={handlePlay}
            className="w-16 h-16 rounded-full bg-(--color-rose) flex items-center justify-center shadow-xl"
            aria-label="Play video"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
