import { describe, expect, it } from "vitest";

import { resources } from "@/data/resources.mock";
import { METHODOLOGY_PLACEHOLDER_TEXT } from "@/domain/lessonPlan";
import {
  getPlanSkillOptions,
  toLessonResourceCandidate,
} from "@/features/lesson-plans/lib/lessonPlanCatalog";

describe("lessonPlanCatalog", () => {
  it("oferece todo recurso com alinhamento no ano e URL segura", () => {
    const sixthGradeOptions = getPlanSkillOptions(resources, 6);
    const variables = sixthGradeOptions.find(({ code }) => code === "EF06CO06");
    const seventhGradeOptions = getPlanSkillOptions(resources, 7);
    const cyberbullying = seventhGradeOptions.find(
      ({ code }) => code === "EF07CO09",
    );

    expect(variables?.resources).toMatchObject([
      { id: "rozelma-lua-bit-bit-variaveis" },
    ]);
    expect(cyberbullying?.resources).toMatchObject([
      { id: "altinovare-cyberbullying" },
      { id: "rozelma-cyberbullying-brincadeira-mau-gosto" },
    ]);
  });

  it("adapta o recurso para o compositor com todos os materiais disponíveis", () => {
    const candidate = toLessonResourceCandidate(resources[0]);

    expect(candidate).toMatchObject({
      id: "altinovare-cyberbullying",
      accessUrl: "https://www.altinovare.com.br/pages/cyberbullying/",
      estimatedDurationMinutes: 50,
      functions: ["practice"],
      methodologyProfiles: ["expository", "active", "combined"],
      applicationProposal: {
        title: "Aplicação de Cyberbullying — Jogo Educativo",
        materials: [
          { label: "Computador ou notebook" },
          { label: "Conexão com a internet" },
        ],
      },
    });
  });

  it("cria defaults seguros quando faltam metadados pedagógicos", () => {
    const unplugged = resources.find(
      ({ id }) => id === "unicamp-desplugada-atividade-1",
    );
    if (!unplugged) throw new Error("Recurso de teste não encontrado.");

    const candidate = toLessonResourceCandidate(unplugged);

    expect(candidate).toMatchObject({
      id: "unicamp-desplugada-atividade-1",
      estimatedDurationMinutes: 50,
      functions: ["practice"],
      methodologyProfiles: ["expository", "active", "combined"],
      applicationProposal: {
        description: METHODOLOGY_PLACEHOLDER_TEXT,
        materials: [
          {
            label:
              "Cinco cartões de demonstração com valores 1, 2, 4, 8 e 16",
          },
          { label: "Folhas de atividades" },
        ],
      },
    });
  });

  it("preserva a função pedagógica conhecida sem limitar metodologias", () => {
    const candidate = toLessonResourceCandidate({
      ...resources[0],
      id: "conteudo-avaliativo",
      pedagogy: {
        ...resources[0].pedagogy,
        pedagogicalFunction: "assessment",
      },
    });

    expect(candidate).toMatchObject({
      functions: ["assessment"],
      methodologyProfiles: ["expository", "active", "combined"],
    });
  });

  it("converte durações em aulas e não exclui recursos longos", () => {
    const threeLessonResource = resources.find(
      ({ id }) => id === "rozelma-cyberbullying-brincadeira-mau-gosto",
    );
    if (!threeLessonResource) throw new Error("Recurso de teste não encontrado.");

    expect(toLessonResourceCandidate(threeLessonResource)).toMatchObject({
      estimatedDurationMinutes: 150,
    });

    const longResource = {
      ...resources[0],
      pedagogy: {
        ...resources[0].pedagogy,
        estimatedDuration: "100 min",
      },
    };
    expect(toLessonResourceCandidate(longResource)).toMatchObject({
      estimatedDurationMinutes: 100,
    });
  });

  it("adapta os novos recursos mesmo sem duração ou proposta cadastrada", () => {
    const newResourceIds = [
      "rozelma-lua-bit-bit-variaveis",
      "rozelma-sertao-bit",
      "rozelma-aventuras-digitais",
      "rozelma-cyberbullying-brincadeira-mau-gosto",
      "google-interland",
      "lightbot-web",
      "google-blockly-games",
      "unicamp-desplugada-atividade-1",
    ];

    for (const resource of resources.filter(({ id }) =>
      newResourceIds.includes(id),
    )) {
      expect(toLessonResourceCandidate(resource)).not.toBeNull();
    }
  });

  it("continua recusando URLs inseguras", () => {
    const unsafeResource = {
      ...resources[0],
      canonicalUrl: "javascript:alert(1)",
      sourceUrl: "file:///conteudo-local",
    };

    expect(getPlanSkillOptions([unsafeResource], 7)).toEqual([]);
    expect(toLessonResourceCandidate(unsafeResource)).toBeNull();
  });
});
