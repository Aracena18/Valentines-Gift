import memoriesData from '@/data/memories.json';
import { AnimatePresence } from 'framer-motion';
import { useCallback } from 'react';
import { BottomSheet } from './BottomSheet';
import { MemoryCard } from './MemoryCard';

interface MemoriesProps {
  activeMemoryId: string | null;
  onClose: () => void;
}

export function Memories({ activeMemoryId, onClose }: MemoriesProps) {
  const memory = memoriesData.memories.find((m) => m.id === activeMemoryId);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {memory && (
        <BottomSheet key={memory.id} onClose={handleClose}>
          <MemoryCard memory={memory} />
        </BottomSheet>
      )}
    </AnimatePresence>
  );
}
