import { useState, useRef, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { hashPassword, SECRET_HASH } from '@/lib/crypto';
import { Button } from '@/components/Button';
import { useHaptic } from '@/hooks/useHaptic';
import { fadeInUp, scaleIn } from '@/lib/animations';

interface SecretInputProps {
  onSuccess: () => void;
}

export function SecretInput({ onSuccess }: SecretInputProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { hapticError } = useHaptic();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isChecking) return;

    setIsChecking(true);
    setError('');

    try {
      const hash = await hashPassword(value);
      if (hash === SECRET_HASH) {
        onSuccess();
      } else {
        hapticError();
        setError("That's not quite right... try again 💕");
        setValue('');
        inputRef.current?.focus();
      }
    } catch {
      setError('Something went wrong, please try again');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative z-10 w-full max-w-sm mx-auto px-6"
    >
      {/* Envelope visual */}
      <motion.div
        className="mx-auto mb-8 flex flex-col items-center"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* Heart seal */}
        <motion.div
          animate={{
            filter: [
              'drop-shadow(0 0 8px rgba(230,57,70,0.3))',
              'drop-shadow(0 0 20px rgba(230,57,70,0.6))',
              'drop-shadow(0 0 8px rgba(230,57,70,0.3))',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-4"
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--color-rose)">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.div>

        <h1 className="font-serif text-2xl md:text-3xl text-(--color-cream) text-center mb-2">
          A Map of Us
        </h1>
        <p className="text-(--color-lavender) text-sm text-center opacity-80">
          This letter is sealed with a secret
        </p>
      </motion.div>

      {/* Input form */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <div>
          <label
            htmlFor="secret-input"
            className="block text-(--color-gold) mb-2 font-handwriting text-lg"
          >
            Enter our secret word...
          </label>
          <input
            ref={inputRef}
            id="secret-input"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            placeholder="Whisper it here..."
            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-(--color-cream) placeholder-white/30 text-base focus:outline-none focus:ring-2 focus:ring-(--color-rose)/50 focus:border-(--color-rose)/30 transition-all"
            style={{ fontSize: '16px' }} // Prevent iOS zoom
          />
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-(--color-blush) text-center font-handwriting text-base"
            role="alert"
          >
            {error}
          </motion.p>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={!value.trim() || isChecking}
          className="font-serif tracking-wide"
        >
          {isChecking ? (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Opening...
            </motion.span>
          ) : (
            'Unseal This Letter'
          )}
        </Button>
      </motion.form>

      {/* Subtle hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="text-center text-white/20 mt-8 font-handwriting text-sm"
      >
        Hint: what you always say to me ✨
      </motion.p>
    </motion.div>
  );
}
