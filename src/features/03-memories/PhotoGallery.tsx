import photoList from '@/data/photos.json';
import { useHaptic } from '@/hooks/useHaptic';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDrag } from '@use-gesture/react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

const photos = photoList.map((path, idx) => ({
  id: `photo-${idx}`,
  image: path,
  filename: path.split('/').pop() || '',
}));

function getCardIndex(base: number, offset: number) {
  return ((base + offset) % photos.length + photos.length) % photos.length;
}

// How many "behind" cards are visible
const VISIBLE_CARDS = 3;

// Playful random-ish offsets for each stack position so they look casually tossed
const STACK_QUIRKS = [
  { rotate: -6, xShift: 8, yShift: -10 },   // closest behind
  { rotate: 4.5, xShift: -12, yShift: -22 }, // middle
  { rotate: -9, xShift: 6, yShift: -34 },    // furthest
];

// Swipe threshold in px — very easy to trigger
const SWIPE_THRESHOLD = 35;

export function PhotoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReduced = useReducedMotion();
  const { hapticTap } = useHaptic();
  const isDragging = useRef(false);

  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-200, 0, 200], [-8, 0, 8]);

  const paginate = useCallback(
    (dir: number) => {
      hapticTap();
      setCurrentIndex((prev) => getCardIndex(prev, dir));
    },
    [hapticTap]
  );

  const bindHandlers = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx], cancel, first, tap }) => {
      if (tap) return;

      if (first) {
        isDragging.current = false;
      }

      if (active) {
        // Only start dragging after a small horizontal threshold to not block scroll
        if (Math.abs(mx) > 8) {
          isDragging.current = true;
        }

        if (isDragging.current) {
          dragX.set(mx);
          // Very easy swipe — only 35px needed
          if (Math.abs(mx) > SWIPE_THRESHOLD) {
            cancel();
            dragX.set(0);
            isDragging.current = false;
            paginate(mx < 0 ? 1 : -1);
          }
        }
      } else {
        if (isDragging.current) {
          // Easy velocity-based swipe
          if (Math.abs(vx) > 0.15 || Math.abs(mx) > 25) {
            paginate(dx > 0 ? -1 : 1);
          }
          isDragging.current = false;
        }
        dragX.set(0);
      }
    },
    { 
      axis: 'lock', // lock to dominant axis — allows vertical scroll if swiping vertically
      filterTaps: true, 
      pointer: { touch: true },
      preventScrollAxis: 'x', // only prevent scroll on horizontal swipe, allow vertical
      threshold: 8, // need 8px before gesture starts — allows vertical scroll
    }
  );

  // Strip onAnimationStart to avoid framer-motion type conflict
  const { onAnimationStart: _, ...safeBind } = bindHandlers() as any;

  return (
    <section className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden py-12 px-5">
      {/* Section header */}
      <motion.div
        className="text-center mb-10 z-10"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-10 bg-linear-to-r from-transparent to-(--color-gold)/40" />
          <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--color-rose)" opacity="0.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <div className="h-px w-10 bg-linear-to-l from-transparent to-(--color-gold)/40" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-(--color-cream) text-shadow-soft">
          Our Moments
        </h2>
        <p className="text-(--color-lavender)/70 text-sm font-handwriting mt-1">
          swipe through {photos.length} memories
        </p>
      </motion.div>

      {/* ── Stacked card deck ── */}
      <div
        className="relative w-full max-w-[340px] mx-auto select-none"
        style={{ height: 480, touchAction: 'pan-y' }}
      >
        {/* Background stacked cards (rendered bottom-to-top) */}
        {Array.from({ length: VISIBLE_CARDS }, (_, i) => {
          const stackPos = VISIBLE_CARDS - i; // 3, 2, 1 (furthest to closest behind front)
          const memIndex = getCardIndex(currentIndex, stackPos);
          const photo = photos[memIndex];
          const quirk = STACK_QUIRKS[stackPos - 1];
          const scaleVal = 1 - stackPos * 0.05;

          return (
            <motion.div
              key={`stack-${stackPos}-${memIndex}`}
              className="absolute inset-0 rounded-3xl overflow-hidden"
              initial={false}
              animate={{
                scale: scaleVal,
                x: prefersReduced ? 0 : quirk.xShift,
                y: quirk.yShift,
                rotate: prefersReduced ? 0 : quirk.rotate,
                opacity: 1 - stackPos * 0.15,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{
                zIndex: VISIBLE_CARDS - stackPos,
                transformOrigin: 'center bottom',
              }}
            >
              <StackedCard photo={photo} isBehind />
            </motion.div>
          );
        })}

        {/* Front card — draggable */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{
              x: dragX,
              rotate: prefersReduced ? 0 : dragRotate,
              zIndex: VISIBLE_CARDS + 1,
            }}
            initial={{ scale: 0.92, opacity: 0, y: -40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            {...safeBind}
          >
            <FrontCard photo={photos[currentIndex]} />
          </motion.div>
        </AnimatePresence>

        {/* Swipe hint arrows on edges */}
        <div className="absolute inset-y-0 -left-6 flex items-center pointer-events-none z-10 opacity-20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-cream)" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>
        <div className="absolute inset-y-0 -right-6 flex items-center pointer-events-none z-10 opacity-20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-cream)" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>

      {/* Navigation dots + arrows */}
      <div className="flex items-center justify-center gap-4 mt-8 z-10">
        {/* Left arrow */}
        <button
          onClick={() => paginate(-1)}
          className="w-11 h-11 flex items-center justify-center rounded-full glass hover:bg-white/10 transition-colors"
          aria-label="Previous photo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-cream)" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Dots (only show if <= 10 photos, otherwise show counter) */}
        {photos.length <= 10 ? (
          <div className="flex items-center gap-2">
            {photos.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  hapticTap();
                  setCurrentIndex(i);
                }}
                className="rounded-full transition-colors"
                animate={{
                  width: i === currentIndex ? 22 : 6,
                  height: 6,
                  backgroundColor: i === currentIndex ? 'var(--color-rose)' : 'rgba(255,255,255,0.15)',
                  boxShadow: i === currentIndex ? '0 0 8px rgba(230,57,70,0.4)' : '0 0 0px transparent',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === currentIndex ? 'true' : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="min-w-[60px] text-center">
            <p className="text-(--color-cream) text-lg font-handwriting tabular-nums">
              {currentIndex + 1} / {photos.length}
            </p>
          </div>
        )}

        {/* Right arrow */}
        <button
          onClick={() => paginate(1)}
          className="w-11 h-11 flex items-center justify-center rounded-full glass hover:bg-white/10 transition-colors"
          aria-label="Next photo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-cream)" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Counter (always show below) */}
      <p className="text-(--color-lavender)/40 text-xs font-handwriting mt-3">
        Photo {currentIndex + 1} of {photos.length}
      </p>
    </section>
  );
}

/* ─── Front card (full detail) ─── */
function FrontCard({ photo }: { photo: typeof photos[number] }) {
  return (
    <div
      className="w-full h-full rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(45,38,60,0.95), rgba(30,26,48,0.98))',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 0 0 1px rgba(230,57,70,0.15), 0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(230,57,70,0.1)',
      }}
    >
      <div className="relative w-full h-full">
        {/* Image */}
        {photo.image && (
          <img
            src={photo.image}
            alt={photo.filename}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#15132a]/80 via-transparent to-transparent" />

        {/* Top corner — subtle heart */}
        <div className="absolute top-4 right-4 opacity-25">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-rose)">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>

        {/* Filename at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-handwriting text-sm text-(--color-cream)/60 text-center">
            {photo.filename}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Stacked card behind (simplified, just image) ─── */
function StackedCard({ photo, isBehind }: { photo: typeof photos[number]; isBehind: boolean }) {
  return (
    <div
      className="w-full h-full rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(45,38,60,0.9), rgba(30,26,48,0.95))',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      }}
    >
      <div className="relative w-full h-full">
        {photo.image && (
          <img
            src={photo.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: isBehind ? 'brightness(0.6) blur(1px)' : undefined }}
            draggable={false}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        {/* Darken overlay for depth */}
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </div>
  );
}
