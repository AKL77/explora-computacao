import { describe, expect, it } from "vitest";

import { getMaterialKeywordIds } from "@/data/materialKeywords";
import { resources } from "@/data/resources.mock";
import { filterResources } from "@/lib/catalogFilters";
import { getTeachingResourceMetadata } from "@/features/teaching-paths/data/pilotTeachingResources";

import { additionalTeachingMaterials } from "./additionalTeachingMaterials";

function find(id: string) {
  const resource = resources.find((item) => item.id === id);
  if (!resource) throw new Error(`Material não encontrado: ${id}`);
  return resource;
}

describe("ampliação de outubro do catálogo", () => {
  it("integra os sete materiais à busca, aos assuntos, à familiaridade e às propostas das trilhas", () => {
    expect(additionalTeachingMaterials).toHaveLength(7);
    for (const addition of additionalTeachingMaterials) {
      const resource = find(addition.id);
      const teaching = getTeachingResourceMetadata(resource);
      expect(resource.requiredFamiliarity).toBeDefined();
      expect(getMaterialKeywordIds(resource.id).length).toBeGreaterThan(0);
      expect(teaching.grades).toEqual(resource.recommendedGrades);
      expect(teaching.objective).not.toBe("");
      expect(teaching.studentActivity).not.toBe("");
      expect(teaching.materials.length).toBeGreaterThan(0);
      expect(resource.curriculum.alignments.every(({ mapping }) =>
        mapping.kind === "curatorial" && mapping.validationStatus === "pending",
      )).toBe(true);
    }
  });

  it("preserva os anos amplos da fonte sem misturar habilidade de outro ano no filtro curricular", () => {
    const gates = find("computacional-portas-logicas");
    expect(gates.recommendedGrades).toContain(4);
    expect(filterResources([gates], { grades: [5], skills: ["EF05CO03"] })).toHaveLength(1);
    expect(filterResources([gates], { grades: [4], skills: ["EF05CO03"] })).toHaveLength(0);
    const automata = find("computacional-automatos-monica");
    expect(automata.curriculum.alignments.find(({ grade }) => grade === 9)?.mapping.strength)
      .toBe("partial");
  });

  it("usa a atividade de repetição correta e conserva durações e licenças ausentes", () => {
    const tetris = find("computacional-tetris-repeticao");
    expect(tetris.sourceUrl).toContain("09-Tetris2-repeticao.zip");
    expect(tetris.pedagogy.estimatedDuration).toBeUndefined();
    expect(find("codeorg-ia-oceanos").pedagogy.estimatedDuration).toBe("45 min");
    expect(find("microbit-cracha").requirements.accountRequired).toBeUndefined();
    const automata = find("computacional-automatos-monica");
    expect(automata.provenance.license).toBeUndefined();
    expect(automata.image).toBeUndefined();
    expect(find("nicbr-internet-responsa-adolescentes").provenance.license).toContain("CC BY-ND");
  });

  it("distingue o simulador da placa e a leitura impressa da leitura digital", () => {
    expect(getTeachingResourceMetadata(find("microbit-cracha")).activityMode).toBe("plugged");
    expect(getTeachingResourceMetadata(find("nicbr-internet-responsa-adolescentes")))
      .toMatchObject({ activityMode: "mixed", teachingApproach: "expository" });
    for (const id of ["computacional-bugs", "computacional-tetris-repeticao", "computacional-automatos-monica", "computacional-portas-logicas"]) {
      expect(getTeachingResourceMetadata(find(id))).toMatchObject({ activityMode: "unplugged", teachingApproach: "active" });
    }
  });
});
