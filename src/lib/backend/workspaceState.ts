import { create } from "zustand";

export type MaybePromise<T> = T | Promise<T>;

interface WorkspaceState {
  ownerId: string | null;
  generation: number;
  status: "idle" | "loading" | "ready" | "error";
  pending: number;
  error: string;
}

export const useWorkspaceState = create<WorkspaceState>(() => ({ ownerId: null, generation: 0, status: "idle", pending: 0, error: "" }));

export function backendError(error: unknown): string {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  if (code === "40001") return "Este conteúdo foi alterado em outro acesso. Atualize os dados e tente novamente.";
  if (code === "42501" || code === "PGRST301") return "Seu acesso não permite esta ação. Entre novamente para continuar.";
  if (code === "PGRST202") return "Este recurso ainda não está disponível online. Aguarde a atualização da plataforma.";
  return "Não foi possível confirmar a ação online. Verifique sua conexão e tente novamente. Suas alterações ainda não foram confirmadas.";
}

export async function remoteMutation<T>(operation: () => Promise<T>, apply: (value: T) => void, fallback: T): Promise<T> {
  const start = useWorkspaceState.getState();
  if (!start.ownerId || start.status !== "ready" || start.pending > 0) return fallback;
  useWorkspaceState.setState({ pending: 1, error: "" });
  try {
    const value = await operation();
    if (useWorkspaceState.getState().generation !== start.generation) return fallback;
    apply(value);
    return value;
  } catch (error) {
    if (useWorkspaceState.getState().generation === start.generation) useWorkspaceState.setState({ error: backendError(error) });
    return fallback;
  } finally {
    if (useWorkspaceState.getState().generation === start.generation) useWorkspaceState.setState({ pending: 0 });
  }
}
