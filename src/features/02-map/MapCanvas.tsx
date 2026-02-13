import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export function MapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tier } = useDeviceCapability();
  const prefersReduced = useReducedMotion();
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReduced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Particle count based on device capability
    const count = tier === 'low' ? 8 : tier === 'medium' ? 20 : 40;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 0.5 + Math.random() * 1.5,
      speedY: -0.1 - Math.random() * 0.3,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: 0.2 + Math.random() * 0.5,
      twinkleSpeed: 0.005 + Math.random() * 0.02,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let frameCount = 0;
    const skipFrames = tier === 'low' ? 3 : tier === 'medium' ? 2 : 1;

    const animate = () => {
      frameCount++;
      if (frameCount % skipFrames !== 0) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.twinklePhase += p.twinkleSpeed;

        // Wrap around
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const twinkle = 0.5 + 0.5 * Math.sin(p.twinklePhase);
        const alpha = p.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 246, 227, ${alpha})`;
        ctx.fill();

        // Soft glow for larger particles
        if (p.size > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 165, 116, ${alpha * 0.1})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resize, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [tier, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}
