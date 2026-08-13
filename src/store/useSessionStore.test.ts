import { beforeEach, describe, expect, it } from "vitest";

import { SESSION_STORAGE_KEY, useSessionStore } from "./useSessionStore";

describe("useSessionStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useSessionStore.setState({ isAuthenticated: false });
  });

  it("inicia e encerra uma sessão demonstrativa sem dados pessoais", () => {
    useSessionStore.getState().signIn();
    expect(useSessionStore.getState().isAuthenticated).toBe(true);

    useSessionStore.getState().signOut();
    expect(useSessionStore.getState().isAuthenticated).toBe(false);
  });

  it("persiste somente o estado mínimo da sessão", () => {
    useSessionStore.getState().signIn();

    const persistedValue = localStorage.getItem(SESSION_STORAGE_KEY);
    expect(persistedValue).not.toBeNull();
    expect(JSON.parse(persistedValue ?? "{}")).toMatchObject({
      state: { isAuthenticated: true },
      version: 1,
    });
  });
});
