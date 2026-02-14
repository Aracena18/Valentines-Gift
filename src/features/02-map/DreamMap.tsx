import memoriesData from '@/data/memories.json';
import { LongPressEasterEgg } from '@/features/easter-eggs/EasterEggs';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { MapCanvas } from './MapCanvas';
import { MapPin } from './MapPin';

interface DreamMapProps {
  onPinClick: (memoryId: string) => void;
}

export function DreamMap({ onPinClick }: DreamMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { tier } = useDeviceCapability();
  const enableParallax = tier !== 'low' && !prefersReduced;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Parallax offsets for layers
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  // Path draw animation
  const pathLength = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[150dvh]"
      aria-label="Our memory map"
    >
      {/* Fixed viewport container */}
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* Background gradient layer */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, 
                #0f0f1a 0%, 
                #1a1530 15%, 
                #1e1a35 30%, 
                #221e3a 45%, 
                #1a1530 60%, 
                #15132a 75%, 
                #0f0f1a 100%
              )
            `,
          }}
        />

        {/* Parallax layer 1 — far stars */}
        <motion.div
          className="absolute inset-0"
          style={{ y: enableParallax ? y1 : 0 }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at 15% 25%, rgba(212,165,116,0.8) 50%, transparent 100%),
                radial-gradient(1.5px 1.5px at 45% 15%, rgba(255,255,255,0.9) 50%, transparent 100%),
                radial-gradient(1px 1px at 75% 35%, rgba(184,169,201,0.7) 50%, transparent 100%),
                radial-gradient(1px 1px at 30% 70%, rgba(255,255,255,0.5) 50%, transparent 100%),
                radial-gradient(1px 1px at 85% 60%, rgba(212,165,116,0.6) 50%, transparent 100%),
                radial-gradient(1.5px 1.5px at 55% 85%, rgba(255,255,255,0.7) 50%, transparent 100%),
                radial-gradient(1px 1px at 10% 90%, rgba(184,169,201,0.5) 50%, transparent 100%),
                radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.4) 50%, transparent 100%)
              `,
            }}
          />
        </motion.div>

        {/* Parallax layer 2 — nebula clouds */}
        <motion.div
          className="absolute inset-0"
          style={{ y: enableParallax ? y2 : 0 }}
        >
          <div
            className="absolute inset-0 opacity-15"
            style={{
              background: `
                radial-gradient(ellipse 60% 40% at 20% 30%, rgba(230,57,70,0.2), transparent),
                radial-gradient(ellipse 50% 35% at 75% 60%, rgba(184,169,201,0.15), transparent),
                radial-gradient(ellipse 40% 30% at 50% 80%, rgba(212,165,116,0.12), transparent)
              `,
            }}
          />
        </motion.div>

        {/* Parallax layer 3 — foreground light beams */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: enableParallax ? y3 : 0 }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `
                linear-gradient(135deg, transparent 40%, rgba(212,165,116,0.3) 50%, transparent 60%),
                linear-gradient(225deg, transparent 40%, rgba(230,57,70,0.2) 50%, transparent 60%)
              `,
            }}
          />
        </motion.div>

        {/* Canvas particle overlay */}
        <MapCanvas />

        {/* SVG journey path */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d="M 25 10 C 35 20, 55 25, 65 30 S 50 45, 40 50 S 60 60, 70 65 S 55 78, 50 85"
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="0.3"
            strokeLinecap="round"
            strokeDasharray="1 2"
            style={{ pathLength }}
          />
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-rose)" stopOpacity="0.6" />
              <stop offset="50%" stopColor="var(--color-gold)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--color-rose)" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Memory pins */}
        {memoriesData.memories.map((memory, index) => (
          <MapPin
            key={memory.id}
            memory={memory}
            index={index}
            scrollProgress={scrollYProgress}
            onClick={() => onPinClick(memory.id)}
          />
        ))}

        {/* Section title */}
        <motion.div
          className="absolute top-8 left-0 right-0 text-center z-10 px-4"
          style={{ paddingTop: 'var(--safe-top, 0px)' }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Decorative line above */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-3"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="h-px w-12 bg-linear-to-r from-transparent to-(--color-gold)/40" />
            <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--color-rose)" opacity="0.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-(--color-gold)/40" />
          </motion.div>

          <h2 className="font-serif text-2xl md:text-3xl text-(--color-cream) text-shadow-soft">
            <LongPressEasterEgg
              message="You held on... just like I hold on to every memory of us. 🌟"
              eggId="map-long-press"
            >
              Our Journey Together
            </LongPressEasterEgg>
          </h2>
          <p className="text-(--color-lavender) mt-2 opacity-80 font-handwriting text-sm">
            scroll through time &amp; tap a pin to relive a memory
          </p>
        </motion.div>
      </div>
    </section>
  );
}
