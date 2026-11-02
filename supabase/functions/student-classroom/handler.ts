interface Runtime {
  url: string;
  secretKey: string;
  publishableKeys: string[];
  fetch?: typeof fetch;
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
};

export function createStudentHandler(runtime: Runtime) {
  const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json", ...(status === 429 ? { "Retry-After": "60" } : {}) } });
  return async (request: Request): Promise<Response> => {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return respond({ error: "Método indisponível." }, 405);
    if (!runtime.url || !runtime.secretKey || !runtime.publishableKeys.length) return respond({ error: "Acesso temporariamente indisponível." }, 503);
    if (!runtime.publishableKeys.includes(request.headers.get("apikey") ?? "")) return respond({ error: "Acesso inválido." }, 401);
    let code: string;
    try {
      if (Number(request.headers.get("content-length")) > 1024) return respond({ error: "Código inválido." }, 400);
      const body = await request.text();
      if (body.length > 1024) return respond({ error: "Código inválido." }, 400);
      const parsed = JSON.parse(body) as { code?: unknown };
      if (typeof parsed.code !== "string" || !/^\d{6}$/.test(parsed.code)) return respond({ error: "Código inválido." }, 400);
      code = parsed.code;
    } catch { return respond({ error: "Código inválido." }, 400); }
    try {
      // Último endereço acrescentado pelo proxy; cabeçalhos não são aceitos do formulário.
      const address = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown";
      const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${runtime.secretKey}:${address}`));
      const clientHash = [...new Uint8Array(bytes)].map((value) => value.toString(16).padStart(2, "0")).join("");
      const headers: Record<string, string> = { apikey: runtime.secretKey, "Content-Type": "application/json" };
      if (!runtime.secretKey.startsWith("sb_secret_")) headers.Authorization = `Bearer ${runtime.secretKey}`;
      const response = await (runtime.fetch ?? fetch)(`${runtime.url}/rest/v1/rpc/student_classroom`, {
        method: "POST", headers, body: JSON.stringify({ p_code: code, p_client_hash: clientHash }), signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return respond({ error: "Não foi possível consultar a turma agora." }, 503);
      const result: unknown = await response.json();
      if (result && typeof result === "object" && "error" in result) return respond({ error: "Muitas tentativas. Aguarde um momento e tente novamente." }, 429);
      if (!result) return respond({ error: "Turma indisponível. Confira o código com o professor." }, 404);
      return respond(result);
    } catch { return respond({ error: "Não foi possível consultar a turma agora." }, 503); }
  };
}
