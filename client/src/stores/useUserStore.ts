// stores/useUserStore.ts
import { create } from 'zustand';

type UserStore = {
  updated: number;
  triggerUpdate: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  updated: Date.now(),
  triggerUpdate: () => set({ updated: Date.now() }),
}));
