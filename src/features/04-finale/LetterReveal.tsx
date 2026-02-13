import { Button } from '@/components/Button';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { motion } from 'framer-motion';

interface LetterRevealProps {
  onComplete: () => void;
}

const letterLines = [
  'My dearest,',
  '',
  'If you are reading this, it means',
  'you found the secret to our story.',
  '',
  "Every moment we've shared has been",
  'a chapter I never want to end.',
  '',
  'You are my favorite person,',
  'my greatest adventure,',
  'and my safest place.',
  '',
  'In a world of billions,',
  'my heart chose you —',
  'and it would choose you',
  'again and again.',
  '',
  'This little map is just a fraction',
  'of what you mean to me.',
  '',
  'Forever yours,',
  'with all my love',
];

export function LetterReveal({ onComplete }: LetterRevealProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="py-8">
      {/* Letter paper */}
      <motion.div
        className="relative rounded-2xl p-6 md:p-8 mx-auto max-w-md"
        style={{
          background: 'linear-gradient(145deg, rgba(45,38,60,0.9), rgba(30,26,48,0.95))',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.05)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Letter content */}
        <div className="space-y-0">
          {letterLines.map((line, i) => (
            <motion.p
              key={i}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
              transition={{
                delay: prefersReduced ? 0.05 * i : 0.08 * i,
                duration: prefersReduced ? 0.2 : 0.5,
                ease: 'easeOut',
              }}
              className={`font-handwriting text-lg md:text-xl leading-relaxed ${
                line === '' ? 'h-4' : ''
              } ${
                i === 0
                  ? 'text-(--color-gold) text-xl md:text-2xl'
                  : line.includes('❤️')
                    ? 'text-(--color-rose-light)'
                    : 'text-(--color-cream)/90'
              }`}
            >
              {line || '\u00A0'}
            </motion.p>
          ))}
        </div>

        {/* Decorative corner flourish */}
        <div className="absolute top-3 right-3 opacity-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-gold)">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: letterLines.length * 0.08 + 1 }}
        className="text-center mt-8"
      >
        <Button onClick={onComplete} variant="secondary" className="font-serif">
          Continue to your surprise →
        </Button>
      </motion.div>
    </div>
  );
}
