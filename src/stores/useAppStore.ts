import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Gate
  isUnlocked: boolean;
  unlock: () => void;

  // Navigation
  currentSection: number;
  setSection: (section: number) => void;

  // Easter Eggs
  easterEggsFound: string[];
  addEasterEgg: (id: string) => void;

  // Has user interacted (for audio unlock)
  hasInteracted: boolean;
  setInteracted: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isUnlocked: false,
      unlock: () => set({ isUnlocked: true }),

      currentSection: 0,
      setSection: (section) => set({ currentSection: section }),

      easterEggsFound: [],
      addEasterEgg: (id) =>
        set((state) => ({
          easterEggsFound: state.easterEggsFound.includes(id)
            ? state.easterEggsFound
            : [...state.easterEggsFound, id],
        })),

      hasInteracted: false,
      setInteracted: () => set({ hasInteracted: true }),
    }),
    {
      name: 'map-of-us-app',
      partialize: (state) => ({
        isUnlocked: state.isUnlocked,
        easterEggsFound: state.easterEggsFound,
        hasInteracted: state.hasInteracted, // Persist interaction state
      }),
    }
  )
);
