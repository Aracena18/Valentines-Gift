import { motion } from 'framer-motion';
import { VoiceClip } from './VoiceClip';
import { staggerContainer, staggerItem } from '@/lib/animations';

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

export function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Image */}
      <motion.div
        variants={staggerItem}
        className="relative w-full aspect-4/3 rounded-2xl overflow-hidden"
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
              // Hide broken image, show gradient placeholder
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-[#15132a]/80 via-transparent to-transparent" />

        {/* Date badge */}
        <div className="absolute bottom-3 left-3 glass px-3 py-1.5 rounded-full">
          <span className="text-xs text-(--color-cream)">
            {new Date(memory.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </motion.div>

      {/* Title & location */}
      <motion.div variants={staggerItem}>
        <h3 className="font-serif text-xl md:text-2xl text-(--color-cream) mb-1">
          {memory.title}
        </h3>
        <div className="flex items-center gap-1.5 text-(--color-gold) text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{memory.location}</span>
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

      {/* Decorative divider */}
      <motion.div
        variants={staggerItem}
        className="flex items-center justify-center gap-3 py-2"
      >
        <div className="h-px flex-1 bg-white/5" />
        <svg width="16" height="16" viewBox="0 0 24 24" fill={memory.color} opacity="0.4">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <div className="h-px flex-1 bg-white/5" />
      </motion.div>
    </motion.div>
  );
}
