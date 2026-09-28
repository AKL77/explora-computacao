import type { Resource } from "@/domain/resource";
import { publicAsset } from "@/lib/publicAsset";

import { createCurriculumAlignment } from "../bnccComputing";

const LAST_VERIFIED_AT = "2026-08-29";
const COLLECTION_PAGE = "https://www.falecomrozelma.com/materiaisdidaticos";
const CC_BY_NC_4 = "CC BY-NC 4.0";

const luaBitBitResource: Resource = {
  id: "rozelma-lua-bit-bit-variaveis",
  slug: "lua-bit-bit-programando-com-variaveis",
  title: "Lua & Bit-Bit — Programando com Variáveis",
  sourceUrl: "https://www.falecomrozelma.com/aventurasdelua",
  canonicalUrl:
    "https://www.falecomrozelma.com/_files/ugd/9579c7_47c66428d2c747649479c171bcd67dc9.pdf?index=true",
  provider: "Rozelma França",
  type: "activity",
  language: "Português do Brasil",
  topic: "Generalização e variáveis",
  summary:
    "Atividade desplugada em que Lua e o robô Bit-Bit usam uma variável para controlar ingressos em um parque de diversões e depois praticam o conceito em um jogo de tabuleiro para duas pessoas.",
  additionalInformation:
    "O episódio “Programando com Variáveis”, versão 1.0 de 2025, contém narrativa, regras, tabuleiro, personagens, ingressos, carimbos, passaporte e sugestões de avaliação. A própria obra o destina ao 6º ano, relaciona-o à generalização e à habilidade EF06CO06 e informa licença CC BY-NC 4.0. A fonte não informa duração.",
  recommendedGrades: [6],
  curriculum: {
    alignments: [
      createCurriculumAlignment({
        grade: 6,
        axis: "Pensamento Computacional",
        knowledgeObject: "Estratégias de solução de problemas — Generalização",
        skillCode: "EF06CO06",
        competencies: [4, 5],
        kind: "source-declared",
        rationale:
          "O PDF declara o 6º ano, o eixo Pensamento Computacional, a generalização como objeto de conhecimento e a habilidade EF06CO06.",
      }),
    ],
  },
  pedagogy: {
    participation: ["pair"],
    pedagogicalFunction: "practice",
    materials: [
      "PDF impresso",
      "Um tabuleiro por partida",
      "Uma moeda",
      "Personagens, ingressos, carimbos e passaportes recortados",
    ],
  },
  requirements: {
    internet: false,
    devices: [],
    accountRequired: false,
    pricing: "free",
  },
  accessibility: {
    evaluationStatus: "pending",
    knownFeatures: ["Atividade desplugada com componentes manipuláveis"],
    potentialBarriers: ["Exige impressão, recorte e leitura do material"],
    alternatives: [],
  },
  provenance: {
    source: "As aventuras de Lua & Bit-Bit no parque de diversão — Programando com Variáveis",
    license: CC_BY_NC_4,
    curator: "Explora Computação",
    lastVerifiedAt: LAST_VERIFIED_AT,
    status: "verified",
  },
  image: {
    src: publicAsset(
      "images/cards/rozelma/lua-bit-bit-programando-com-variaveis.jpg",
    ),
    thumbnailSrc: publicAsset(
      "images/cards/thumbnails/rozelma/lua-bit-bit-programando-com-variaveis.jpg",
    ),
    alt: "Capa de Programando com Variáveis, com Lua, Bit-Bit e um computador no parque de diversões",
    license: CC_BY_NC_4,
  },
  supplementaryLinks: [
    { label: "Coleção de materiais didáticos", url: COLLECTION_PAGE },
  ],
  tags: [
    "variáveis",
    "generalização",
    "algoritmos",
    "computação desplugada",
    "jogo de tabuleiro",
  ],
};

const sertaoBitResource: Resource = {
  id: "rozelma-sertao-bit",
  slug: "sertao-bit",
  title: "Sertão.bit — Livro-jogo de Pensamento Computacional",
  sourceUrl: "https://www.falecomrozelma.com/sertaobit",
  canonicalUrl:
    "https://www.falecomrozelma.com/_files/ugd/9579c7_9ba4f13d127c4f8691860b1c6c86b8bc.pdf?index=true",
  provider: "Rozelma França e Patrícia Tedesco",
  type: "activity",
  language: "Português do Brasil",
  topic: "Pensamento computacional em desafios narrativos",
  summary:
    "Livro-jogo ambientado no sertão pernambucano que combina uma narrativa infantil com 11 desafios de pensamento computacional, incluindo atividades desplugadas, projetos em Scratch e interações com Makey Makey ou FRANZMakey.",
  additionalInformation:
    "A obra trabalha abstração, decomposição, reconhecimento de padrões e algoritmos em uma sequência narrativa inspirada na história de Lampião Júnior e Maria Bonitinha. A pesquisa de doutorado que originou o material realizou um quase-experimento com estudantes do 5º ano; por isso, a curadoria recomenda esse ano, mas o alinhamento à BNCC Computação de 2022 permanece pendente de validação. A fonte não informa duração. O livro está sob CC BY-NC 4.0; as ilustrações são creditadas a Paulo Ricardo B. Silva.",
  recommendedGrades: [5],
  curriculum: {
    alignments: [
      createCurriculumAlignment({
        grade: 5,
        axis: "Pensamento Computacional",
        knowledgeObject: "Algoritmos",
        skillCode: "EF05CO04",
        competencies: [4, 5],
        rationale:
          "Os desafios solicitam construir, executar, comparar e aperfeiçoar sequências de instruções, inclusive em projetos Scratch, e o material foi aplicado em pesquisa com estudantes do 5º ano.",
      }),
      createCurriculumAlignment({
        grade: 5,
        axis: "Pensamento Computacional",
        knowledgeObject: "Decomposição",
        skillCode: "EF15CO04",
        competencies: [4, 5],
        rationale:
          "A obra declara a decomposição entre os pilares explorados e propõe desafios que dividem problemas em partes combináveis.",
      }),
    ],
  },
  pedagogy: {
    materials: [
      "Livro-jogo e guia de apoio ao docente",
      "Materiais impressos e manipuláveis indicados em cada desafio",
      "Scratch para os desafios plugados",
      "Makey Makey ou FRANZMakey no desafio de xaxado",
    ],
  },
  requirements: {
    pricing: "free",
  },
  accessibility: {
    evaluationStatus: "pending",
    knownFeatures: ["Combina desafios plugados e desplugados"],
    potentialBarriers: [
      "Alguns desafios exigem impressão, Scratch e hardware Makey Makey ou FRANZMakey",
    ],
    alternatives: ["A coleção inclui desafios que podem ser realizados sem computador"],
  },
  provenance: {
    source: "Sertão.bit — livro-jogo e guia de apoio ao docente",
    license: CC_BY_NC_4,
    curator: "Explora Computação",
    lastVerifiedAt: LAST_VERIFIED_AT,
    status: "verified",
  },
  image: {
    src: publicAsset("images/cards/rozelma/sertao-bit.jpg"),
    thumbnailSrc: publicAsset(
      "images/cards/thumbnails/rozelma/sertao-bit.jpg",
    ),
    alt: "Capa laranja do livro-jogo Sertão.bit, com duas crianças caracterizadas como personagens do sertão",
    license: CC_BY_NC_4,
  },
  supplementaryLinks: [
    {
      label: "Guia de apoio ao docente",
      url: "https://www.falecomrozelma.com/_files/ugd/9579c7_179ec2e8ef7f43d1ade0f81aa47f13bf.pdf",
    },
    {
      label: "Tese que descreve a aplicação com o 5º ano",
      url: "https://repositorio.ufpe.br/bitstream/123456789/38542/1/TESE%20Rozelma%20Soares%20de%20Fran%C3%A7a.pdf",
    },
  ],
  tags: [
    "livro-jogo",
    "pensamento computacional",
    "algoritmos",
    "decomposição",
    "Scratch",
    "cultura pernambucana",
  ],
};

const aventurasDigitaisResource: Resource = {
  id: "rozelma-aventuras-digitais",
  slug: "aventuras-digitais-cidadao-digital",
  title: "Aventuras Digitais — Tornando-se um Cidadão Digital",
  sourceUrl: "https://www.falecomrozelma.com/aventurasdigitais",
  canonicalUrl:
    "https://www.falecomrozelma.com/_files/ugd/9579c7_4c77e313744c4d289aa93c92fac125d5.pdf?index=true",
  provider: "Lucas Silva e Rozelma França",
  type: "activity",
  language: "Português do Brasil",
  topic: "Cidadania digital e uso responsável da tecnologia",
  summary:
    "Livro com histórias clássicas adaptadas e atividades plugadas e desplugadas sobre privacidade, segurança, ética, pensamento crítico, notícias falsas, direitos autorais e cidadania digital.",
  additionalInformation:
    "O livro possui seis capítulos e um diário de aprendizagem; o guia do professor apresenta objetivos, preparação e propostas de aplicação. A fonte destina a coleção aos anos iniciais do Ensino Fundamental e declara habilidades do 1º ao 5º ano. Como o recorte atual do Explora Computação começa no 4º ano, o cadastro inclui somente os alinhamentos declarados para o 4º e o 5º ano. A fonte não informa duração nem licença de reutilização.",
  recommendedGrades: [4, 5],
  curriculum: {
    alignments: [
      createCurriculumAlignment({
        grade: 4,
        axis: "Cultura Digital",
        knowledgeObject: "Segurança e responsabilidade no uso da tecnologia",
        skillCode: "EF04CO07",
        competencies: [7],
        kind: "source-declared",
        rationale:
          "O guia relaciona explicitamente o capítulo sobre ética digital à habilidade EF04CO07.",
      }),
      createCurriculumAlignment({
        grade: 4,
        axis: "Cultura Digital",
        knowledgeObject: "Confiabilidade das informações na Internet",
        skillCode: "EF04CO08",
        competencies: [5],
        kind: "source-declared",
        rationale:
          "O guia relaciona explicitamente os capítulos sobre pensamento crítico e notícias à habilidade EF04CO08.",
      }),
      createCurriculumAlignment({
        grade: 4,
        axis: "Cultura Digital",
        knowledgeObject: "Segurança e responsabilidade no uso da tecnologia",
        skillCode: "EF15CO09",
        competencies: [7],
        kind: "source-declared",
        rationale:
          "O guia declara EF15CO09 para o capítulo de cidadania digital, habilidade válida do 1º ao 5º ano.",
      }),
      createCurriculumAlignment({
        grade: 5,
        axis: "Cultura Digital",
        knowledgeObject: "Confiabilidade das informações na Internet",
        skillCode: "EF05CO08",
        competencies: [5],
        kind: "source-declared",
        rationale:
          "O guia relaciona explicitamente o capítulo sobre notícias e mídias sociais à habilidade EF05CO08.",
      }),
      createCurriculumAlignment({
        grade: 5,
        axis: "Cultura Digital",
        knowledgeObject: "Direitos autorais em mídias digitais",
        skillCode: "EF05CO09",
        competencies: [3, 7],
        kind: "source-declared",
        rationale:
          "O guia relaciona explicitamente o capítulo sobre ética digital à habilidade EF05CO09.",
      }),
      createCurriculumAlignment({
        grade: 5,
        axis: "Cultura Digital",
        knowledgeObject: "Segurança e responsabilidade no uso da tecnologia",
        skillCode: "EF15CO09",
        competencies: [7],
        kind: "source-declared",
        rationale:
          "O guia declara EF15CO09 para o capítulo de cidadania digital, habilidade válida do 1º ao 5º ano.",
      }),
    ],
  },
  pedagogy: {
    participation: ["individual", "group", "whole-class"],
    materials: ["Livro do estudante", "Guia do professor", "Materiais impressos"],
  },
  requirements: {
    accountRequired: false,
    pricing: "free",
  },
  accessibility: {
    evaluationStatus: "pending",
    knownFeatures: ["O guia prioriza atividades desplugadas"],
    potentialBarriers: ["Exige leitura e, em várias propostas, impressão"],
    alternatives: [
      "A maioria das atividades pode ser aplicada sem dispositivo eletrônico",
    ],
  },
  provenance: {
    source: "Aventuras Digitais — livro do estudante e guia do professor",
    lastVerifiedAt: LAST_VERIFIED_AT,
    status: "verified",
  },
  supplementaryLinks: [
    {
      label: "Guia de apoio ao docente",
      url: "https://www.falecomrozelma.com/_files/ugd/9579c7_c0f4da082b054f8b869049b14a03c5fb.pdf?index=true",
    },
  ],
  tags: [
    "cidadania digital",
    "privacidade",
    "segurança digital",
    "notícias falsas",
    "direitos autorais",
  ],
};

const rozelmaCyberbullyingResource: Resource = {
  id: "rozelma-cyberbullying-brincadeira-mau-gosto",
  slug: "cyberbullying-uma-brincadeira-de-mau-gosto",
  title: "Cyberbullying — Uma Brincadeira de Mau Gosto",
  sourceUrl: "https://www.falecomrozelma.com/cyberbullying",
  canonicalUrl:
    "https://www.falecomrozelma.com/_files/ugd/9579c7_0ef0c711a1e5431c89478f70abc2baa0.pdf",
  provider: "Wellington Pereira e Rozelma França",
  type: "activity",
  language: "Português do Brasil",
  topic: "Cyberbullying e narrativas digitais",
  summary:
    "Conjunto de quatro casos ilustrados sobre perfil falso, capacitismo, gordofobia, xenofobia e preconceito religioso, acompanhado de uma sequência didática para reconhecer, debater e enfrentar o cyberbullying.",
  additionalInformation:
    "A sequência é destinada ao 7º ano e organizada em três aulas: introdução e diferenciação entre bullying e cyberbullying; debate crítico dos casos; e criação de uma narrativa digital ou animação no Scratch. A fonte declara os eixos Cultura Digital e Pensamento Computacional e as habilidades EF07CO09 e EF07CO03. O PDF não informa licença de reutilização; por isso, a plataforma usa a imagem padrão.",
  recommendedGrades: [7],
  curriculum: {
    alignments: [
      createCurriculumAlignment({
        grade: 7,
        axis: "Cultura Digital",
        knowledgeObject: "Cyberbullying",
        skillCode: "EF07CO09",
        competencies: [7],
        kind: "source-declared",
        rationale:
          "A sequência didática declara EF07CO09 e dedica duas aulas ao reconhecimento e ao debate crítico de quatro casos de cyberbullying.",
      }),
      createCurriculumAlignment({
        grade: 7,
        axis: "Pensamento Computacional",
        knowledgeObject: "Projetos com programação",
        skillCode: "EF07CO03",
        competencies: [4, 6],
        kind: "source-declared",
        rationale:
          "A sequência declara EF07CO03 e propõe a construção de uma narrativa digital ou animação sobre enfrentamento ao cyberbullying usando Scratch.",
      }),
    ],
  },
  pedagogy: {
    learningObjective:
      "Diferenciar bullying e cyberbullying, reconhecer situações de violência virtual e construir uma narrativa digital que apresente formas de enfrentamento.",
    estimatedDuration: "3 aulas",
    participation: ["individual", "group", "whole-class"],
    pedagogicalFunction: "practice",
    applicationProposal:
      "Apresentar e diferenciar bullying e cyberbullying; debater os quatro casos ilustrados; e orientar a criação, no Scratch, de uma narrativa ou animação que mostre como enfrentar a situação escolhida.",
    assessmentSuggestion:
      "Observar participação e engajamento nos debates e avaliar a narrativa digital ou animação produzida na terceira aula.",
    materials: [
      "PDF com os quatro casos ilustrados",
      "Sequência didática",
      "Computador com acesso ao Scratch para a terceira aula",
    ],
  },
  requirements: {
    pricing: "free",
  },
  accessibility: {
    evaluationStatus: "pending",
    knownFeatures: ["Os casos podem ser apresentados e debatidos coletivamente"],
    potentialBarriers: [
      "O material contém linguagem discriminatória reproduzida para fins de análise e exige mediação docente cuidadosa",
      "A etapa final depende de um ambiente de programação visual",
    ],
    alternatives: [
      "Os casos podem ser lidos pelo docente e discutidos oralmente antes da produção digital",
    ],
  },
  provenance: {
    source: "Cyberbullying: Uma Brincadeira de Mau Gosto e sequência didática",
    lastVerifiedAt: LAST_VERIFIED_AT,
    status: "verified",
  },
  supplementaryLinks: [
    {
      label: "Sequência didática",
      url: "https://www.falecomrozelma.com/_files/ugd/9579c7_ca4c1a2a4da44494934df8619003c69f.pdf",
    },
  ],
  tags: [
    "cyberbullying",
    "cidadania digital",
    "Scratch",
    "narrativa digital",
    "ética",
  ],
};

export const rozelmaTeachingMaterials: Resource[] = [
  luaBitBitResource,
  sertaoBitResource,
  aventurasDigitaisResource,
  rozelmaCyberbullyingResource,
];
