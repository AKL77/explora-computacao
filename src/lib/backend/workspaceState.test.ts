import { beforeEach, describe, expect, it, vi } from "vitest";
import { remoteMutation, useWorkspaceState } from "./workspaceState";

beforeEach(() => useWorkspaceState.setState({ ownerId: "teacher-a", generation: 1, status: "ready", pending: 0, error: "" }));

describe("confirmação de gravações online", () => {
  it("não aplica resposta de um professor depois de trocar a conta", async () => {
    let finish!: (value: string) => void;
    const apply = vi.fn();
    const saving = remoteMutation(() => new Promise<string>((resolve) => { finish = resolve; }), apply, "");
    useWorkspaceState.setState({ ownerId: "teacher-b", generation: 2, pending: 0 });
    finish("dado privado do professor A");
    expect(await saving).toBe("");
    expect(apply).not.toHaveBeenCalled();
    expect(useWorkspaceState.getState().ownerId).toBe("teacher-b");
  });
  it("preserva os dados confirmados e explica um conflito de edição", async () => {
    const apply = vi.fn();
    expect(await remoteMutation(() => Promise.reject({ code: "40001" }), apply, false)).toBe(false);
    expect(apply).not.toHaveBeenCalled();
    expect(useWorkspaceState.getState()).toMatchObject({ pending: 0, error: expect.stringContaining("outro acesso") });
  });
  it("impede gravações simultâneas e novas gravações sem sessão", async () => {
    let finish!: (value: boolean) => void;
    const first = remoteMutation(() => new Promise<boolean>((resolve) => { finish = resolve; }), vi.fn(), false);
    const secondOperation = vi.fn();
    expect(await remoteMutation(secondOperation, vi.fn(), false)).toBe(false);
    expect(secondOperation).not.toHaveBeenCalled();
    finish(true); await first;
    useWorkspaceState.setState({ ownerId: null, status: "idle" });
    expect(await remoteMutation(secondOperation, vi.fn(), false)).toBe(false);
    expect(secondOperation).not.toHaveBeenCalled();
  });
});
