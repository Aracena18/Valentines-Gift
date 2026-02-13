import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Gate
  isUnlocked: boolean;
  unlock: () => void;

  // Navigation
  currentSection: number;
  setSection: (section: number) => void;

  // Choose-your-path choices (Phase 2)
  choices: Record<string, string>;
  setChoice: (key: string, value: string) => void;

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

      choices: {},
      setChoice: (key, value) =>
        set((state) => ({ choices: { ...state.choices, [key]: value } })),

      hasInteracted: false,
      setInteracted: () => set({ hasInteracted: true }),
    }),
    {
      name: 'map-of-us-app',
      partialize: (state) => ({
        isUnlocked: state.isUnlocked,
        choices: state.choices,
      }),
    }
  )
);
