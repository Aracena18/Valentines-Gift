import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';

interface Memory {
  id: string;
  title: string;
  date: string;
  location: string;
  color: string;
  pinPosition: { x: number; y: number };
}

interface MapPinProps {
  memory: Memory;
  index: number;
  scrollProgress: MotionValue<number>;
  onClick: () => void;
}

export function MapPin({ memory, index, scrollProgress, onClick }: MapPinProps) {
  const { hapticTap } = useHaptic();

  // Each pin appears as user scrolls through the map
  const pinAppearThreshold = index / 5; // 5 = total memories
  const opacity = useTransform(
    scrollProgress,
    [Math.max(0, pinAppearThreshold - 0.05), pinAppearThreshold + 0.05],
    [0, 1]
  );
  const scale = useTransform(
    scrollProgress,
    [Math.max(0, pinAppearThreshold - 0.05), pinAppearThreshold + 0.05],
    [0.5, 1]
  );

  return (
    <motion.button
      style={{
        position: 'absolute',
        left: `${memory.pinPosition.x}%`,
        top: `${memory.pinPosition.y}%`,
        opacity,
        scale,
        x: '-50%',
        y: '-50%',
      }}
      whileTap={{ scale: 1.2 }}
      onClick={() => {
        hapticTap();
        onClick();
      }}
      className="z-20 group focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold)"
      aria-label={`Memory: ${memory.title} — ${memory.location}, ${memory.date}`}
    >
      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{
          backgroundColor: memory.color,
          opacity: 0.2,
          animationDuration: '2s',
        }}
      />

      {/* Pin body */}
      <div
        className="relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-transform"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${memory.color}dd, ${memory.color}88)`,
          boxShadow: `0 0 20px ${memory.color}44, 0 4px 12px rgba(0,0,0,0.3)`,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>

      {/* Label tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.1 }}
        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <span className="text-xs font-handwriting text-(--color-cream) bg-(--color-midnight)/80 px-2 py-1 rounded-lg backdrop-blur-sm">
          {memory.title}
        </span>
      </motion.div>
    </motion.button>
  );
}
