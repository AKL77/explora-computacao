import { beforeEach, describe, expect, it } from "vitest";
import { AUTH_STORAGE_KEY } from "./config";
import { createTeacherAuthStorage, REMEMBER_DEVICE_KEY } from "./authStorage";

describe("armazenamento da sessão docente", () => {
  beforeEach(() => { sessionStorage.clear(); localStorage.clear(); });

  it("mantém a sessão e o verificador PKCE somente na aba sem consentimento", () => {
    const storage = createTeacherAuthStorage(sessionStorage, localStorage);
    storage.setRememberDevice(false);
    storage.setItem(AUTH_STORAGE_KEY, "sessão");
    storage.setItem(`${AUTH_STORAGE_KEY}-code-verifier-flow`, "verificador");
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(`${AUTH_STORAGE_KEY}-code-verifier-flow`)).toBeNull();
    expect(createTeacherAuthStorage(sessionStorage, localStorage).getItem(AUTH_STORAGE_KEY)).toBe("sessão");
    sessionStorage.clear();
    expect(createTeacherAuthStorage(sessionStorage, localStorage).getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it("restaura a sessão e o PKCE em outra visita quando o dispositivo foi lembrado", () => {
    const storage = createTeacherAuthStorage(sessionStorage, localStorage);
    storage.setRememberDevice(true);
    storage.setItem(AUTH_STORAGE_KEY, "sessão");
    storage.setItem(`${AUTH_STORAGE_KEY}-code-verifier-flow`, "verificador");
    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    sessionStorage.clear();
    const reopened = createTeacherAuthStorage(sessionStorage, localStorage);
    expect(reopened.getItem(AUTH_STORAGE_KEY)).toBe("sessão");
    expect(reopened.getItem(`${AUTH_STORAGE_KEY}-code-verifier-flow`)).toBe("verificador");
    expect(reopened.remembersDevice()).toBe(true);
  });

  it("preserva uma sessão antiga da aba quando outro login é lembrado no dispositivo", () => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ access_token: "aba" }));
    localStorage.setItem(REMEMBER_DEVICE_KEY, "true");
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ access_token: "dispositivo" }));
    const storage = createTeacherAuthStorage(sessionStorage, localStorage);
    expect(storage.matchesSession("aba")).toBe(true);
    expect(storage.matchesSession("dispositivo")).toBe(false);
    expect(storage.matchesSession(undefined)).toBe(false);
  });

  it("desmarcar a opção conserva a escolha durante o retorno do Google", () => {
    const storage = createTeacherAuthStorage(sessionStorage, localStorage);
    storage.setRememberDevice(true);
    storage.setRememberDevice(false);
    storage.setItem(AUTH_STORAGE_KEY, "sessão da aba");
    localStorage.setItem(REMEMBER_DEVICE_KEY, "true");
    expect(createTeacherAuthStorage(sessionStorage, localStorage).getItem(AUTH_STORAGE_KEY)).toBe("sessão da aba");
  });

  it("limpa credenciais e verificadores do login lembrado e preserva outras preferências", () => {
    const storage = createTeacherAuthStorage(sessionStorage, localStorage);
    storage.setRememberDevice(true);
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ access_token: "dispositivo" }));
    storage.setItem(`${AUTH_STORAGE_KEY}-user`, "usuário");
    storage.setItem(`${AUTH_STORAGE_KEY}-code-verifier-flow`, "verificador");
    localStorage.setItem("explora:analytics-consent:v1", "denied");
    sessionStorage.clear();
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ access_token: "aba independente" }));
    const independent = createTeacherAuthStorage(sessionStorage, localStorage);
    storage.clearSession();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(`${AUTH_STORAGE_KEY}-user`)).toBeNull();
    expect(localStorage.getItem(`${AUTH_STORAGE_KEY}-code-verifier-flow`)).toBeNull();
    expect(localStorage.getItem("explora:analytics-consent:v1")).toBe("denied");
    expect(storage.matchesSession(undefined)).toBe(true);
    // Uma aba com sessão própria não recebe o encerramento de outra sessão.
    expect(independent.matchesSession(undefined)).toBe(false);
  });
});
