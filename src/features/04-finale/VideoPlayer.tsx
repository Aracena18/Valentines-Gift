import { Button } from '@/components/Button';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface VideoPlayerProps {
  onEnd: () => void;
}

export function VideoPlayer({ onEnd }: VideoPlayerProps) {
  const [showContinue, setShowContinue] = useState(false);

  // YouTube video ID extracted from: https://youtu.be/dWIspO706Mg?si=_K4McWcJSqVsoxTR
  const youtubeVideoId = 'dWIspO706Mg';

  // Show continue button after 5 seconds (gives time to start watching)
  setTimeout(() => setShowContinue(true), 5000);

  return (
    <div className="space-y-6">
      {/* YouTube embed */}
      <div className="relative rounded-2xl overflow-hidden aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
          title="Our Special Moment"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
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
