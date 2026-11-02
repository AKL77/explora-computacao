import { useEffect } from "react";
import { CLASSROOMS_STORAGE_KEY, useClassroomsStore } from "@/store/useClassroomsStore";
import { isOnlineMode } from "@/lib/backend/config";

// Sincroniza a demonstração entre abas do mesmo navegador; não substitui armazenamento online.
export function useClassroomSync() {
  useEffect(() => {
    if (isOnlineMode) return;
    const sync = (event: StorageEvent) => {
      if (event.storageArea === localStorage && (event.key === CLASSROOMS_STORAGE_KEY || event.key === null)) {
        void useClassroomsStore.persist.rehydrate();
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
}
