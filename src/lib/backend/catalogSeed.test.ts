// @vitest-environment node
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { resources } from "@/data/resources.mock";

it("mantém o registro de IDs do banco alinhado ao catálogo publicado", () => {
  const seed = readFileSync(new URL("../../../supabase/seed.sql", import.meta.url), "utf8");
  const registered = [...seed.matchAll(/\('([a-z0-9-]+)'\)/g)].map((match) => match[1]).sort();
  expect(registered).toEqual(resources.map((resource) => resource.id).sort());
});
