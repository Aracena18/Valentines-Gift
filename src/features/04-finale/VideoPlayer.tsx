import { Button } from '@/components/Button';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface VideoPlayerProps {
  onEnd: () => void;
}

export function VideoPlayer({ onEnd }: VideoPlayerProps) {
  const [showContinue, setShowContinue] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  // YouTube video ID extracted from: https://youtu.be/dWIspO706Mg?si=_K4McWcJSqVsoxTR
  const youtubeVideoId = 'dWIspO706Mg';
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;

  // Show continue button after 5 seconds (gives time to start watching)
  setTimeout(() => setShowContinue(true), 5000);

  return (
    <div className="space-y-6">
      {/* YouTube embed */}
      <div className="relative rounded-2xl overflow-hidden aspect-video">
        {!embedError ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
            title="Our Special Moment"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            onError={() => setEmbedError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center glass-card">
            <div className="text-center space-y-4 p-6">
              <p className="text-(--color-lavender) text-sm">
                Video embed not available
              </p>
              <Button
                onClick={() => window.open(youtubeUrl, '_blank')}
                variant="secondary"
              >
                Watch on YouTube →
              </Button>
            </div>
          </div>
        )}
      </div>

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
