import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMemo } from 'react';

interface ParticleConfig {
  id: number;
  type: 'heart' | 'sparkle' | 'star';
  left: string;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export function FloatingHearts() {
  const prefersReduced = useReducedMotion();
  const { tier } = useDeviceCapability();

  const count = tier === 'low' ? 4 : tier === 'medium' ? 8 : 16;

  const particles = useMemo<ParticleConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      // Mix of hearts, sparkles, and stars for variety
      const types: ParticleConfig['type'][] = ['heart', 'heart', 'sparkle', 'star'];
      return {
        id: i,
        type: types[i % types.length],
        left: `${Math.random() * 100}%`,
        size: i % 4 === 3 ? 4 + Math.random() * 6 : 8 + Math.random() * 14,
        delay: Math.random() * 15,
        duration: 10 + Math.random() * 15,
        opacity: 0.1 + Math.random() * 0.25,
      };
    });
  }, [count]);

  if (prefersReduced) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0"
          style={{
            left: p.left,
            animation: `${p.type === 'sparkle' ? 'sparkle-float' : 'float-up'} ${p.duration}s ${p.delay}s infinite linear`,
            opacity: p.opacity,
          }}
        >
          {p.type === 'heart' ? (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="var(--color-rose)">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          ) : p.type === 'sparkle' ? (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="var(--color-gold)">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          ) : (
            <div
              className="rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: 'radial-gradient(circle, rgba(253,246,227,0.9), transparent)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
