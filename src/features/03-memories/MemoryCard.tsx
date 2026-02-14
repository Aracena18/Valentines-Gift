import { staggerContainer, staggerItem } from '@/lib/animations';
import { motion } from 'framer-motion';
import { VoiceClip } from './VoiceClip';

interface Memory {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  lqip: string;
  voiceClip: string;
  color: string;
}

interface MemoryCardProps {
  memory: Memory;
}

// Romantic quotes that rotate per memory
const romanticQuotes = [
  'Every love story is beautiful, but ours is my favorite.',
  'In all the world, there is no heart for me like yours.',
  'You are my today and all of my tomorrows.',
  'I fell in love the way you fall asleep — slowly, then all at once.',
  'Wherever you are is my home.',
];

export function MemoryCard({ memory }: MemoryCardProps) {
  // Pick a consistent quote based on memory id
  const quoteIndex = memory.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % romanticQuotes.length;

  const formattedDate = new Date(memory.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Image with romantic frame */}
      <motion.div
        variants={staggerItem}
        className="relative w-full aspect-4/3 rounded-2xl overflow-hidden"
        style={{
          boxShadow: `0 0 0 1px ${memory.color}22, 0 8px 30px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Placeholder gradient — replaced by real image when available */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${memory.color}33, ${memory.color}11, var(--color-midnight))`,
          }}
        />
        {memory.image && (
          <img
            src={memory.image}
            alt={memory.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-[#15132a]/80 via-transparent to-transparent" />

        {/* Date badge — prettier */}
        <div className="absolute bottom-3 left-3 glass-card px-3 py-1.5 rounded-full">
          <span className="text-xs text-(--color-cream) font-handwriting">
            {formattedDate}
          </span>
        </div>

        {/* Corner heart decoration */}
        <div className="absolute top-3 right-3 opacity-30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill={memory.color}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </motion.div>

      {/* Title & location */}
      <motion.div variants={staggerItem}>
        <h3 className="font-serif text-xl md:text-2xl text-(--color-cream) mb-1 text-shadow-soft">
          {memory.title}
        </h3>
        <div className="flex items-center gap-1.5 text-(--color-gold) text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="font-handwriting text-base">{memory.location}</span>
        </div>
      </motion.div>

      {/* Description */}
      <motion.p
        variants={staggerItem}
        className="font-handwriting text-lg leading-relaxed text-(--color-cream)/90"
      >
        {memory.description}
      </motion.p>

      {/* Voice clip player */}
      {memory.voiceClip && (
        <motion.div variants={staggerItem}>
          <VoiceClip src={memory.voiceClip} label={`Voice note for ${memory.title}`} />
        </motion.div>
      )}

      {/* Romantic quote divider */}
      <motion.div
        variants={staggerItem}
        className="flex flex-col items-center gap-3 py-3"
      >
        <div className="flex items-center gap-3 w-full">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/5" />
          <svg width="12" height="12" viewBox="0 0 24 24" fill={memory.color} opacity="0.3">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/5" />
        </div>
        <p className="text-xs italic text-(--color-lavender)/70 text-center max-w-[260px]">
          "{romanticQuotes[quoteIndex]}"
        </p>
      </motion.div>
    </motion.div>
  );
}
