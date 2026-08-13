import { describe, expect, it } from "vitest";

import { resources } from "@/data/resources.mock";
import type { Resource } from "@/domain/resource";
import { LocalCatalogRepository } from "@/repositories/LocalCatalogRepository";

describe("LocalCatalogRepository", () => {
  it("lista cópias dos recursos em ordem alfabética", async () => {
    const zeta: Resource = {
      ...structuredClone(resources[0]),
      id: "zeta",
      slug: "zeta",
      title: "Zeta",
    };
    const alfa: Resource = {
      ...structuredClone(resources[0]),
      id: "alfa",
      slug: "alfa",
      title: "Árvore",
    };
    const repository = new LocalCatalogRepository([zeta, alfa]);

    const result = await repository.list();

    expect(result.map((resource) => resource.id)).toEqual(["alfa", "zeta"]);
    expect(result[0]).not.toBe(alfa);
    expect(result[0]?.curriculum).not.toBe(alfa.curriculum);
  });

  it("encontra por slug e não expõe a fixture para mutação", async () => {
    const repository = new LocalCatalogRepository();

    const firstRead = await repository.getBySlug("altinovare-cyberbullying");
    expect(firstRead).not.toBeNull();

    if (!firstRead) {
      throw new Error("Fixture esperada não foi encontrada.");
    }

    firstRead.tags.push("tag criada no consumidor");

    const secondRead = await repository.getBySlug("altinovare-cyberbullying");
    expect(secondRead?.tags).not.toContain("tag criada no consumidor");
  });

  it("retorna null quando o slug não existe", async () => {
    const repository = new LocalCatalogRepository();

    await expect(repository.getBySlug("inexistente")).resolves.toBeNull();
  });
});
