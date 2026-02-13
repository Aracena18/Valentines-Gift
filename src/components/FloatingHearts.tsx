import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMemo } from 'react';

interface HeartConfig {
  id: number;
  left: string;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export function FloatingHearts() {
  const prefersReduced = useReducedMotion();
  const { tier } = useDeviceCapability();

  const count = tier === 'low' ? 3 : tier === 'medium' ? 6 : 12;

  const hearts = useMemo<HeartConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 8 + Math.random() * 14,
      delay: Math.random() * 15,
      duration: 10 + Math.random() * 15,
      opacity: 0.15 + Math.random() * 0.25,
    }));
  }, [count]);

  if (prefersReduced) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0"
          style={{
            left: heart.left,
            animation: `float-up ${heart.duration}s ${heart.delay}s infinite linear`,
            opacity: heart.opacity,
          }}
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill="var(--color-rose)"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
