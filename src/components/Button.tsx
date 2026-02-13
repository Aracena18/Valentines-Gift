import { motion, type HTMLMotionProps } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import type { ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  haptic?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  haptic = true,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const { hapticTap } = useHaptic();

  const baseClasses =
    'relative inline-flex items-center justify-center font-medium rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-midnight) disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-(--color-rose) text-white hover:bg-(--color-rose-light) active:bg-[#c5303d] shadow-lg shadow-(--color-rose)/20',
    secondary:
      'bg-(--color-glass) text-(--color-cream) border border-(--color-glass-border) hover:bg-white/10 backdrop-blur-md',
    ghost:
      'text-(--color-cream) hover:bg-white/5',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2 min-h-[36px]',
    md: 'text-base px-6 py-3 min-h-[44px]',
    lg: 'text-lg px-8 py-4 min-h-[52px]',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={(e) => {
        if (haptic) hapticTap();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
