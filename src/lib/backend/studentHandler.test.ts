// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createStudentHandler } from "../../../supabase/functions/student-classroom/handler";

const url = "https://test.supabase.co";
const key = "sb_publishable_test";
const secretKey = "sb_secret_test";
const request = (body: unknown, apikey = key) => new Request(`${url}/functions/v1/student-classroom`, { method: "POST", headers: { apikey, "Content-Type": "application/json", "x-forwarded-for": "192.0.2.10" }, body: JSON.stringify(body) });

describe("serviço público das turmas", () => {
  it("valida método, chave e código antes de consultar o banco", async () => {
    const fetch = vi.fn();
    const handler = createStudentHandler({ url, secretKey, publishableKeys: [key], fetch });
    expect((await handler(new Request(url, { method: "OPTIONS" }))).status).toBe(204);
    expect((await handler(new Request(url))).status).toBe(405);
    expect((await handler(request({ code: "123456" }, "wrong")))).toHaveProperty("status", 401);
    expect((await handler(request({ code: "abc" })))).toHaveProperty("status", 400);
    expect((await handler(request({ code: "1".repeat(2000) })))).toHaveProperty("status", 400);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("mantém a chave de serviço no servidor e envia só um hash do endereço ao banco", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ id: "classroom", materials: [] }));
    const handler = createStudentHandler({ url, secretKey, publishableKeys: [key], fetch });
    const response = await handler(request({ code: "123456" }));
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.text()).not.toContain(secretKey);
    const [, options] = fetch.mock.calls[0];
    expect(options.headers.apikey).toBe(secretKey);
    expect(options.body).not.toContain("192.0.2.10");
    expect(JSON.parse(options.body)).toEqual({ p_code: "123456", p_client_hash: expect.stringMatching(/^[a-f0-9]{64}$/) });
  });
  it("retorna indisponibilidade e limite sem expor mensagens internas", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(Response.json(null)).mockResolvedValueOnce(Response.json({ error: "rate_limited" })).mockResolvedValueOnce(new Response("secret database details", { status: 500 }));
    const handler = createStudentHandler({ url, secretKey, publishableKeys: [key], fetch });
    expect((await handler(request({ code: "123456" }))).status).toBe(404);
    const limited = await handler(request({ code: "123456" }));
    expect(limited.status).toBe(429); expect(limited.headers.get("Retry-After")).toBe("60");
    const failure = await handler(request({ code: "123456" }));
    expect(failure.status).toBe(503); expect(await failure.text()).not.toContain("secret database");
  });
});
