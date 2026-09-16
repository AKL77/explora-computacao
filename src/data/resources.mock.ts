import type { Resource } from "@/domain/resource";
import { publicAsset } from "@/lib/publicAsset";

import { createCurriculumAlignment } from "./bnccComputing";
import { digitalCitizenshipGameResources } from "./resources/digitalCitizenshipGames";
import { programmingGameResources } from "./resources/programmingGames";
import { rozelmaTeachingMaterials } from "./resources/rozelmaTeachingMaterials";
import { unicampUnpluggedResources } from "./resources/unicampUnplugged";

const cyberbullyingResource: Resource = {
  id: "altinovare-cyberbullying",
  slug: "altinovare-cyberbullying",
  title: "Cyberbullying — Jogo Educativo",
  sourceUrl: "https://www.altinovare.com/pages/cyberbullying/index.php",
  canonicalUrl: "https://www.altinovare.com.br/pages/cyberbullying/",
  provider: "ALT+INOVARE",
  type: "game",
  language: "Português do Brasil",
  topic: "Cyberbullying",
  summary:
    "Uma simulação gamificada e interativa para apoiar as escolas no desenvolvimento da empatia, responsabilidade digital e no combate à violência virtual. O recurso apresenta dilemas cotidianos da vida digital aos alunos, promovendo a tomada de decisões éticas em conformidade com o ECA Digital e a BNCC de Computação. Esse jogo é apropriado após explicar e apresentar para os alunos o tema de cyberbullying.",
  additionalInformation:
    "Recurso externo para aplicação após uma introdução ao tema. A proposta de uso registrada no catálogo prevê interação individual ou em grupos e uma conversa final sobre as escolhas realizadas no jogo.",
  recommendedGrades: [7],
  curriculum: {
    alignments: [
      createCurriculumAlignment({
        grade: 7,
        axis: "Cultura Digital",
        knowledgeObject:
          "Segurança e responsabilidade no uso da tecnologia — Cyberbullying",
        skillCode: "EF07CO09",
        competencies: [7],
        rationale:
          "O jogo apresenta dilemas de violência virtual e apoia o reconhecimento e o debate de situações de cyberbullying.",
      }),
    ],
  },
  pedagogy: {
    learningObjective:
      "Reconhecer situações de cyberbullying, analisar suas consequências e tomar decisões responsáveis para preveni-lo e combatê-lo.",
    estimatedDuration: "50 min",
    participation: ["individual", "group"],
    pedagogicalFunction: "practice",
    applicationProposal:
      "Reserve 5 minutos para retomar o tema do cyberbullying e explicar a dinâmica. Organize o uso do jogo individualmente ou em grupos por 20 a 30 minutos: use 20 minutos quando houver avaliação e até 30 minutos quando ela não for incluída. Oriente os estudantes a observar os dilemas e as decisões possíveis. Nos 10 minutos finais da atividade, conduza uma conversa sobre as escolhas e suas consequências, relacionando-as a formas responsáveis de prevenir e enfrentar o cyberbullying. Preserve os 5 minutos restantes da aula para acesso ao material, organização e transições.",
    assessmentSuggestion:
      "Solicite um breve registro escrito sobre um dos dilemas trabalhados no jogo. O estudante deve identificar a situação de cyberbullying e propor uma atitude responsável para preveni-la ou enfrentá-la.",
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
    thumbnailSrc: publicAsset("images/cards/thumbnails/cyberbullying-jogo.jpg"),
    alt: "Tela inicial do jogo Cyberbullying, com quatro personagens e botão para começar",
    license: "CC BY-NC-ND 3.0 BR",
  },
};

export const resources: Resource[] = [
  cyberbullyingResource,
  ...unicampUnpluggedResources,
  ...programmingGameResources,
  ...rozelmaTeachingMaterials,
  ...digitalCitizenshipGameResources,
];

export const mockResources = resources;
