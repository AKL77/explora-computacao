import { createClient } from "@supabase/supabase-js";
import { AUTH_STORAGE_KEY, backendConfig } from "./config";

export const supabase = backendConfig.mode === "supabase" ? createClient(backendConfig.url, backendConfig.key, {
  auth: {
    flowType: "pkce",
    persistSession: true,
    storage: window.sessionStorage,
    storageKey: AUTH_STORAGE_KEY,
    detectSessionInUrl: false,
  },
}) : null;
