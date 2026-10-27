export type AnalyticsConsent = "granted" | "denied" | null;

export const ANALYTICS_CONSENT_KEY = "explora:analytics-consent:v1";
const CONSENT_CHANGED = "explora:analytics-consent-changed";
const DEFAULT_PROJECT_ID = "z4honwtjtg";

interface ClarityCommand {
  (...args: unknown[]): void;
  q?: unknown[][];
}

declare global {
  interface Window {
    clarity?: ClarityCommand;
  }
}

let sessionConsent: AnalyticsConsent | undefined;
let active = false;
let lastPage: string | null = null;

function projectId(): string {
  return (import.meta.env.VITE_CLARITY_PROJECT_ID ?? DEFAULT_PROJECT_ID).trim();
}

export function isClarityConfigured(): boolean {
  return import.meta.env.PROD && /^[a-z0-9]+$/i.test(projectId());
}

export function getAnalyticsConsent(): AnalyticsConsent {
  // Preserve a refusal across a reload even if browser storage became read-only.
  if (new URL(window.location.href).searchParams.get("analytics") === "off") return "denied";
  if (sessionConsent !== undefined) return sessionConsent;
  try {
    const value = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function subscribeAnalyticsConsent(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === ANALYTICS_CONSENT_KEY || event.key === null) {
      sessionConsent = undefined;
      syncClarityConsent();
      listener();
    }
  };
  window.addEventListener(CONSENT_CHANGED, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CONSENT_CHANGED, listener);
    window.removeEventListener("storage", onStorage);
  };
}

function sendConsent(granted: boolean) {
  window.clarity?.("consentv2", {
    analytics_Storage: granted ? "granted" : "denied",
    ad_Storage: "denied",
  });
}

function stopClarity() {
  active = false;
  lastPage = null;
  try {
    sendConsent(false);
    window.clarity?.("stop");
  } finally {
    // Consent denial can restart the SDK in cookieless mode. A fresh document
    // guarantees capture stops, including a tag still downloading at withdrawal.
    let refusalPersisted = false;
    try {
      refusalPersisted = localStorage.getItem(ANALYTICS_CONSENT_KEY) !== "granted";
    } catch {
      // Add a URL safeguard when a previous acceptance cannot be overwritten.
    }
    if (refusalPersisted) {
      window.location.reload();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set("analytics", "off");
      window.location.replace(url.href);
    }
  }
}

export function syncClarityConsent(): void {
  if (!isClarityConfigured() || getAnalyticsConsent() !== "granted") {
    if (active) stopClarity();
    return;
  }
  if (active) return;
  active = true;

  const queue: ClarityCommand = (...args) => {
    (queue.q ??= []).push(args);
  };
  window.clarity = queue;
  sendConsent(true);

  const script = document.createElement("script");
  script.id = "microsoft-clarity";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId()}`;
  script.onerror = () => {
    script.remove();
    active = false;
    lastPage = null;
    delete window.clarity;
  };
  document.head.appendChild(script);
}

export function setAnalyticsConsent(consent: Exclude<AnalyticsConsent, null>): void {
  sessionConsent = consent;
  try {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
  } catch {
    // The current choice still works when browser storage is unavailable.
  }
  if (consent === "granted") {
    const url = new URL(window.location.href);
    if (url.searchParams.get("analytics") === "off") {
      url.searchParams.delete("analytics");
      window.history.replaceState(window.history.state, "", url.href);
    }
  }
  syncClarityConsent();
  window.dispatchEvent(new Event(CONSENT_CHANGED));
}

type ClarityEvent =
  | "material_selecionado"
  | "material_adicionado_trilha"
  | "trilha_criada"
  | "trilha_atualizada"
  | "trilha_pronta_adicionada"
  | "fonte_material_aberta";

export function trackClarityEvent(event: ClarityEvent): void {
  if (active && getAnalyticsConsent() === "granted") window.clarity?.("event", event);
}

const pages: Record<string, string> = {
  "/": "inicio",
  "/app/trilha-de-ensino": "buscar_materiais",
  "/app/trilhas-prontas": "trilhas_prontas",
  "/app/minhas-trilhas": "minhas_trilhas",
  "/app/perfil": "perfil",
  "/app/sobre": "sobre",
  "/privacidade": "privacidade",
};

export function trackClarityPage(pathname: string): void {
  if (!active || getAnalyticsConsent() !== "granted") return;
  // HashRouter navigation needs explicit tags. Never send free text or queries.
  const page = pages[pathname] ?? (pathname.startsWith("/app/materiais/") ? "material" : null);
  if (!page || pathname === lastPage) return;
  lastPage = pathname;
  window.clarity?.("set", "pagina", page);
  window.clarity?.("event", `pagina_${page}`);
}
