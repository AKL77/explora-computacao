import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const SESSION_STORAGE_KEY = "explora-computacao:session:v1";

interface SessionStore {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      signIn: () => set({ isAuthenticated: true }),
      signOut: () => set({ isAuthenticated: false }),
    }),
    {
      name: SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ isAuthenticated }) => ({ isAuthenticated }),
      version: 1,
    },
  ),
);

export { SESSION_STORAGE_KEY };
