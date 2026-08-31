import { describe, expect, it } from "vitest";

import { resources } from "@/data/resources.mock";
import type { Resource } from "@/domain/resource";
import {
  filterResources,
  getAvailableGrades,
  getAvailableSkills,
  normalizeSearchText,
  searchResources,
} from "@/lib/catalogFilters";

function createResource(
  overrides: Pick<Resource, "id" | "slug" | "title" | "recommendedGrades"> &
    Partial<Resource>,
): Resource {
  return {
    ...structuredClone(resources[0]),
    ...overrides,
  };
}

describe("normalizeSearchText", () => {
  it("ignora acentos, caixa e espaços excedentes", () => {
    expect(normalizeSearchText("  SIMULAÇÃO   Educativa  ")).toBe(
      "simulacao educativa",
    );
  });
});

describe("searchResources", () => {
  it.each([
    "cyberbullying",
    "simulacao",
    "jogo",
    "ALT+INOVARE",
    "EF07CO09",
    "reconhecer debater",
  ])("encontra o recurso por %s", (query) => {
    expect(searchResources(resources, query)).toContain(resources[0]);
  });

  it("exige que todos os termos da consulta estejam presentes", () => {
    expect(searchResources(resources, "cyberbullying inexistente")).toEqual([]);
  });
});

describe("filterResources", () => {
  const eighthGradeResource = createResource({
    id: "recurso-oitavo",
    slug: "recurso-oitavo",
    title: "Recurso do oitavo ano",
    recommendedGrades: [8],
    curriculum: {
      alignments: [
        {
          ...structuredClone(resources[0].curriculum.alignments[0]),
          grade: 8,
          axis: "Pensamento Computacional",
          skill: {
            code: "EF08CO01",
            officialText: "Habilidade de teste do oitavo ano.",
            sourceEdition: "Edição de teste",
            sourceUrl: "https://example.test/bncc",
            validationStatus: "validated",
          },
        },
      ],
    },
  });
  const catalog = [resources[0], eighthGradeResource];

  it("usa união entre opções do mesmo filtro", () => {
    expect(filterResources(catalog, { grades: [7, 8] })).toHaveLength(2);
    expect(
      filterResources(catalog, { skills: ["EF07CO09", "EF08CO01"] }),
    ).toHaveLength(2);
  });

  it("usa interseção entre busca, turma e habilidade", () => {
    expect(
      filterResources(catalog, {
        query: "cyberbullying",
        grades: [7],
        skills: ["ef07co09"],
      }),
    ).toEqual([resources[0]]);

    expect(
      filterResources(catalog, {
        query: "cyberbullying",
        grades: [8],
        skills: ["EF07CO09"],
      }),
    ).toEqual([]);
  });

  it("não altera o catálogo recebido", () => {
    const originalOrder = catalog.map((resource) => resource.id);

    filterResources(catalog, { grades: [8] });

    expect(catalog.map((resource) => resource.id)).toEqual(originalOrder);
  });

  it("não cruza a habilidade de um ano com outro ano do mesmo recurso", () => {
    const battleShip = resources.find(
      (resource) => resource.id === "unicamp-desplugada-atividade-6",
    );
    expect(battleShip).toBeDefined();

    expect(
      filterResources([battleShip!], {
        grades: [5],
        skills: ["EF08CO03"],
      }),
    ).toEqual([]);
    expect(
      filterResources([battleShip!], {
        grades: [8],
        skills: ["EF08CO03"],
      }),
    ).toEqual([battleShip]);
  });

  it("filtra por todas as turmas aplicáveis mesmo sem alinhamento naquele ano", () => {
    const colorindo = resources.find(
      (resource) => resource.id === "unicamp-desplugada-atividade-2",
    );
    expect(colorindo).toBeDefined();

    expect(filterResources([colorindo!], { grades: [5] })).toEqual([colorindo]);
  });
});

describe("opções disponíveis", () => {
  const duplicateSkillResource = createResource({
    id: "duplicado",
    slug: "duplicado",
    title: "Duplicado",
    recommendedGrades: [9, 6, 7, 5, 4],
  });

  it("retorna turmas únicas e ordenadas", () => {
    expect(getAvailableGrades([resources[0], duplicateSkillResource])).toEqual([
      4, 5, 6, 7, 9,
    ]);
  });

  it("retorna habilidades únicas por código", () => {
    const skills = getAvailableSkills([resources[0], duplicateSkillResource]);

    expect(skills).toHaveLength(1);
    expect(skills[0]?.code).toBe("EF07CO09");
    expect(skills[0]).not.toBe(
      resources[0]?.curriculum.alignments[0]?.skill,
    );
  });
});
