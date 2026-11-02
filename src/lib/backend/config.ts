export type BackendMode = "demo" | "supabase" | "invalid";

export function readBackendConfig(env: { VITE_SUPABASE_URL?: string; VITE_SUPABASE_PUBLISHABLE_KEY?: string; VITE_APP_MODE?: string }) {
  const url = env.VITE_SUPABASE_URL?.trim() ?? "";
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";
  if (env.VITE_APP_MODE === "demo") return { mode: "demo" as BackendMode, url: "", key: "" };
  if (!url && !key && env.VITE_APP_MODE !== "supabase") return { mode: "demo" as BackendMode, url, key };
  let valid = false;
  try { const parsed = new URL(url); valid = parsed.protocol === "https:" || parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost"; } catch { /* configuração incompleta */ }
  return { mode: valid && key.startsWith("sb_publishable_") ? "supabase" as BackendMode : "invalid" as BackendMode, url, key };
}

export const backendConfig = readBackendConfig(import.meta.env);
export const isOnlineMode = backendConfig.mode !== "demo";
export const AUTH_STORAGE_KEY = "explora:teacher-auth:v1";

// Dados de demonstração nunca são importados ou gravados no modo online.
export const onlineMemoryStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};
