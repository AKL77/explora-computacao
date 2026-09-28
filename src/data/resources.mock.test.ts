import { describe, expect, it } from "vitest";

import { resources } from "@/data/resources.mock";

describe("resources fixture", () => {
  const unicampResources = resources.filter((resource) =>
    resource.id.startsWith("unicamp-desplugada-atividade-"),
  );
  const rozelmaResources = resources.filter((resource) =>
    resource.id.startsWith("rozelma-"),
  );

  it("mantém os 31 recursos do corpus atual", () => {
    expect(resources).toHaveLength(31);
    expect(unicampResources).toHaveLength(23);
    expect(rozelmaResources).toHaveLength(4);
    expect(
      resources.find((resource) => resource.id === "altinovare-cyberbullying"),
    ).toBeDefined();
    expect(
      resources.find((resource) => resource.id === "lightbot-web"),
    ).toBeDefined();
    expect(
      resources.find((resource) => resource.id === "google-blockly-games"),
    ).toBeDefined();
    expect(
      resources.find((resource) => resource.id === "google-interland"),
    ).toBeDefined();
    expect(
      resources.some((resource) => resource.provider.includes("Descobrindo")),
    ).toBe(false);
  });

  it("avalia separadamente a familiaridade do aluno e do professor em todo o catálogo", () => {
    for (const resource of resources) {
      expect(["basic", "intermediate", "advanced"]).toContain(
        resource.requiredFamiliarity?.student,
      );
      expect(["basic", "intermediate", "advanced"]).toContain(
        resource.requiredFamiliarity?.teacher,
      );
    }

    expect(resources.find((resource) => resource.id === "google-blockly-games")?.requiredFamiliarity)
      .toEqual({ student: "basic", teacher: "intermediate" });
    expect(resources.find((resource) => resource.id === "unicamp-desplugada-atividade-19")?.requiredFamiliarity)
      .toEqual({ student: "advanced", teacher: "advanced" });
  });

  it("registra os quatro materiais da Rozelma compatíveis com o recorte atual", () => {
    const luaBitBit = resources.find(
      (resource) => resource.id === "rozelma-lua-bit-bit-variaveis",
    );
    const sertaoBit = resources.find(
      (resource) => resource.id === "rozelma-sertao-bit",
    );
    const aventurasDigitais = resources.find(
      (resource) => resource.id === "rozelma-aventuras-digitais",
    );
    const cyberbullying = resources.find(
      (resource) =>
        resource.id === "rozelma-cyberbullying-brincadeira-mau-gosto",
    );

    expect(luaBitBit).toMatchObject({
      recommendedGrades: [6],
      topic: "Generalização e variáveis",
      provenance: { license: "CC BY-NC 4.0" },
      image: { license: "CC BY-NC 4.0" },
    });
    expect(luaBitBit?.curriculum.alignments[0]).toMatchObject({
      skill: { code: "EF06CO06" },
      mapping: { kind: "source-declared", validationStatus: "validated" },
    });

    expect(sertaoBit).toMatchObject({
      recommendedGrades: [5],
      provenance: { license: "CC BY-NC 4.0" },
      image: { license: "CC BY-NC 4.0" },
    });
    expect(
      sertaoBit?.curriculum.alignments.every(
        ({ mapping }) => mapping.validationStatus === "pending",
      ),
    ).toBe(true);

    expect(aventurasDigitais).toMatchObject({
      recommendedGrades: [4, 5],
      topic: "Cidadania digital e uso responsável da tecnologia",
    });
    expect(aventurasDigitais?.image).toBeUndefined();
    expect(aventurasDigitais?.provenance.license).toBeUndefined();
    expect(
      aventurasDigitais?.curriculum.alignments.map(({ skill }) => skill.code),
    ).toEqual([
      "EF04CO07",
      "EF04CO08",
      "EF15CO09",
      "EF05CO08",
      "EF05CO09",
      "EF15CO09",
    ]);

    expect(cyberbullying).toMatchObject({
      recommendedGrades: [7],
      pedagogy: { estimatedDuration: "3 aulas" },
    });
    expect(cyberbullying?.image).toBeUndefined();
    expect(cyberbullying?.provenance.license).toBeUndefined();
    expect(
      cyberbullying?.curriculum.alignments.map(({ skill }) => skill.code),
    ).toEqual(["EF07CO09", "EF07CO03"]);
  });

  it("registra Interland sem inventar duração, licença ou imagem", () => {
    const interland = resources.find(
      (resource) => resource.id === "google-interland",
    );

    expect(interland).toMatchObject({
      provider: "Google",
      recommendedGrades: [4, 5, 6],
      topic: "Segurança e cidadania digital",
      requirements: {
        internet: true,
        accountRequired: false,
        pricing: "free",
      },
    });
    expect(interland?.pedagogy.estimatedDuration).toBeUndefined();
    expect(interland?.image).toBeUndefined();
    expect(interland?.provenance.license).toBeUndefined();
    expect(
      interland?.curriculum.alignments.every(
        ({ mapping }) => mapping.validationStatus === "pending",
      ),
    ).toBe(true);
  });

  it("não força no catálogo os materiais da Rozelma fora do recorte ou sem metadados", () => {
    expect(
      resources.some(({ title }) => title.includes("Gato de Botas na Era Digital")),
    ).toBe(false);
    expect(
      resources.some(({ title }) => title.includes("Os Pequenos Inventores")),
    ).toBe(false);
    expect(
      resources.some(({ title }) => title.includes("As Garotas que Amavam Caixas")),
    ).toBe(false);
  });

  it("registra Lightbot e Blockly Games sem inventar imagem ou licença", () => {
    const lightbot = resources.find((resource) => resource.id === "lightbot-web");
    const blocklyGames = resources.find(
      (resource) => resource.id === "google-blockly-games",
    );

    expect(lightbot).toMatchObject({
      title: "Lightbot",
      provider: "Laurent Haan",
      recommendedGrades: [4, 5],
      topic: "Sequências e repetições em algoritmos",
    });
    expect(lightbot?.image).toBeUndefined();
    expect(lightbot?.provenance.license).toBeUndefined();
    expect(lightbot?.curriculum.alignments.map(({ skill }) => skill.code)).toEqual([
      "EF04CO03",
      "EF05CO04",
    ]);

    expect(blocklyGames).toMatchObject({
      title: "Blockly Games",
      provider: "Google",
      language: "Português do Brasil",
      recommendedGrades: [4, 5],
      topic: "Programação em blocos",
      provenance: { license: "Apache-2.0 (código-fonte)" },
    });
    expect(blocklyGames?.image).toBeUndefined();
    expect(
      blocklyGames?.curriculum.alignments.every(
        ({ mapping }) => mapping.validationStatus === "pending",
      ),
    ).toBe(true);
  });

  it("mantém identificadores e endereços únicos", () => {
    expect(new Set(resources.map((resource) => resource.id)).size).toBe(
      resources.length,
    );
    expect(new Set(resources.map((resource) => resource.slug)).size).toBe(
      resources.length,
    );
  });

  it("preenche todos os campos obrigatórios do catálogo", () => {
    for (const resource of resources) {
      expect(resource.title.trim()).not.toBe("");
      expect(resource.topic.trim()).not.toBe("");
      expect(resource.summary.trim()).not.toBe("");
      expect(resource.additionalInformation.trim()).not.toBe("");
      expect(resource.sourceUrl).toMatch(/^https:\/\//);
      expect(resource.provenance.source.trim()).not.toBe("");
      expect(resource.recommendedGrades.length).toBeGreaterThan(0);
      expect(resource.curriculum.alignments.length).toBeGreaterThan(0);

      for (const alignment of resource.curriculum.alignments) {
        expect(resource.recommendedGrades).toContain(alignment.grade);
        expect(alignment.axis.trim()).not.toBe("");
        expect(alignment.skill.code.trim()).not.toBe("");
        expect(alignment.skill.officialText.trim()).not.toBe("");
        expect(alignment.competencies.length).toBeGreaterThan(0);
        expect(alignment.mapping.rationale.trim()).not.toBe("");
      }
    }
  });

  it("informa todas as turmas declaradas pela fonte e preserva extensões curatoriais", () => {
    const colorindo = resources.find(
      (resource) => resource.id === "unicamp-desplugada-atividade-2",
    );
    const batalhaNaval = resources.find(
      (resource) => resource.id === "unicamp-desplugada-atividade-6",
    );
    const fabricaChocolate = resources.find(
      (resource) => resource.id === "unicamp-desplugada-atividade-20",
    );

    expect(colorindo?.recommendedGrades).toEqual([4, 5, 6]);
    expect(batalhaNaval?.recommendedGrades).toEqual([4, 5, 6, 7, 8, 9]);
    expect(fabricaChocolate?.recommendedGrades).toEqual([5, 6, 7, 8, 9]);
  });

  it("marca os alinhamentos curatoriais da Unicamp como pendentes", () => {
    for (const resource of unicampResources) {
      expect(resource.image?.src).toContain("images/cards/unicamp/atividade-");
      expect(resource.image?.thumbnailSrc).toContain(
        "images/cards/thumbnails/unicamp/atividade-",
      );
      expect(resource.provenance.license).toBe("CC BY-NC-SA 4.0");
      expect(
        resource.curriculum.alignments.every(
          (alignment) =>
            alignment.mapping.kind === "curatorial" &&
            alignment.mapping.validationStatus === "pending",
        ),
      ).toBe(true);
    }
  });

  it("não oferece os pacotes ZIP editáveis no detalhe", () => {
    for (const resource of unicampResources) {
      expect(
        resource.supplementaryLinks?.some((link) =>
          link.url.toLocaleLowerCase("pt-BR").endsWith(".zip"),
        ) ?? false,
      ).toBe(false);
    }
  });

  it("registra sem disfarçar os alinhamentos condicionais", () => {
    const interfaceDesign = resources.find(
      (resource) => resource.id === "unicamp-desplugada-atividade-20",
    );
    const turingTest = resources.find(
      (resource) => resource.id === "unicamp-desplugada-atividade-21",
    );

    expect(interfaceDesign?.curriculum.alignments[0]).toMatchObject({
      grade: 5,
      skill: { code: "EF05CO11" },
      mapping: { strength: "partial" },
    });
    expect(turingTest?.curriculum.alignments[0]).toMatchObject({
      grade: 5,
      skill: { code: "EF05CO10" },
      mapping: { strength: "partial" },
    });
  });
});
