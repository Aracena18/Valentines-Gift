import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function ConfettiOverlay() {
  const { tier } = useDeviceCapability();
  const prefersReduced = useReducedMotion();
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current || prefersReduced) return;
    hasFired.current = true;

    const count = tier === 'low' ? 30 : tier === 'medium' ? 80 : 150;
    const spread = tier === 'low' ? 40 : 70;

    // Heart-shaped confetti — use custom shapes
    const heartShape = confetti.shapeFromText({ text: '❤️', scalar: 2 });

    // First burst
    confetti({
      particleCount: Math.floor(count * 0.6),
      spread,
      origin: { y: 0.7 },
      colors: ['#e63946', '#ff6b7a', '#f4a0a0', '#d4a574', '#b8a9c9'],
      shapes: [heartShape, 'circle'],
      scalar: 1.2,
      gravity: 0.8,
      ticks: 200,
      disableForReducedMotion: true,
    });

    // Delayed second burst
    setTimeout(() => {
      confetti({
        particleCount: Math.floor(count * 0.4),
        spread: spread + 20,
        origin: { x: 0.3, y: 0.6 },
        colors: ['#e63946', '#d4a574', '#fdf6e3'],
        shapes: [heartShape, 'circle'],
        scalar: 1,
        gravity: 0.9,
        ticks: 150,
        disableForReducedMotion: true,
      });
    }, 500);

    // Third small burst from the other side
    setTimeout(() => {
      confetti({
        particleCount: Math.floor(count * 0.3),
        spread: spread - 10,
        origin: { x: 0.7, y: 0.6 },
        colors: ['#ff6b7a', '#b8a9c9', '#fdf6e3'],
        shapes: ['circle'],
        scalar: 0.8,
        gravity: 1,
        ticks: 120,
        disableForReducedMotion: true,
      });
    }, 900);
  }, [tier, prefersReduced]);

  return null; // Confetti renders to its own canvas overlay
}
