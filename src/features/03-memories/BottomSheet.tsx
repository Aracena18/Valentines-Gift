import { useHaptic } from '@/hooks/useHaptic';
import { slideFromBottom } from '@/lib/animations';
import { useDrag } from '@use-gesture/react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';

interface BottomSheetProps {
  children: ReactNode;
  onClose: () => void;
}

export function BottomSheet({ children, onClose }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const { hapticTap } = useHaptic();
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trapping + Escape key
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !sheetRef.current) return;

    const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, [onClose]);

  useEffect(() => {
    // Save previously focused element and restore on close
    previousFocusRef.current = document.activeElement as HTMLElement;
    document.addEventListener('keydown', trapFocus);

    // Auto-focus the first focusable element inside the sheet
    requestAnimationFrame(() => {
      const focusable = sheetRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    });

    return () => {
      document.removeEventListener('keydown', trapFocus);
      previousFocusRef.current?.focus();
    };
  }, [trapFocus]);

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
          boxShadow: '0 -10px 40px rgba(0,0,0,0.4), 0 -2px 20px rgba(230,57,70,0.05)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Memory details"
      >
        {/* Drag handle */}
        <div {...bind()} className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Subtle top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(230,57,70,0.3), transparent)' }}
          aria-hidden="true"
        />

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(85dvh-40px)] px-5 pb-6 overscroll-contain">
          {children}
        </div>
      </motion.div>
    </>
  );
}
