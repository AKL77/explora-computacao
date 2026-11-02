import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createStudentHandler } from "./handler.ts";

const parseKeys = (value: string | undefined): string[] => {
  try { return Object.values(JSON.parse(value ?? "{}")); } catch { return []; }
};
const secrets = parseKeys(Deno.env.get("SUPABASE_SECRET_KEYS"));
const publishable = parseKeys(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS"));
Deno.serve(createStudentHandler({
  url: Deno.env.get("SUPABASE_URL") ?? "",
  secretKey: secrets[0] ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  publishableKeys: publishable.length ? publishable : [Deno.env.get("SUPABASE_ANON_KEY") ?? ""].filter(Boolean),
}));
