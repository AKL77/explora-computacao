import type { Resource } from "@/domain/resource";

import { createCurriculumAlignment } from "../bnccComputing";

const LAST_VERIFIED_AT = "2026-08-29";

const lightbotResource: Resource = {
  id: "lightbot-web",
  slug: "lightbot",
  title: "Lightbot",
  sourceUrl: "https://www.lightbot.lu/#/welcome",
  provider: "Laurent Haan",
  type: "game",
  language: "Inglês, alemão e francês",
  topic: "Sequências e repetições em algoritmos",
  summary:
    "Jogo de programação em que o estudante monta uma sequência de instruções para conduzir um robô por cenários tridimensionais e acender todos os blocos iluminados de cada nível.",
  additionalInformation:
    "A versão web consultada possui 16 níveis, numerados de 0 a 15, e oferece instruções para avançar, girar, saltar, acender um bloco e repetir ações. A própria ajuda explica que as instruções são reunidas em um programa executado pelo robô. A interface oferece inglês, alemão e francês, mas não português. A fonte não informa ano escolar, faixa etária, duração ou licença; as turmas e os alinhamentos abaixo são curatoriais e permanecem pendentes de validação.",
  recommendedGrades: [4, 5],
  curriculum: {
    alignments: [
      createCurriculumAlignment({
        grade: 4,
        axis: "Pensamento Computacional",
        knowledgeObject: "Programação com sequências e repetições",
        skillCode: "EF04CO03",
        competencies: [4, 5],
        rationale:
          "Os níveis exigem criar e simular programas com sequências de comandos e repetições para resolver desafios de movimentação.",
      }),
      createCurriculumAlignment({
        grade: 5,
        axis: "Pensamento Computacional",
        knowledgeObject: "Algoritmos com sequências e repetições",
        skillCode: "EF05CO04",
        competencies: [4, 5],
        strength: "partial",
        rationale:
          "O jogo trabalha sequências e repetições, mas a interface consultada não apresenta seleção condicional, também prevista na habilidade do 5º ano.",
      }),
    ],
  },
  pedagogy: {
    participation: ["individual"],
  },
  requirements: {
    internet: true,
    accountRequired: false,
    pricing: "free",
  },
  accessibility: {
    evaluationStatus: "pending",
    knownFeatures: ["Controle para ativar ou desativar o áudio"],
    potentialBarriers: ["Interface sem opção em português"],
    alternatives: [],
  },
  provenance: {
    source: "Lightbot — versão web desenvolvida por Laurent Haan",
    lastVerifiedAt: LAST_VERIFIED_AT,
    status: "verified",
  },
  tags: [
    "programação visual",
    "algoritmos",
    "sequências",
    "repetições",
    "lógica de programação",
  ],
};

const blocklyGamesResource: Resource = {
  id: "google-blockly-games",
  slug: "blockly-games",
  title: "Blockly Games",
  sourceUrl: "https://blockly.games/?lang=pt-br",
  provider: "Google",
  type: "game",
  language: "Português do Brasil",
  topic: "Programação em blocos",
  summary:
    "Série de jogos educacionais autoinstrucionais para ensinar programação a crianças sem experiência prévia. As atividades avançam da montagem de blocos para laços, condicionais, funções e contato com JavaScript.",
  additionalInformation:
    "A coleção reúne Quebra-Cabeça, Labirinto, Pássaro, Tartaruga, Filme, Música, Tutor de Lagoa e Lagoa. A página para educadores descreve práticas com encaixe de blocos, laços, condicionais, equações, animação, funções e alternância entre blocos e JavaScript. A fonte declara que os jogos são autoinstrucionais, gratuitos e de código aberto, mas não informa ano escolar ou duração. As turmas e os alinhamentos abaixo são curatoriais e permanecem pendentes de validação.",
  recommendedGrades: [4, 5],
  curriculum: {
    alignments: [
      createCurriculumAlignment({
        grade: 4,
        axis: "Pensamento Computacional",
        knowledgeObject: "Programação com sequências e repetições",
        skillCode: "EF04CO03",
        competencies: [4, 5],
        rationale:
          "Os jogos Labirinto e Tartaruga permitem construir e executar algoritmos em blocos com sequências, repetições simples e repetições aninhadas.",
      }),
      createCurriculumAlignment({
        grade: 5,
        axis: "Pensamento Computacional",
        knowledgeObject: "Algoritmos com sequências, repetições e condicionais",
        skillCode: "EF05CO04",
        competencies: [4, 5],
        rationale:
          "Labirinto introduz laços e condicionais, enquanto Pássaro aprofunda condições progressivamente mais complexas em programas visuais.",
      }),
    ],
  },
  pedagogy: {
    participation: ["individual"],
  },
  requirements: {
    internet: true,
    accountRequired: false,
    pricing: "free",
  },
  accessibility: {
    evaluationStatus: "pending",
    knownFeatures: ["Interface disponível em português brasileiro"],
    potentialBarriers: [],
    alternatives: ["A fonte disponibiliza instruções para uso offline"],
  },
  provenance: {
    source: "Blockly Games — site oficial e informações para educadores",
    license: "Apache-2.0 (código-fonte)",
    lastVerifiedAt: LAST_VERIFIED_AT,
    status: "verified",
  },
  supplementaryLinks: [
    {
      label: "Informações para educadores",
      url: "https://blockly.games/about?lang=pt-br",
    },
    {
      label: "Instruções para uso offline",
      url: "https://github.com/NeilFraser/blockly-games/wiki/Offline",
    },
    {
      label: "Código-fonte (Apache-2.0)",
      url: "https://github.com/blockly-games/blockly-games",
    },
  ],
  tags: [
    "programação em blocos",
    "algoritmos",
    "laços",
    "condicionais",
    "funções",
    "JavaScript",
  ],
};

export const programmingGameResources: Resource[] = [
  lightbotResource,
  blocklyGamesResource,
];
