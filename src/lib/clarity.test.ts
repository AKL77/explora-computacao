import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

let clarity: typeof import("./clarity");

beforeEach(async () => {
  vi.resetModules();
  vi.stubEnv("PROD", true);
  vi.stubEnv("VITE_CLARITY_PROJECT_ID", "z4honwtjtg");
  localStorage.clear();
  document.getElementById("microsoft-clarity")?.remove();
  delete window.clarity;
  window.history.replaceState(null, "", "/");
  clarity = await import("./clarity");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("Clarity e consentimento", () => {
  it("não carrega o rastreador antes da escolha ou após recusa", () => {
    clarity.syncClarityConsent();
    expect(document.getElementById("microsoft-clarity")).toBeNull();
    clarity.setAnalyticsConsent("denied");
    clarity.trackClarityEvent("trilha_criada");
    expect(clarity.getAnalyticsConsent()).toBe("denied");
    expect(document.getElementById("microsoft-clarity")).toBeNull();
    expect(window.clarity).toBeUndefined();
  });

  it("não carrega durante o desenvolvimento mesmo com aceitação", () => {
    vi.stubEnv("PROD", false);
    clarity.setAnalyticsConsent("granted");
    expect(clarity.isClarityConfigured()).toBe(false);
    expect(document.getElementById("microsoft-clarity")).toBeNull();
  });

  it.each(["", "invalid/id", "https://other.example/"])("desativa um ID inválido: %s", (id) => {
    vi.stubEnv("VITE_CLARITY_PROJECT_ID", id);
    clarity.setAnalyticsConsent("granted");
    expect(clarity.isClarityConfigured()).toBe(false);
    expect(window.clarity).toBeUndefined();
  });

  it("instala uma única vez e autoriza somente armazenamento de análise", () => {
    clarity.setAnalyticsConsent("granted");
    clarity.syncClarityConsent();
    clarity.syncClarityConsent();
    const scripts = document.querySelectorAll<HTMLScriptElement>("#microsoft-clarity");
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toBe("https://www.clarity.ms/tag/z4honwtjtg");
    expect(scripts[0].async).toBe(true);
    expect(window.clarity?.q).toEqual([
      ["consentv2", { analytics_Storage: "granted", ad_Storage: "denied" }],
    ]);
  });

  it("reconhece uma aceitação previamente armazenada, sem sessão de login", () => {
    localStorage.setItem(clarity.ANALYTICS_CONSENT_KEY, "granted");
    clarity.syncClarityConsent();
    expect(document.getElementById("microsoft-clarity")).not.toBeNull();
    expect(localStorage.length).toBe(1);
  });

  it("envia apenas áreas e ações conhecidas, sem caminhos ou textos livres", () => {
    clarity.setAnalyticsConsent("granted");
    clarity.trackClarityPage("/app/trilha-de-ensino");
    clarity.trackClarityPage("/app/trilha-de-ensino");
    clarity.trackClarityPage("/app/materiais/exemplo-de-conteudo-privado");
    clarity.trackClarityPage("/rota-desconhecida?busca=segredo");
    clarity.trackClarityEvent("trilha_criada");
    expect(window.clarity?.q?.slice(1)).toEqual([
      ["set", "pagina", "buscar_materiais"],
      ["event", "pagina_buscar_materiais"],
      ["set", "pagina", "material"],
      ["event", "pagina_material"],
      ["event", "trilha_criada"],
    ]);
  });

  it("conserva a escolha na sessão quando o armazenamento está indisponível", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(clarity.getAnalyticsConsent()).toBeNull();
    clarity.setAnalyticsConsent("denied");
    expect(clarity.getAnalyticsConsent()).toBe("denied");
    expect(document.getElementById("microsoft-clarity")).toBeNull();
  });

  it("sincroniza a escolha feita em outra aba e libera os ouvintes", () => {
    const listener = vi.fn();
    const unsubscribe = clarity.subscribeAnalyticsConsent(listener);
    clarity.setAnalyticsConsent("denied");
    localStorage.removeItem(clarity.ANALYTICS_CONSENT_KEY);
    window.dispatchEvent(new StorageEvent("storage", { key: clarity.ANALYTICS_CONSENT_KEY }));
    expect(clarity.getAnalyticsConsent()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    window.dispatchEvent(new StorageEvent("storage", { key: clarity.ANALYTICS_CONSENT_KEY }));
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("uma recusa protegida na URL prevalece sobre uma aceitação antiga", () => {
    localStorage.setItem(clarity.ANALYTICS_CONSENT_KEY, "granted");
    window.history.replaceState(null, "", "/?analytics=off#/privacidade");
    clarity.syncClarityConsent();
    expect(clarity.getAnalyticsConsent()).toBe("denied");
    expect(document.getElementById("microsoft-clarity")).toBeNull();
    clarity.setAnalyticsConsent("granted");
    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("#/privacidade");
    expect(document.getElementById("microsoft-clarity")).not.toBeNull();
  });

  it("tolera falha de carregamento e permite tentar novamente na próxima navegação", () => {
    clarity.setAnalyticsConsent("granted");
    document.getElementById("microsoft-clarity")!.dispatchEvent(new Event("error"));
    expect(window.clarity).toBeUndefined();
    clarity.trackClarityEvent("trilha_criada");
    clarity.syncClarityConsent();
    expect(document.querySelectorAll("#microsoft-clarity")).toHaveLength(1);
  });
});
