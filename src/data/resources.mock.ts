import type { Resource } from "@/domain/resource";
import { publicAsset } from "@/lib/publicAsset";

const cyberbullyingResource: Resource = {
  id: "altinovare-cyberbullying",
  slug: "altinovare-cyberbullying",
  title: "Cyberbullying — Jogo Educativo",
  sourceUrl: "https://www.altinovare.com/pages/cyberbullying/index.php",
  canonicalUrl: "https://www.altinovare.com.br/pages/cyberbullying/",
  provider: "ALT+INOVARE",
  type: "game",
  language: "Português do Brasil",
  summary:
    "Uma simulação gamificada e interativa para apoiar as escolas no desenvolvimento da empatia, responsabilidade digital e no combate à violência virtual. O recurso apresenta dilemas cotidianos da vida digital aos alunos, promovendo a tomada de decisões éticas em conformidade com o ECA Digital e a BNCC de Computação. Esse jogo é apropriado após explicar e apresentar para os alunos o tema de cyberbullying.",
  recommendedGrades: [7],
  curriculum: {
    axis: "Cultura Digital",
    knowledgeObject:
      "Segurança e responsabilidade no uso da tecnologia — Cyberbullying",
    skills: [
      {
        code: "EF07CO09",
        officialText: "Reconhecer e debater sobre cyberbullying.",
        sourceEdition:
          "Computação na Educação Básica — Complemento à BNCC (2022)",
        sourceUrl:
          "https://basenacionalcomum.mec.gov.br/images/historico/anexo_parecer_cneceb_n_2_2022_bncc_computacao.pdf",
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
    pricing: "unknown",
  },
  accessibility: {
    evaluationStatus: "pending",
    knownFeatures: [],
    potentialBarriers: [],
    alternatives: [],
  },
  provenance: {
    source: "ALT+INOVARE",
    license: "CC BY-NC-ND 3.0 BR",
    lastVerifiedAt: "2026-08-12",
    status: "draft",
  },
  tags: [
    "cyberbullying",
    "cidadania digital",
    "segurança online",
    "jogo educativo",
  ],
  image: {
    src: publicAsset("images/cards/cyberbullying-jogo.png"),
    alt: "Tela inicial do jogo Cyberbullying, com quatro personagens e botão para começar",
    license: "CC BY-NC-ND 3.0 BR",
  },
};

export const resources: Resource[] = [cyberbullyingResource];

export const mockResources = resources;
