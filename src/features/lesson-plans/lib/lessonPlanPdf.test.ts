import { afterEach, describe, expect, it, vi } from "vitest";

import type { ComposedLessonPlan } from "@/domain/lessonPlan";

import {
  createLessonPlanPdf,
  downloadLessonPlanPdf,
  lessonPlanPdfFileName,
} from "./lessonPlanPdf";

function createPlan(overrides: Partial<ComposedLessonPlan> = {}): ComposedLessonPlan {
  return {
    theme: "Computação, ética e cidadania",
    grade: 7,
    lessonCount: 1,
    minutesPerLesson: 50,
    totalDurationMinutes: 50,
    skill: {
      code: "EF07CO09",
      officialText: "Reconhecer e debater sobre cyberbullying.",
      axis: "Cultura Digital",
      relatedCompetencies: [
        "Competência 7 - Agir com responsabilidade e respeito.",
      ],
    },
    objective:
      "Compreender situações de cyberbullying e propor ações responsáveis.",
    methodologyProfile: "combined",
    sessions: [
      {
        number: 1,
        durationMinutes: 50,
        marginMinutes: 5,
        centralActivity: {
          title: "Aplicação do recurso",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          durationMinutes: 35,
          resourceUse: {
            resourceId: "recurso-1",
            resourceTitle: "Jogo educativo",
            requestedFunction: "practice",
          },
          materials: [
            {
              id: "material-1",
              label: "Computador ou notebook",
              kind: "support",
              sourceResourceId: "recurso-1",
            },
          ],
        },
      },
    ],
    evaluation: {
      description: "Avaliação com reflexão e produção escrita.",
      sessionNumber: 1,
      sourceResourceId: "recurso-1",
      durationMinutes: 10,
    },
    ...overrides,
  };
}

function readBlob(blob: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.readAsArrayBuffer(blob);
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("lessonPlanPdf", () => {
  it("gera um PDF A4 válido com blocos vetoriais e acentos em WinAnsi", async () => {
    const blob = createLessonPlanPdf(createPlan());
    const bytes = await readBlob(blob);
    const pdf = new TextDecoder().decode(bytes);

    expect(blob.type).toBe("application/pdf");
    expect(blob.size).toBeGreaterThan(1_000);
    expect(pdf.startsWith("%PDF-1.4")).toBe(true);
    expect(pdf).toContain("/MediaBox [0 0 595.28 841.89]");
    expect(pdf).toContain("/BaseFont /Helvetica");
    expect(pdf).toContain("/Encoding /WinAnsiEncoding");
    expect(pdf).toContain("/ToUnicode 5 0 R");
    expect(pdf).toContain("Computa\\347\\343o");
    expect(pdf).toContain("Avalia\\347\\343o");
    expect(pdf).toContain("EF07CO09 - Reconhecer e debater sobre cyberbullying.");
    expect(pdf).not.toContain("Habilidade EF07CO09");
    expect(pdf).not.toContain("Cultura Digital");
    expect(pdf.indexOf("BNCC")).toBeLessThan(pdf.indexOf("Objetivo"));
    expect(pdf).toContain("0.055 0.455 0.565 rg");
    expect(pdf.trimEnd().endsWith("%%EOF")).toBe(true);
  });

  it("pagina conteúdo extenso e numera todas as páginas", async () => {
    const longObjective = Array.from(
      { length: 180 },
      (_, index) => `Etapa ${index + 1} com orientação pedagógica detalhada.`,
    ).join(" ");
    const blob = createLessonPlanPdf(createPlan({ objective: longObjective }));
    const pdf = new TextDecoder().decode(await readBlob(blob));
    const count = Number(pdf.match(/\/Type \/Pages .*?\/Count (\d+)/)?.[1]);

    expect(count).toBeGreaterThan(1);
    expect(pdf.match(/\/Type \/Page\b/g)).toHaveLength(count);
    expect(pdf).toContain("P\\341gina 1 de");
    expect(pdf).toContain(`P\\341gina ${count} de ${count}`);
    expect(pdf).toContain("Objetivo \\(continua\\347\\343o\\)");
  });

  it("cria um nome de arquivo seguro e preserva a extensão PDF", () => {
    expect(lessonPlanPdfFileName(createPlan())).toBe(
      "plano-de-aula-computacao-etica-e-cidadania.pdf",
    );
    expect(lessonPlanPdfFileName(createPlan({ theme: "---" }))).toBe(
      "plano-de-aula-sem-titulo.pdf",
    );
  });

  it("inicia o download do Blob e libera a URL temporária", () => {
    vi.useFakeTimers();
    const createObjectURL = vi.fn((blob: Blob) => {
      void blob;
      return "blob:plano-de-aula";
    });
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });

    let downloadedName = "";
    let downloadedHref = "";
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      downloadedName = this.download;
      downloadedHref = this.href;
    });

    downloadLessonPlanPdf(createPlan());

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(createObjectURL.mock.calls[0]?.[0]).toBeInstanceOf(Blob);
    expect(downloadedName).toBe("plano-de-aula-computacao-etica-e-cidadania.pdf");
    expect(downloadedHref).toBe("blob:plano-de-aula");
    expect(document.querySelector('a[href="blob:plano-de-aula"]')).toBeNull();
    expect(revokeObjectURL).not.toHaveBeenCalled();

    vi.runAllTimers();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:plano-de-aula");
  });
});
