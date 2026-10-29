import { describe, expect, it } from "vitest";

import { resources } from "@/data/resources.mock";
import { getTeachingResourceMetadata } from "@/features/teaching-paths/data/pilotTeachingResources";

describe("Compute It em português", () => {
  it("fixa o português em todos os acessos ao jogo sem depender do idioma do navegador", () => {
    const game = resources.find(({ id }) => id === "toxicode-compute-it")!;
    const gameLinks = [game.sourceUrl, game.canonicalUrl!, ...game.supplementaryLinks!.map(({ url }) => url)]
      .filter((url) => new URL(url).pathname === "/");
    expect(gameLinks.length).toBeGreaterThanOrEqual(2);
    for (const link of gameLinks) {
      expect(new URL(link).hostname).toBe("compute-it.toxicode.fr");
      expect(new URL(link).searchParams.get("lang")).toBe("pt");
    }
    const teaching = getTeachingResourceMetadata(game);
    expect(teaching.activityMode).toBe("plugged");
    expect(teaching.studentActivity).toContain("executam os comandos em português");
    expect(game.curriculum.alignments[0].mapping.strength).toBe("partial");
  });
});
