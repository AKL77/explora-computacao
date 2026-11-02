import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchStudentClassroom } from "./StudentClassroomRepository";

vi.mock("@/lib/backend/config", () => ({ backendConfig: { url: "https://test.supabase.co", key: "sb_publishable_test" } }));
const classroom = { id: "turma", code: "123456", name: "6º A", grade: 6, school: "", schoolYear: 2026, color: "blue", archived: false, createdAt: "2026-11-02T12:00:00Z", materials: [{ resourceId: "interland", visible: true, instruction: "Comece aqui" }] };
afterEach(() => vi.unstubAllGlobals());

describe("acesso dos alunos", () => {
  it("consulta sem login, sem cookies e sem guardar o código", async () => {
    const request = vi.fn().mockResolvedValue(Response.json(classroom));
    vi.stubGlobal("fetch", request);
    expect(await fetchStudentClassroom("123456")).toEqual(classroom);
    const [url, options] = request.mock.calls[0];
    expect(url).toBe("https://test.supabase.co/functions/v1/student-classroom");
    expect(options.headers).toEqual({ apikey: "sb_publishable_test", "Content-Type": "application/json" });
    expect(options.body).toBe('{"code":"123456"}');
    expect(options.credentials).toBeUndefined();
    expect(sessionStorage.getItem("123456")).toBeNull();
  });
  it.each([404, 429, 503])("apresenta erro recuperável em resposta %s", async (status) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status })));
    await expect(fetchStudentClassroom("123456")).rejects.toMatchObject({ reason: status === 404 ? "unavailable" : status === 429 ? "rate_limited" : "network" });
  });
  it("recusa turma arquivada ou resposta com material oculto", async () => {
    const request = vi.fn().mockResolvedValueOnce(Response.json({ ...classroom, archived: true })).mockResolvedValueOnce(Response.json({ ...classroom, materials: [{ ...classroom.materials[0], visible: false }] }));
    vi.stubGlobal("fetch", request);
    await expect(fetchStudentClassroom("123456")).rejects.toMatchObject({ reason: "network" });
    await expect(fetchStudentClassroom("123456")).rejects.toMatchObject({ reason: "network" });
  });
});
