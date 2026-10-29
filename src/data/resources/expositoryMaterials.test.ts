import { describe, expect, it } from "vitest";

import { getMaterialKeywordIds } from "@/data/materialKeywords";
import { resources } from "@/data/resources.mock";
import { getTeachingResourceMetadata } from "@/features/teaching-paths/data/pilotTeachingResources";
import { filterResources } from "@/lib/catalogFilters";

import { expositoryMaterials } from "./expositoryMaterials";

describe("materiais expositivos aprovados", () => {
  it("integra os quatro materiais à busca, aos assuntos e às propostas expositivas", () => {
    expect(expositoryMaterials).toHaveLength(4);
    for (const addition of expositoryMaterials) {
      const resource = resources.find(({ id }) => id === addition.id)!;
      expect(filterResources(resources, { query: resource.title })).toContain(resource);
      expect(getMaterialKeywordIds(resource.id).length).toBeGreaterThan(0);
      expect(resource.requiredFamiliarity).toBeDefined();
      const metadata = getTeachingResourceMetadata(resource);
      expect(metadata.teachingApproach).toBe("expository");
      if (resource.type === "video") expect(metadata.activityMode).toBe("plugged");
      expect(metadata.studentActivity.length).toBeLessThan(resource.pedagogy.applicationProposal!.length);
      for (const alignment of resource.curriculum.alignments) {
        expect(resource.recommendedGrades).toContain(alignment.grade);
        expect(alignment.mapping.validationStatus).toBe("pending");
      }
    }
    expect(filterResources(resources, { grades: [7], skills: ["EF07CO10"] }).map(({ id }) => id))
      .toContain("sme-goiania-tecnologia-vida-humana");
  });

  it("mantém a playlist oficial como um único cadastro com os quatro episódios complementares", () => {
    const playlistUrl = "https://www.youtube.com/playlist?list=PLQq8-9yVHyOYMFAc9v7Yb_cqmNMksEdrk";
    const playlist = resources.find(({ id }) => id === "nicbr-como-funciona-internet-playlist")!;
    expect(resources.filter(({ sourceUrl }) => sourceUrl === playlistUrl)).toHaveLength(1);
    expect(playlist.sourceUrl).toBe(playlistUrl);
    expect(playlist.supplementaryLinks?.filter(({ label }) => label.startsWith("Parte "))).toHaveLength(4);
    const episodeUrls = playlist.supplementaryLinks!
      .filter(({ label }) => label.startsWith("Parte ")).map(({ url }) => url);
    expect(resources.filter(({ sourceUrl }) => episodeUrls.includes(sourceUrl))).toHaveLength(0);
    expect(playlist.pedagogy.estimatedDuration).toContain("26 min 35 s");
    expect(resources.some(({ provider }) => provider.includes("EducaMídia"))).toBe(false);
  });
});
