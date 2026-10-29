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

const COMPUTE_IT_PORTUGUESE_URL = "https://compute-it.toxicode.fr/?lang=pt";

const computeItResource: Resource = {
  id: "toxicode-compute-it",
  slug: "compute-it",
  title: "Compute It",
  sourceUrl: COMPUTE_IT_PORTUGUESE_URL,
  canonicalUrl: COMPUTE_IT_PORTUGUESE_URL,
  provider: "Toxicode",
  type: "game",
  language: "Português nos comandos; elementos da interface e título em inglês",
  topic: "Leitura e simulação de algoritmos",
  summary: "Jogo em que o estudante assume o papel do computador: lê um programa e executa seus comandos para mover uma bolinha pelo percurso correto. Os desafios introduzem sequências, repetições, condições e funções pela interpretação do código. O acesso desta ficha fixa os comandos em português.",
  additionalInformation: "O acesso está configurado para exibir os comandos em português, independentemente do idioma do navegador. A configuração foi conferida no primeiro desafio: o comando inglês right() aparece como direita(). O título Compute It e alguns elementos da interface permanecem em inglês. O jogo foi concebido para iniciantes sem experiência prévia; a fonte não informa anos escolares brasileiros ou duração. A indicação do 6º ao 9º ano é curatorial. Os autores recomendam permitir a descoberta por experimentação e oferecer pequenas dicas quando o estudante pedir ajuda ou estiver bloqueado, evitando antecipar todas as explicações. Não exige cadastro. A licença de reutilização do jogo e das imagens não foi identificada.",
  curatorNotes: "Português fixado pelo parâmetro lang=pt nos dois endereços do cadastro, sem depender da detecção automática do navegador. O autor confirmou o funcionamento do link em português. A conferência não afirma tradução integral da interface nem avaliação de todos os desafios. Ano, familiaridade, aplicação e vínculo parcial à BNCC são curatoriais, pendentes de validação. O foco original é leitura e execução de programas, não a autoria de código pelo aluno. Sem imagem local por ausência de licença confirmada.",
  recommendedGrades: [6, 7, 8, 9],
  curriculum: { alignments: [createCurriculumAlignment({
    grade: 6,
    axis: "Pensamento Computacional",
    knowledgeObject: "Leitura e simulação de algoritmos com sequências, repetições e condições",
    skillCode: "EF06CO02",
    competencies: [4, 5],
    strength: "partial",
    rationale: "Ler e executar os comandos permite compreender o fluxo de instruções sequenciais, repetições e seleções. A habilidade também exige elaborar algoritmos em linguagem de programação, enquanto o jogo se concentra na interpretação de programas já apresentados; por isso o vínculo é parcial.",
  })] },
  pedagogy: {
    learningObjective: "Interpretar programas e simular sua execução, acompanhando a ordem dos comandos e o efeito de repetições e condições.",
    participation: ["individual"],
    pedagogicalFunction: "exploration",
    applicationProposal: "Proposta curatorial: abrir o jogo pelo acesso desta ficha, que fixa os comandos em português. Iniciar os desafios e deixar que os estudantes descubram como ler o código e executar os movimentos. Acompanhar as tentativas e, conforme a orientação dos autores, oferecer pequenas dicas apenas quando necessário. Para o fechamento, pedir que expliquem um percurso e identifiquem como a ordem das instruções, as repetições ou as condições afetaram o resultado.",
  },
  requirements: { internet: true, devices: ["Computador ou notebook com navegador e teclado para executar os movimentos"], accountRequired: false, pricing: "free" },
  accessibility: {
    evaluationStatus: "pending",
    knownFeatures: ["Comandos disponíveis em português pelo link configurado"],
    potentialBarriers: ["Leitura visual do programa, das cores e do percurso", "Elementos da interface em inglês"],
    alternatives: [],
  },
  provenance: { source: "Toxicode — Compute It, apresentação oficial para educadores e jogo com idioma fixado em português", lastVerifiedAt: "2026-10-28", status: "verified" },
  supplementaryLinks: [
    { label: "Jogo com comandos em português — acesso direto", url: COMPUTE_IT_PORTUGUESE_URL },
    { label: "Orientações oficiais para educadores (inglês)", url: "https://compute-it.toxicode.fr/en/about.html" },
  ],
  tags: ["Compute It", "Toxicode", "leitura de código", "interpretação de programas", "algoritmos", "simulação", "sequências de instruções", "repetições", "condições", "funções", "português"],
};

export const programmingGameResources: Resource[] = [
  lightbotResource,
  blocklyGamesResource,
  computeItResource,
];
