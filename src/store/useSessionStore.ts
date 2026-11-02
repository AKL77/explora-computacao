import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AUTH_STORAGE_KEY, isOnlineMode, onlineMemoryStorage } from "@/lib/backend/config";
import { supabase } from "@/lib/backend/client";
import { resetWorkspace } from "@/lib/backend/resetWorkspace";
import type { MaybePromise } from "@/lib/backend/workspaceState";

const SESSION_STORAGE_KEY = "explora-computacao:session:v1";

interface SessionStore {
  isAuthenticated: boolean;
  status: "loading" | "ready";
  user: { id: string; name: string; email: string } | null;
  error: string;
  signIn: () => void;
  signOut: () => MaybePromise<void>;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      status: isOnlineMode ? "loading" : "ready",
      user: null,
      error: "",
      signIn: () => { if (!isOnlineMode) set({ isAuthenticated: true }); },
      signOut: () => {
        set({ isAuthenticated: false, user: null, error: "", status: "ready" });
        if (isOnlineMode) {
          resetWorkspace(null);
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
          return supabase?.auth.signOut({ scope: "local" }).then(() => undefined);
        }
      },
    }),
    {
      name: SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => isOnlineMode ? onlineMemoryStorage : localStorage),
      partialize: ({ isAuthenticated }) => ({ isAuthenticated }),
      version: 1,
    },
  ),
);

export { SESSION_STORAGE_KEY };
