import { Button } from '@/components/Button';
import { useHaptic } from '@/hooks/useHaptic';
import { fadeInUp, scaleIn } from '@/lib/animations';
import { hashPassword, SECRET_HASH } from '@/lib/crypto';
import { motion } from 'framer-motion';
import { useRef, useState, type FormEvent } from 'react';

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
        {/* Animated envelope with glowing heart seal */}
        <motion.div
          className="relative mb-6"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Envelope body */}
          <motion.div
            className="relative w-24 h-16 rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #3d2c4a, #2a1f35)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            }}
          >
            {/* Envelope flap */}
            <div
              className="absolute top-0 left-0 right-0 h-8 envelope-flap"
              style={{
                background: 'linear-gradient(180deg, #4a3660, #3d2c4a)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            />
          </motion.div>

          {/* Floating heart seal above envelope */}
          <motion.div
            className="absolute -top-4 left-1/2 -translate-x-1/2"
            animate={{
              filter: [
                'drop-shadow(0 0 8px rgba(230,57,70,0.3))',
                'drop-shadow(0 0 24px rgba(230,57,70,0.7))',
                'drop-shadow(0 0 8px rgba(230,57,70,0.3))',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              style={{ animation: 'heartbeat 1.5s ease-in-out infinite' }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--color-rose)">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.h1
          className="font-serif text-3xl md:text-4xl text-(--color-cream) text-center mb-2 text-shadow-romantic"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          A Map of Us
        </motion.h1>
        <motion.p
          className="text-(--color-lavender) text-sm text-center opacity-80 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          This letter is sealed with a secret
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          className="flex items-center gap-3 mt-4 w-full max-w-50"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-(--color-rose)/30" />
          <svg width="8" height="8" viewBox="0 0 24 24" fill="var(--color-gold)" opacity="0.5">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-(--color-rose)/30" />
        </motion.div>
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
            className="block text-(--color-gold) mb-2 font-handwriting text-lg text-shadow-gold"
          >
            Enter our secret word...
          </label>
          <div className="relative">
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
            {/* Subtle glow when typing */}
            {value.length > 0 && (
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  boxShadow: '0 0 20px rgba(230,57,70,0.1), inset 0 0 20px rgba(230,57,70,0.03)',
                }}
              />
            )}
          </div>
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
        Hint: Our Anniversary ✨
      </motion.p>
    </motion.div>
  );
}
