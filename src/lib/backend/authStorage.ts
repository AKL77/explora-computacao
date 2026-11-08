import { AUTH_STORAGE_KEY } from "./config";

export const REMEMBER_DEVICE_KEY = "explora:remember-device:v1";
const AUTH_STORAGE_MODE_KEY = "explora:teacher-auth-mode:v1";

export function createTeacherAuthStorage(tabStorage: Storage, deviceStorage: Storage) {
  const tabMode = tabStorage.getItem(AUTH_STORAGE_MODE_KEY);
  // Sessões antigas continuam restritas à aba, mesmo se outra aba lembrar um login.
  let persistent: boolean | null = tabMode === "device" ? true
    : tabMode === "tab" || tabStorage.getItem(AUTH_STORAGE_KEY) !== null ? false : null;
  const selectedStorage = () => (persistent ?? deviceStorage.getItem(REMEMBER_DEVICE_KEY) === "true") ? deviceStorage : tabStorage;
  const clearCredentials = (storage: Storage) => {
    const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index));
    for (const key of keys) {
      if (key === AUTH_STORAGE_KEY || key?.startsWith(`${AUTH_STORAGE_KEY}-`)) storage.removeItem(key);
    }
  };

  return {
    getItem: (key: string) => selectedStorage().getItem(key),
    setItem: (key: string, value: string) => selectedStorage().setItem(key, value),
    removeItem: (key: string) => selectedStorage().removeItem(key),
    remembersDevice: () => deviceStorage.getItem(REMEMBER_DEVICE_KEY) === "true",
    setRememberDevice: (remember: boolean) => {
      if (remember) deviceStorage.setItem(REMEMBER_DEVICE_KEY, "true");
      else deviceStorage.removeItem(REMEMBER_DEVICE_KEY);
      // A escolha deve sobreviver à ida ao Google e ao retorno do fluxo PKCE.
      tabStorage.setItem(AUTH_STORAGE_MODE_KEY, remember ? "device" : "tab");
      if (remember) clearCredentials(tabStorage);
      persistent = remember;
    },
    clearSession: () => clearCredentials(selectedStorage()),
    matchesSession: (accessToken: string | undefined) => {
      try {
        const stored = JSON.parse(selectedStorage().getItem(AUTH_STORAGE_KEY) ?? "null");
        return (stored?.access_token ?? undefined) === accessToken;
      } catch { return accessToken === undefined; }
    },
  };
}

export const teacherAuthStorage = createTeacherAuthStorage(window.sessionStorage, window.localStorage);
