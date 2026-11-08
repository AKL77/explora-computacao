import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { useSessionStore } from "@/store/useSessionStore";
import { useClassroomsStore } from "@/store/useClassroomsStore";
import { useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import { teacherWorkspaceRepository } from "@/repositories/TeacherWorkspaceRepository";
import { AUTH_STORAGE_KEY, backendConfig, isOnlineMode } from "./config";
import { supabase } from "./client";
import { teacherAuthStorage } from "./authStorage";
import { resetWorkspace } from "./resetWorkspace";
import { useWorkspaceState } from "./workspaceState";

// O código OAuth só pode ser trocado uma vez, inclusive com StrictMode no desenvolvimento.
let callbackExchange: Promise<void> | undefined;

function completeAuthCallback() {
  if (callbackExchange) return callbackExchange;
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const authError = url.searchParams.get("error") || (url.hash.startsWith("#error=") ? "oauth" : null);
  if (!code && !authError) return Promise.resolve();
  callbackExchange = (async () => {
    const failure = code ? (await supabase!.auth.exchangeCodeForSession(code)).error : authError;
    for (const key of ["code", "error", "error_description", "error_code", "auth"]) url.searchParams.delete(key);
    url.hash = failure ? "/entrar" : "/app/trilha-de-ensino";
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
    if (failure) throw failure;
  })();
  return callbackExchange;
}

export async function reloadWorkspace() {
  const state = useWorkspaceState.getState();
  if (!state.ownerId || state.pending) return;
  useWorkspaceState.setState({ status: "loading", error: "" });
  try {
    const data = await teacherWorkspaceRepository.load();
    if (useWorkspaceState.getState().generation !== state.generation) return;
    useClassroomsStore.setState({ classrooms: data.classrooms, retiredCodes: [] });
    useTeachingPathsStore.setState({ paths: data.paths });
    useWorkspaceState.setState({ status: "ready" });
  } catch {
    if (useWorkspaceState.getState().generation === state.generation) useWorkspaceState.setState({ status: "error", error: "Não foi possível carregar seus dados online. Verifique a conexão e tente novamente." });
  }
}

function applyUser(user: User | null) {
  const owner = useWorkspaceState.getState().ownerId;
  if (owner !== (user?.id ?? null)) resetWorkspace(user?.id ?? null);
  useSessionStore.setState({
    isAuthenticated: Boolean(user), status: "ready",
    user: user ? { id: user.id, email: user.email ?? "", name: String(user.user_metadata.full_name ?? user.user_metadata.name ?? "Professor") } : null,
  });
}

export function useBackendSession() {
  useEffect(() => {
    if (!isOnlineMode) return;
    if (!supabase || backendConfig.mode === "invalid") {
      useSessionStore.setState({ status: "ready", isAuthenticated: false, error: "A conexão da plataforma ainda não foi configurada corretamente." });
      return;
    }
    const client = supabase;
    let active = true;
    const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
      // Eventos de outra aba só se aplicam quando ela compartilha a mesma sessão.
      if (active && teacherAuthStorage.matchesSession(session?.access_token)) applyUser(session?.user ?? null);
    });
    const syncStoredSession = async () => {
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      if (active && teacherAuthStorage.matchesSession(data.session?.access_token)) applyUser(data.session?.user ?? null);
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage || (event.key !== AUTH_STORAGE_KEY && event.key !== null)) return;
      // O aviso do SDK pode chegar antes da atualização do armazenamento desta aba.
      // Releia a sessão escolhida; sessões restritas à aba continuam independentes.
      void syncStoredSession().catch(() => undefined);
    };
    window.addEventListener("storage", handleStorage);
    const start = async () => {
      try {
        await completeAuthCallback();
        await syncStoredSession();
      } catch {
        if (active) {
          applyUser(null);
          useSessionStore.setState({ error: "Não foi possível concluir a entrada. Tente novamente com sua conta Google." });
        }
      }
    };
    void start();
    // Carregar dados fora do callback do SDK evita bloquear a renovação da sessão.
    const unsubscribe = useWorkspaceState.subscribe((next, previous) => {
      if (next.ownerId && next.generation !== previous.generation) queueMicrotask(() => { if (active) void reloadWorkspace(); });
    });
    if (useWorkspaceState.getState().ownerId) void reloadWorkspace();
    return () => { active = false; window.removeEventListener("storage", handleStorage); subscription.subscription.unsubscribe(); unsubscribe(); };
  }, []);
}
