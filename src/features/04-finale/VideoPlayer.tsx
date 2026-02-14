import { Button } from '@/components/Button';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface VideoPlayerProps {
  onEnd: () => void;
}

export function VideoPlayer({ onEnd }: VideoPlayerProps) {
  const [showContinue, setShowContinue] = useState(false);

  // YouTube video URL
  const youtubeUrl = 'https://www.youtube.com/watch?v=dWIspO706Mg';

  // Show continue button after user clicks to watch
  const handleWatchVideo = () => {
    window.open(youtubeUrl, '_blank');
    setTimeout(() => setShowContinue(true), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Video card with play button */}
      <motion.div
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
        onClick={handleWatchVideo}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: 'linear-gradient(135deg, rgba(230,57,70,0.15), rgba(212,165,116,0.1))',
          border: '2px solid rgba(230,57,70,0.3)',
          boxShadow: '0 0 40px rgba(230,57,70,0.2)',
          minHeight: '280px',
        }}
      >
        {/* Content container */}
        <div className="flex items-center justify-center py-8 px-6 min-h-[280px]">
          <div className="text-center space-y-4 w-full max-w-md">
            {/* Play button */}
            <motion.div
              className="mx-auto relative w-20 h-20"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--color-rose), var(--color-rose-light))',
                  boxShadow: '0 8px 30px rgba(230,57,70,0.4), inset 0 2px 8px rgba(255,255,255,0.2)',
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="white"
                  style={{ marginLeft: '4px' }}
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(230,57,70,0.3)',
                    '0 0 40px rgba(230,57,70,0.5)',
                    '0 0 20px rgba(230,57,70,0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Text */}
            <div className="space-y-2">
              <h3 className="font-serif text-xl md:text-2xl text-(--color-cream) text-shadow-romantic">
                Watch Our Special Moment
              </h3>
              <p className="text-(--color-lavender)/80 text-sm">
                Click to watch on YouTube
              </p>
              <p className="text-(--color-gold)/90 text-xs italic">
                ✨ Come back here after watching for the finale ✨
              </p>
            </div>

            {/* YouTube logo hint */}
            <div className="flex items-center justify-center gap-2 text-(--color-lavender)/60 text-xs pt-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Opens in new tab
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(230,57,70,0.1), transparent)',
          }}
        />
      </motion.div>

      {/* Continue button */}
      {showContinue && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Button onClick={onEnd} variant="secondary">
            Continue to celebration →
          </Button>
        </motion.div>
      )}
    </div>
  );
}
