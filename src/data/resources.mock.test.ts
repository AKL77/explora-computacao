import { describe, expect, it } from "vitest";

import { resources } from "@/data/resources.mock";

describe("resources fixture", () => {
  it("mantém somente o jogo de cyberbullying aprovado para o catálogo inicial", () => {
    expect(resources).toHaveLength(1);
    expect(resources[0]).toMatchObject({
      id: "altinovare-cyberbullying",
      slug: "altinovare-cyberbullying",
      title: "Cyberbullying — Jogo Educativo",
      provider: "ALT+INOVARE",
      type: "game",
      recommendedGrades: [7],
      curriculum: {
        axis: "Cultura Digital",
        knowledgeObject:
          "Segurança e responsabilidade no uso da tecnologia — Cyberbullying",
        skills: [
          {
            code: "EF07CO09",
            officialText: "Reconhecer e debater sobre cyberbullying.",
            validationStatus: "validated",
          },
        ],
      },
      pedagogy: {
        learningObjective:
          "Reconhecer situações de cyberbullying, analisar suas consequências e tomar decisões responsáveis para preveni-lo e combatê-lo.",
        estimatedDuration: "50 min",
        participation: ["individual", "group"],
      },
      requirements: {
        internet: true,
        devices: ["Computador ou notebook"],
        accountRequired: false,
      },
      provenance: {
        source: "ALT+INOVARE",
        license: "CC BY-NC-ND 3.0 BR",
      },
    });
  });

  it("mantém a descrição e os metadados definidos para a apresentação do recurso", () => {
    const resource = resources[0];

    expect(resource.summary).toBe(
      "Uma simulação gamificada e interativa para apoiar as escolas no desenvolvimento da empatia, responsabilidade digital e no combate à violência virtual. O recurso apresenta dilemas cotidianos da vida digital aos alunos, promovendo a tomada de decisões éticas em conformidade com o ECA Digital e a BNCC de Computação. Esse jogo é apropriado após explicar e apresentar para os alunos o tema de cyberbullying.",
    );
    expect(resource.curatorNotes).toBeUndefined();
    expect(resource.pedagogy.estimatedDuration).toBe("50 min");
    expect(resource.requirements.accountRequired).toBe(false);
    expect(resource.requirements.internet).toBe(true);
    expect(resource.provenance.license).toBe("CC BY-NC-ND 3.0 BR");
  });
});
