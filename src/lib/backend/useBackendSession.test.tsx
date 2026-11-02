import { StrictMode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useBackendSession, reloadWorkspace } from "./useBackendSession";
import { useSessionStore } from "@/store/useSessionStore";
import { useWorkspaceState } from "./workspaceState";
import { useClassroomsStore } from "@/store/useClassroomsStore";
import { resetWorkspace } from "./resetWorkspace";

const mock = vi.hoisted(() => ({
  user: { id: "teacher-a", email: "teacher@example.com", user_metadata: { full_name: "Professora" } },
  exchange: vi.fn().mockResolvedValue({ error: null }),
  load: vi.fn().mockResolvedValue({ classrooms: [], paths: [] }),
}));
vi.mock("./config", async (importOriginal) => ({ ...await importOriginal<typeof import("./config")>(), isOnlineMode: true, backendConfig: { mode: "supabase", url: "https://test.supabase.co", key: "sb_publishable_test" } }));
vi.mock("./client", () => ({ supabase: { auth: {
  exchangeCodeForSession: mock.exchange,
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
  getSession: async () => ({ data: { session: { user: mock.user } }, error: null }),
} } }));
vi.mock("@/repositories/TeacherWorkspaceRepository", () => ({ teacherWorkspaceRepository: { load: mock.load } }));

describe("início e encerramento da sessão docente", () => {
  it("troca o código Google só uma vez no StrictMode e abre o espaço da conta", async () => {
    window.history.replaceState(null, "", "/?code=one-use-callback#/entrar");
    const hook = renderHook(() => useBackendSession(), { wrapper: StrictMode });
    await waitFor(() => expect(useWorkspaceState.getState().status).toBe("ready"));
    expect(mock.exchange).toHaveBeenCalledTimes(1);
    expect(useSessionStore.getState()).toMatchObject({ isAuthenticated: true, user: { id: "teacher-a", name: "Professora" } });
    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("#/app/trilha-de-ensino");
    hook.unmount();
  });

  it("descarta uma leitura que termina depois de sair da conta", async () => {
    let finish!: (data: { classrooms: unknown[]; paths: unknown[] }) => void;
    mock.load.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
    act(() => resetWorkspace("teacher-a"));
    const loading = reloadWorkspace();
    act(() => resetWorkspace(null));
    finish({ classrooms: [{ name: "Não pode reaparecer" }], paths: [] });
    await act(async () => { await loading; });
    expect(useClassroomsStore.getState().classrooms).toEqual([]);
    expect(useWorkspaceState.getState()).toMatchObject({ ownerId: null, status: "idle" });
  });
});
