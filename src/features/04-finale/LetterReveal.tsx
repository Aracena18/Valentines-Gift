import { Button } from '@/components/Button';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { motion } from 'framer-motion';

interface LetterRevealProps {
  onComplete: () => void;
}

const letterLines = [
  'Hello Love Love kooo,',
  '',
  'If you are reading this, it means',
  'you found the secret to our story.',
  '',
  'Happy Valentines love love koo! 💝',
  '',
  'I know nasuko kas akoa kay murag',
  'wakoy gi buhat sa valentines hahahahaha,',
  'ingana mnang bida mag pa iwit permente.',
  '',
  'I just want to say lovee na',
  "I'm so thankful to have you in my life.",
  'Every moment I share with you is',
  'a moment that will last forever.',
  '',
  'Thank you soo much lovee',
  'for being there always for me,',
  'even though sometimes',
  'I have some shortcomings.',
  '',
  'But, I will always strive to be',
  'the man you deserve to have.',
  '',
  'I love youu soo muchh lovee.',
  'Happy Valentines ❤️',
];

export function LetterReveal({ onComplete }: LetterRevealProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="py-8">
      {/* Decorative top element — wax seal */}
      <motion.div
        className="flex justify-center mb-6"
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 35% 35%, var(--color-rose-light), var(--color-rose))',
            boxShadow: '0 0 30px rgba(230,57,70,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </motion.div>

      {/* Letter paper with lined texture */}
      <motion.div
        className="letter-paper relative rounded-2xl p-6 md:p-8 mx-auto max-w-md"
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
                delay: prefersReduced ? 0.05 * i : 0.1 * i,
                duration: prefersReduced ? 0.2 : 0.6,
                ease: 'easeOut',
              }}
              className={`font-handwriting text-lg md:text-xl leading-relaxed ${
                line === '' ? 'h-4' : ''
              } ${
                i === 0
                  ? 'text-(--color-gold) text-xl md:text-2xl text-shadow-gold'
                  : line.includes('❤️')
                    ? 'text-(--color-rose-light) text-shadow-glow'
                    : 'text-(--color-cream)/90'
              }`}
            >
              {line || '\u00A0'}
            </motion.p>
          ))}
        </div>

        {/* Decorative corner flourishes */}
        <div className="absolute top-3 right-3 opacity-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-gold)">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <div className="absolute bottom-3 left-3 opacity-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-gold)">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>

        {/* Subtle glow at the bottom of the letter */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 rounded-b-2xl pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(230,57,70,0.03), transparent)' }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: letterLines.length * 0.1 + 1 }}
        className="text-center mt-8"
      >
        <Button onClick={onComplete} variant="secondary" className="font-serif">
          Continue to your surprise →
        </Button>
      </motion.div>
    </div>
  );
}
