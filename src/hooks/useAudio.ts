import { Howl } from 'howler';
import { useCallback, useEffect, useRef } from 'react';
import { useAudioStore } from '@/stores/useAudioStore';

// Global audio context unlock for iOS
let audioUnlocked = false;

export function unlockAudio() {
  if (audioUnlocked) return;
  const silentBuffer = new AudioContext();
  const buffer = silentBuffer.createBuffer(1, 1, 22050);
  const source = silentBuffer.createBufferSource();
  source.buffer = buffer;
  source.connect(silentBuffer.destination);
  source.start(0);
  audioUnlocked = true;
}

interface UseAudioOptions {
  src: string | string[];
  loop?: boolean;
  volume?: number;
  preload?: boolean;
}

export function useAudio(options: UseAudioOptions) {
  const { src, loop = false, volume = 0.7, preload = false } = options;
  const soundRef = useRef<Howl | null>(null);
  const isMuted = useAudioStore((s: { isMuted: boolean }) => s.isMuted);

  const getSound = useCallback(() => {
    if (!soundRef.current) {
      soundRef.current = new Howl({
        src: Array.isArray(src) ? src : [src],
        loop,
        volume: isMuted ? 0 : volume,
        preload,
        html5: true, // Better for mobile — streams instead of loading full buffer
      });
    }
    return soundRef.current;
  }, [src, loop, volume, preload, isMuted]);

  const play = useCallback(() => {
    unlockAudio();
    const sound = getSound();
    if (isMuted) {
      sound.volume(0);
    } else {
      sound.volume(volume);
    }
    sound.play();
  }, [getSound, isMuted, volume]);

  const pause = useCallback(() => {
    soundRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    soundRef.current?.stop();
  }, []);

  const fadeIn = useCallback(
    (duration = 1000) => {
      unlockAudio();
      const sound = getSound();
      sound.volume(0);
      sound.play();
      if (!isMuted) {
        sound.fade(0, volume, duration);
      }
    },
    [getSound, isMuted, volume]
  );

  const fadeOut = useCallback(
    (duration = 1000) => {
      const sound = soundRef.current;
      if (sound) {
        sound.fade(sound.volume(), 0, duration);
        setTimeout(() => sound.pause(), duration);
      }
    },
    []
  );

  // Update volume when mute state changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(isMuted ? 0 : volume);
    }
  }, [isMuted, volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unload();
      soundRef.current = null;
    };
  }, []);

  return { play, pause, stop, fadeIn, fadeOut, sound: soundRef };
}
