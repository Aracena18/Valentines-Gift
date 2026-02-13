import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import { useAudioStore } from '@/stores/useAudioStore';
import { unlockAudio } from '@/hooks/useAudio';

interface VoiceClipProps {
  src: string;
  label: string;
}

export function VoiceClip({ src, label }: VoiceClipProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const progressRef = useRef<number>(0);
  const isMuted = useAudioStore((s) => s.isMuted);

  const getSound = useCallback(() => {
    if (!soundRef.current) {
      soundRef.current = new Howl({
        src: [src],
        html5: true,
        volume: isMuted ? 0 : 0.8,
        onload: () => {
          setDuration(soundRef.current?.duration() ?? 0);
        },
        onplay: () => {
          setIsPlaying(true);
          const updateProgress = () => {
            if (soundRef.current?.playing()) {
              const seek = soundRef.current.seek() as number;
              const dur = soundRef.current.duration();
              setProgress(dur > 0 ? seek / dur : 0);
              progressRef.current = requestAnimationFrame(updateProgress);
            }
          };
          updateProgress();
        },
        onpause: () => setIsPlaying(false),
        onstop: () => {
          setIsPlaying(false);
          setProgress(0);
        },
        onend: () => {
          setIsPlaying(false);
          setProgress(0);
        },
      });
    }
    return soundRef.current;
  }, [src, isMuted]);

  const togglePlay = useCallback(() => {
    unlockAudio();
    const sound = getSound();
    if (isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }
  }, [getSound, isPlaying]);

  // Cleanup
  useEffect(() => {
    return () => {
      cancelAnimationFrame(progressRef.current);
      soundRef.current?.unload();
      soundRef.current = null;
    };
  }, []);

  // Update volume on mute change
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(isMuted ? 0 : 0.8);
    }
  }, [isMuted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass rounded-2xl p-4" role="region" aria-label={label}>
      <div className="flex items-center gap-3">
        {/* Play/Pause button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="w-11 h-11 rounded-full bg-(--color-rose) flex items-center justify-center shrink-0 shadow-lg"
          aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </motion.button>

        {/* Waveform / progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-end gap-0.5 h-6 mb-1.5">
            {Array.from({ length: 28 }, (_, i) => {
              const barProgress = i / 28;
              const isActive = barProgress <= progress;
              // Generate pseudo-random heights for waveform appearance
              const height = 30 + Math.sin(i * 0.7) * 25 + Math.cos(i * 1.3) * 20;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-colors duration-150"
                  style={{
                    height: `${height}%`,
                    backgroundColor: isActive
                      ? 'var(--color-rose)'
                      : 'rgba(255,255,255,0.12)',
                  }}
                />
              );
            })}
          </div>

          {/* Time display */}
          <div className="flex justify-between text-[10px] text-white/40">
            <span>{formatTime(progress * duration)}</span>
            <span>{duration > 0 ? formatTime(duration) : '—:——'}</span>
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className="text-xs text-(--color-lavender) mt-2 opacity-60">
        🎤 A little voice note, just for you
      </p>
    </div>
  );
}
