import { describe, expect, it } from "vitest";

import { getMaterialKeywordIds } from "@/data/materialKeywords";
import { resources } from "@/data/resources.mock";
import { getTeachingResourceMetadata } from "@/features/teaching-paths/data/pilotTeachingResources";
import { filterResources } from "@/lib/catalogFilters";

import { approvedMaterialsOctober28 } from "./approvedMaterialsOctober28";

describe("materiais aprovados em 28 de outubro", () => {
  it("integra os cinco cadastros à busca, aos assuntos e às propostas das trilhas", () => {
    expect(approvedMaterialsOctober28).toHaveLength(5);
    for (const addition of approvedMaterialsOctober28) {
      const resource = resources.find(({ id }) => id === addition.id)!;
      const metadata = getTeachingResourceMetadata(resource);
      expect(filterResources(resources, { query: resource.title }).map(({ id }) => id)).toContain(resource.id);
      expect(resource.requiredFamiliarity).toBeDefined();
      expect(getMaterialKeywordIds(resource.id).length).toBeGreaterThan(0);
      expect(metadata.objective).toBe(resource.pedagogy.learningObjective);
      expect(metadata.studentActivity.length).toBeLessThan(resource.pedagogy.applicationProposal!.length);
      expect(metadata.materials.length).toBeGreaterThan(0);
      expect(resource.curriculum.alignments.every(({ mapping }) => mapping.kind === "curatorial" && mapping.validationStatus === "pending")).toBe(true);
      expect(resource.pedagogy.estimatedDuration).toBeUndefined();
    }
  });

  it("mantém complementos no Guardião e distingue o código original de Língua Portuguesa", () => {
    expect(resources.filter(({ id }) => id.startsWith("certbr-guardiao"))).toHaveLength(1);
    const guardian = resources.find(({ id }) => id === "certbr-guardiao-cibernetico")!;
    expect(guardian.supplementaryLinks?.filter(({ label }) => label.startsWith("Fascículo complementar"))).toHaveLength(4);
    expect(getTeachingResourceMetadata(guardian).teachingApproach).toBe("expository");
    const fakeNews = resources.find(({ id }) => id === "sme-goiania-as-fake-news")!;
    expect(fakeNews.additionalInformation).toContain("EF09LP01");
    expect(filterResources([fakeNews], { grades: [9], skills: ["EF09CO10"] })).toHaveLength(1);
    expect(filterResources([fakeNews], { grades: [8], skills: ["EF09CO10"] })).toHaveLength(0);
    expect(fakeNews.image).toBeUndefined();
    expect(fakeNews.provenance.license).toBeUndefined();
  });

  it("leva os preparativos dos jogos e a correção histórica às propostas", () => {
    const splash = resources.find(({ id }) => id === "ufsc-splashcode")!;
    const board = resources.find(({ id }) => id === "nicbr-tabuleiro-seguranca-online")!;
    for (const game of [splash, board]) {
      const metadata = getTeachingResourceMetadata(game);
      expect(metadata.activityMode).toBe("unplugged");
      expect(metadata.teachingApproach).toBe("active");
      expect(metadata.materials.join(" ")).toMatch(/impress/);
    }
    const evolution = resources.find(({ id }) => id === "computacional-evolucao-computacao")!;
    expect(evolution.additionalInformation).toContain("o que está incorreto");
    expect(getTeachingResourceMetadata(evolution).studentActivity).toContain("colaboradora de Babbage");
  });
});
