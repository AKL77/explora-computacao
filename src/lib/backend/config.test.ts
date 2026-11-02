import { describe, expect, it } from "vitest";
import { readBackendConfig } from "./config";

describe("configuração do backend", () => {
  it("mantém uma demonstração explícita separada da conta online", () => {
    expect(readBackendConfig({}).mode).toBe("demo");
    expect(readBackendConfig({ VITE_APP_MODE: "demo", VITE_SUPABASE_URL: "https://example.supabase.co", VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test" })).toEqual({ mode: "demo", url: "", key: "" });
  });
  it("bloqueia configurações incompletas sem cair na sessão demonstrativa", () => {
    expect(readBackendConfig({ VITE_APP_MODE: "supabase" }).mode).toBe("invalid");
    expect(readBackendConfig({ VITE_SUPABASE_URL: "https://example.supabase.co" }).mode).toBe("invalid");
    expect(readBackendConfig({ VITE_SUPABASE_URL: "http://example.com", VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test" }).mode).toBe("invalid");
    expect(readBackendConfig({ VITE_SUPABASE_URL: "https://example.supabase.co", VITE_SUPABASE_PUBLISHABLE_KEY: "sb_secret_forbidden" }).mode).toBe("invalid");
  });
  it("aceita somente a chave pública na aplicação", () => {
    expect(readBackendConfig({ VITE_APP_MODE: "supabase", VITE_SUPABASE_URL: "https://example.supabase.co", VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test" }).mode).toBe("supabase");
  });
});
