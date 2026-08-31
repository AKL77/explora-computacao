import type { Resource } from "@/domain/resource";

import { createCurriculumAlignment } from "../bnccComputing";

const LAST_VERIFIED_AT = "2026-08-29";

const interlandResource: Resource = {
  id: "google-interland",
  slug: "interland",
  title: "Interland",
  sourceUrl: "https://beinternetawesome.withgoogle.com/pt-br_br/interland",
  provider: "Google",
  type: "game",
  language: "Português do Brasil",
  topic: "Segurança e cidadania digital",
  summary:
    "Jogo on-line de aventura que permite praticar segurança e cidadania digital em quatro mundos sobre compartilhamento responsável, identificação de armadilhas, gentileza, bullying, senhas e proteção de informações.",
  additionalInformation:
    "O programa Seja Incrível na Internet foi projetado para estudantes do 2º ao 6º ano, de 7 a 12 anos. No recorte atual do Informática Explorer, isso corresponde ao 4º, 5º e 6º ano. Rio da Realidade aborda golpes, phishing e informações falsas; Montanha da Consciência, compartilhamento; Reino da Bondade, gentileza e bullying; Torre do Tesouro, senhas e privacidade. O Google recomenda discutir os conceitos antes e usar o jogo como reforço. A fonte não informa duração nem licença de reutilização para o jogo ou suas imagens; por isso, o acervo usa a imagem padrão. Os alinhamentos à BNCC Computação são curatoriais e permanecem pendentes de validação.",
  recommendedGrades: [4, 5, 6],
  curriculum: {
    alignments: [
      createCurriculumAlignment({
        grade: 4,
        axis: "Cultura Digital",
        knowledgeObject: "Segurança e responsabilidade no uso da tecnologia",
        skillCode: "EF04CO07",
        competencies: [7],
        rationale:
          "Montanha da Consciência trabalha escolhas éticas ao compartilhar, guardar e destinar informações pessoais e de outras pessoas.",
      }),
      createCurriculumAlignment({
        grade: 4,
        axis: "Cultura Digital",
        knowledgeObject: "Confiabilidade das informações na Internet",
        skillCode: "EF04CO08",
        competencies: [5],
        rationale:
          "Rio da Realidade propõe identificar phishing, informações falsas e sinais de fontes ou mensagens enganosas.",
      }),
      createCurriculumAlignment({
        grade: 5,
        axis: "Cultura Digital",
        knowledgeObject: "Confiabilidade das informações na Internet",
        skillCode: "EF05CO08",
        competencies: [5],
        rationale:
          "Rio da Realidade exige avaliar conteúdos e indícios para distinguir situações confiáveis de armadilhas on-line.",
      }),
      createCurriculumAlignment({
        grade: 6,
        axis: "Cultura Digital",
        knowledgeObject: "Segurança e responsabilidade no uso da tecnologia",
        skillCode: "EF06CO09",
        competencies: [3, 7],
        rationale:
          "Reino da Bondade trabalha conduta, linguagem, empatia, denúncia e respeito nas interações em ambientes digitais.",
      }),
    ],
  },
  pedagogy: {
    participation: ["individual", "pair"],
    pedagogicalFunction: "consolidation",
    applicationProposal:
      "Discutir previamente o tópico de segurança ou cidadania digital selecionado e utilizar o mundo correspondente do Interland para reforçar os conceitos por meio de decisões e consequências simuladas.",
  },
  requirements: {
    internet: true,
    devices: ["Computador", "Notebook", "Tablet ou smartphone em modo paisagem"],
    accountRequired: false,
    pricing: "free",
  },
  accessibility: {
    evaluationStatus: "pending",
    knownFeatures: [
      "Instruções para teclado e toque",
      "Controles por setas e barra de espaço",
      "Opção de pausar e ajuste de qualidade gráfica",
    ],
    potentialBarriers: [
      "Jogo fortemente visual e baseado em interação motora",
      "Algumas perguntas são cronometradas em 15 segundos",
      "Não foi localizada declaração de compatibilidade com leitor de tela",
    ],
    alternatives: [
      "O currículo oficial oferece atividades impressas e planos de aula relacionados aos mesmos temas",
    ],
  },
  provenance: {
    source: "Google — Seja Incrível na Internet: Interland",
    lastVerifiedAt: LAST_VERIFIED_AT,
    status: "verified",
  },
  supplementaryLinks: [
    {
      label: "Página para educadores",
      url: "https://beinternetawesome.withgoogle.com/pt-br_br/educadores",
    },
    {
      label: "Perguntas frequentes",
      url: "https://beinternetawesome.withgoogle.com/pt-br_br/perguntas-frequentes",
    },
    {
      label: "Currículo Seja Incrível na Internet",
      url: "https://storage.googleapis.com/gweb-interland.appspot.com/pt-br-all/hub/pdfs/2020/Google_SejaIncri%CC%81velNaInternet_Curriculum2019",
    },
  ],
  tags: [
    "cidadania digital",
    "segurança digital",
    "privacidade",
    "phishing",
    "cyberbullying",
    "senhas",
  ],
};

export const digitalCitizenshipGameResources: Resource[] = [interlandResource];
