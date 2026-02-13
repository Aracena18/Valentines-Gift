import { useHaptic } from '@/hooks/useHaptic';
import { slideFromBottom } from '@/lib/animations';
import { useDrag } from '@use-gesture/react';
import { motion } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';

interface BottomSheetProps {
  children: ReactNode;
  onClose: () => void;
}

export function BottomSheet({ children, onClose }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const { hapticTap } = useHaptic();

  // Trap focus inside bottom sheet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Swipe down to dismiss
  const bind = useDrag(
    ({ down, movement: [, my], velocity: [, vy], cancel }) => {
      if (my < -50) {
        cancel();
        return;
      }
      if (!down) {
        if (my > 100 || vy > 0.5) {
          hapticTap();
          onClose();
        }
      }
    },
    {
      axis: 'y',
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
      pointer: { touch: true },
    }
  );

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <motion.div
        ref={sheetRef}
        variants={slideFromBottom}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[85dvh] rounded-t-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1e1a30 0%, #15132a 100%)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'var(--safe-bottom, 16px)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Memory details"
      >
        {/* Drag handle */}
        <div {...bind()} className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(85dvh-40px)] px-5 pb-6 overscroll-contain">
          {children}
        </div>
      </motion.div>
    </>
  );
}
