import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressEntry {
  episodeId: string;
  progress: number;
  duration: number;
  updatedAt: number;
}

interface PlayerStore {
  localProgress: Record<string, ProgressEntry>;
  setProgress: (episodeId: string, progress: number, duration: number) => void;
  getProgress: (episodeId: string) => ProgressEntry | undefined;
  clearProgress: (episodeId: string) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      localProgress: {},
      setProgress: (episodeId, progress, duration) => {
        set((state) => ({
          localProgress: {
            ...state.localProgress,
            [episodeId]: { episodeId, progress, duration, updatedAt: Date.now() },
          },
        }));
      },
      getProgress: (episodeId) => get().localProgress[episodeId],
      clearProgress: (episodeId) => {
        set((state) => {
          const { [episodeId]: _, ...rest } = state.localProgress;
          return { localProgress: rest };
        });
      },
    }),
    { name: "donghua-player-progress" }
  )
);
