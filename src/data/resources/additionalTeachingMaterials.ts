import type { Resource } from "@/domain/resource";
import { publicAsset } from "@/lib/publicAsset";

import { createCurriculumAlignment } from "../bnccComputing";

const LAST_VERIFIED_AT = "2026-10-26";
const COMPUTACIONAL_URL = "https://www.computacional.com.br/atividadespc";
const THESIS_URL = "https://lume.ufrgs.br/handle/10183/172208";
const UNPLUGGED_LICENSE = "CC BY-NC-SA 4.0";

const computacionalDefaults = {
  provider: "Computacional — Christian Brackmann",
  type: "activity",
  language: "Português do Brasil",
  canonicalUrl: COMPUTACIONAL_URL,
  requirements: { internet: false, accountRequired: false, pricing: "free" },
  accessibility: {
    evaluationStatus: "pending",
    knownFeatures: [],
    potentialBarriers: [],
    alternatives: [],
  },
} satisfies Partial<Resource>;

function computacionalProvenance(license?: string): Resource["provenance"] {
  return {
    source: "Computacional — catálogo e arquivos oficiais da atividade",
    license,
    lastVerifiedAt: LAST_VERIFIED_AT,
    status: "verified",
  };
}

function activityImage(name: string, alt: string): Resource["image"] {
  return {
    src: publicAsset(`images/cards/computacional/${name}.jpg`),
    thumbnailSrc: publicAsset(`images/cards/thumbnails/computacional/${name}.jpg`),
    alt,
    license: UNPLUGGED_LICENSE,
  };
}

const bugs: Resource = {
  ...computacionalDefaults,
  id: "computacional-bugs",
  slug: "computacional-bugs",
  title: "Bugs",
  sourceUrl: "https://www.computacional.com.br/atividades_download/por/06-Bugs-Resolucao-de-Problemas.zip",
  topic: "Depuração de algoritmos",
  summary: "Atividade desplugada em que os estudantes identificam e corrigem erros em instruções e fluxogramas de situações cotidianas, como preparar uma bebida, organizar uma mesa e resolver um problema com uma lâmpada.",
  additionalInformation: "O pacote oficial contém a folha de desafios Bugs, instruções para o professor e o documento de licença. A orientação é entregar uma folha a cada estudante, discutir os exemplos e simular sua execução até corrigir os algoritmos. O catálogo recomenda a atividade a partir do 4º ano; aqui são apresentados os anos dentro do recorte do 4º ao 9º. A fonte não informa duração.",
  recommendedGrades: [4, 5, 6, 7, 8, 9],
  curatorNotes: "Anos de aplicação seguem a indicação ampla da fonte. Os pares ano–habilidade e a familiaridade são curatoriais e pendentes de validação acadêmica.",
  curriculum: { alignments: [
    createCurriculumAlignment({
      grade: 4, axis: "Pensamento Computacional", knowledgeObject: "Simulação e correção de algoritmos",
      skillCode: "EF04CO03", competencies: [4, 5], strength: "partial",
      rationale: "Os estudantes simulam e corrigem sequências e repetições em fluxogramas; a folha não desenvolve explicitamente repetições aninhadas nem exige a criação de todos os algoritmos do zero.",
    }),
    createCurriculumAlignment({
      grade: 5, axis: "Pensamento Computacional", knowledgeObject: "Sequências, repetições e seleções condicionais",
      skillCode: "EF05CO04", competencies: [4, 5],
      rationale: "A revisão dos fluxogramas envolve reorganizar instruções, corrigir decisões e simular repetições para produzir algoritmos que resolvam os problemas apresentados.",
    }),
  ] },
  pedagogy: {
    learningObjective: "Reconhecer e corrigir equívocos em sequências de instruções e diagramas, exercitando abstração, decomposição e algoritmos.",
    participation: ["individual"], pedagogicalFunction: "practice",
    materials: ["Folha de desafios Bugs impressa para cada estudante"],
    applicationProposal: "Entregar a folha a cada estudante. Discutir os exemplos, localizar o problema em cada situação e simular a execução das instruções até que os algoritmos estejam corrigidos.",
  },
  provenance: computacionalProvenance(UNPLUGGED_LICENSE),
  image: activityImage("bugs", "Folha Bugs com fluxogramas e instruções de situações cotidianas para corrigir"),
  supplementaryLinks: [{ label: "Catálogo oficial e indicação de público", url: COMPUTACIONAL_URL }, { label: "Pesquisa de origem — tese de Christian Brackmann", url: THESIS_URL }],
  tags: ["bugs", "depuração", "erros", "fluxogramas", "algoritmos", "condicionais", "repetições", "atividade desplugada"],
};

const tetris: Resource = {
  ...computacionalDefaults,
  id: "computacional-tetris-repeticao",
  slug: "tetris-repeticao",
  title: "Tetris — Repetição",
  sourceUrl: "https://www.computacional.com.br/atividades_download/por/09-Tetris2-repeticao.zip",
  topic: "Padrões e repetições em algoritmos",
  summary: "Atividade desplugada para representar percursos em figuras quadriculadas com comandos de avançar e girar. Os estudantes identificam padrões e usam multiplicadores para abreviar sequências repetidas.",
  additionalInformation: "Esta é a atividade Tetris — Repetição, distinta de Tetris — Instruções. O pacote contém as instruções, uma folha quadriculada com cinco figuras e o documento de licença. Os comandos consideram a direção da seta na figura: para frente, gire à direita e gire à esquerda. O catálogo indica aplicação a partir do 5º ano. A fonte não informa duração.",
  recommendedGrades: [5, 6, 7, 8, 9],
  curatorNotes: "O público a partir do 5º ano é declarado pela fonte; o vínculo curricular e a familiaridade são curatoriais.",
  curriculum: { alignments: [createCurriculumAlignment({
    grade: 5, axis: "Pensamento Computacional", knowledgeObject: "Algoritmos com sequências e repetições",
    skillCode: "EF05CO04", competencies: [4, 5], strength: "partial",
    rationale: "A atividade mobiliza sequências de comandos e repetições representadas por multiplicadores, mas não trabalha a seleção condicional também prevista na habilidade.",
  })] },
  pedagogy: {
    learningObjective: "Compreender o uso de repetições para desenhar figuras, identificando padrões e representando percursos por algoritmos.",
    participation: ["individual"], pedagogicalFunction: "practice",
    materials: ["Folha quadriculada com os desenhos propostos ou caderno quadriculado"],
    applicationProposal: "Entregar a folha ou utilizar o caderno. Explicar a perspectiva da seta e os comandos para frente, gire à direita e gire à esquerda. Representar os percursos e substituir padrões repetidos por multiplicadores, como no exemplo do material.",
  },
  provenance: computacionalProvenance(UNPLUGGED_LICENSE),
  image: activityImage("tetris-repeticao", "Folha quadriculada com cinco percursos e um exemplo de repetição de comandos"),
  supplementaryLinks: [{ label: "Catálogo oficial e indicação de público", url: COMPUTACIONAL_URL }, { label: "Pesquisa de origem — tese de Christian Brackmann", url: THESIS_URL }],
  tags: ["Tetris", "repetições", "laços", "padrões", "algoritmos", "sequências de instruções", "atividade desplugada"],
};

const automata: Resource = {
  ...computacionalDefaults,
  id: "computacional-automatos-monica",
  slug: "automatos-da-monica",
  title: "Autômatos da Mônica — Versão 2026",
  sourceUrl: "https://www.computacional.com.br/atividades_download/aut_monica_2026.zip",
  topic: "Autômatos, grafos e transições de estados",
  summary: "Desafios desplugados em que os estudantes ajudam Cebolinha e Cascão a chegar à saída de mapas, construindo sequências de cores que determinam as transições entre os nós.",
  additionalInformation: "A versão 2026 reúne regras, mapas, rotas, peças e soluções selecionadas. É necessário utilizar todas as cores indicadas na rota. Alguns desafios incluem condicionais e contadores, e a numeração indica a dificuldade. Os mapas e as rotas podem ser impressos, projetados ou desenhados no quadro; as peças recortáveis são recomendadas, mas opcionais. O catálogo indica aplicação a partir do 6º ano. O documento credita parceria com ThinkFun e Estúdios Maurício de Sousa. Não foram encontradas duração ou licença explícita no pacote consultado.",
  recommendedGrades: [6, 7, 8, 9],
  curatorNotes: "Não estender automaticamente a licença de outros pacotes do Computacional a este material com personagens de terceiros. Alinhamentos curatoriais pendentes de validação.",
  curriculum: { alignments: [
    createCurriculumAlignment({
      grade: 7, axis: "Pensamento Computacional", knowledgeObject: "Grafos e caminhos",
      skillCode: "EF07CO04", competencies: [4, 5],
      rationale: "Os mapas permitem explorar nós, conexões e caminhos, verificando quais sequências de transições conduzem do ponto inicial à saída.",
    }),
    createCurriculumAlignment({
      grade: 9, axis: "Pensamento Computacional", knowledgeObject: "Autômatos finitos",
      skillCode: "EF09CO03", competencies: [4, 5], strength: "partial",
      rationale: "O material representa estados e transições de autômatos finitos, mas não inclui a automatização em linguagem de programação baseada em eventos exigida para cobrir integralmente a habilidade.",
    }),
  ] },
  pedagogy: {
    learningObjective: "Resolver desafios de autômatos finitos determinísticos, exercitando abstração, decomposição, reconhecimento de padrões e algoritmos.",
    pedagogicalFunction: "practice",
    materials: ["Mapas e rotas impressos ou desenhados no quadro", "Peças recortáveis (opcionais)"],
    applicationProposal: "Apresentar os mapas e as rotas. Posicionar o personagem e a porta nos nós indicados e encontrar uma sequência que utilize todas as cores disponíveis e alcance a saída. Aplicar os testes condicionais e os contadores quando aparecerem no desafio.",
  },
  provenance: computacionalProvenance(),
  supplementaryLinks: [{ label: "Catálogo oficial e indicação de público", url: COMPUTACIONAL_URL }, { label: "Pesquisa de origem — tese de Christian Brackmann", url: THESIS_URL }],
  tags: ["autômatos", "grafos", "estados", "transições", "algoritmos", "condicionais", "contadores", "Turma da Mônica", "atividade desplugada"],
};

const logicGates: Resource = {
  ...computacionalDefaults,
  id: "computacional-portas-logicas",
  slug: "portas-logicas",
  title: "Portas Lógicas",
  sourceUrl: "https://www.computacional.com.br/atividades_download/Portas_Logicas.pdf",
  topic: "Operações lógicas: E, OU e NÃO",
  summary: "Folha de desafios com circuitos lógicos em que o estudante identifica o menor número de entradas que precisam estar ligadas para manter uma lâmpada acesa, combinando portas AND, OR e inversões.",
  additionalInformation: "O PDF apresenta circuitos de complexidade crescente com conjunção, disjunção e negação. O catálogo indica a partir do 3º ano; no Explora Computação são apresentados somente os anos dentro do recorte do 4º ao 9º. A licença CC BY-NC-SA 4.0 está impressa no rodapé da própria folha. Não são informados duração, modo de participação ou roteiro docente detalhado.",
  recommendedGrades: [4, 5, 6, 7, 8, 9],
  curatorNotes: "Público amplo conforme a fonte; habilidade, familiaridade e proposta de uso são curatoriais. A atividade de lógica não é classificada como Mundo Digital apenas pela representação de circuitos.",
  curriculum: { alignments: [createCurriculumAlignment({
    grade: 5, axis: "Pensamento Computacional", knowledgeObject: "Lógica computacional",
    skillCode: "EF05CO03", competencies: [4, 5],
    rationale: "A determinação das entradas dos circuitos exige operações de conjunção, disjunção e negação com valores ligado/desligado, correspondentes a verdadeiro/falso.",
  })] },
  pedagogy: {
    learningObjective: "Identificar o mínimo de entradas ligadas que mantém a lâmpada acesa em circuitos com operações lógicas.",
    pedagogicalFunction: "practice", materials: ["Folha de desafios Portas Lógicas impressa"],
    applicationProposal: "Marcar, em cada circuito da folha, o menor número de entradas que precisam estar no estado ligado para manter a lâmpada acesa.",
  },
  provenance: computacionalProvenance(UNPLUGGED_LICENSE),
  image: activityImage("portas-logicas", "Desafios com lâmpadas e circuitos de portas AND, OR e inversões"),
  supplementaryLinks: [{ label: "Catálogo oficial e indicação de público", url: COMPUTACIONAL_URL }],
  tags: ["portas lógicas", "lógica computacional", "AND", "OR", "NOT", "conjunção", "disjunção", "negação", "atividade desplugada"],
};

const oceans: Resource = {
  id: "codeorg-ia-oceanos", slug: "ia-para-os-oceanos", title: "IA para os Oceanos",
  sourceUrl: "https://studio.code.org/courses/oceans/units/1/lessons/1/levels/1?lang=pt-BR",
  canonicalUrl: "https://studio.code.org/courses/oceans/units/1?viewAs=Instructor",
  provider: "Code.org", type: "activity", language: "Português do Brasil (atividade); inglês (plano docente consultado)",
  topic: "Aprendizado de máquina e vieses nos dados",
  summary: "Atividade interativa em que os estudantes classificam imagens de peixes e outros objetos para treinar e testar modelos de aprendizado de máquina, observando como os exemplos e os critérios de classificação influenciam os resultados.",
  additionalInformation: "O plano oficial consultado prevê 45 minutos: 5 de introdução e 40 de atividade. Combina vídeos, treinamento de modelos, comparação de resultados e discussão sobre vieses e impactos da inteligência artificial. A fonte apresenta a proposta como introdutória para diferentes idades, sem declarar anos escolares brasileiros. A seleção do 4º ao 9º ano é curatorial e exige adequar a mediação e a discussão à turma. O jogo abre publicamente sem redirecionar para uma tela de login; o plano docente consultado está em inglês.",
  recommendedGrades: [4, 5, 6, 7, 8, 9],
  curatorNotes: "Anos, familiaridade e alinhamentos à BNCC são curatoriais. A licença confirmada pertence ao plano docente; não foi estendida automaticamente aos ativos do jogo.",
  curriculum: { alignments: [
    createCurriculumAlignment({
      grade: 5, axis: "Cultura Digital", knowledgeObject: "Evolução tecnológica e inteligência artificial",
      skillCode: "EF05CO10", competencies: [1, 2, 5], strength: "partial",
      rationale: "As discussões do plano introduzem a presença e os impactos da IA na vida cotidiana; a relação com transformações da sociedade e do trabalho precisa ser conduzida explicitamente pelo docente.",
    }),
    createCurriculumAlignment({
      grade: 6, axis: "Pensamento Computacional", knowledgeObject: "Classificação de informações",
      skillCode: "EF06CO01", competencies: [4, 5], strength: "partial",
      rationale: "A rotulagem agrupa imagens em classes por características; a atividade não desenvolve explicitamente a associação de coleções a tipos de dados, portanto cobre apenas parte da habilidade.",
    }),
    createCurriculumAlignment({
      grade: 9, axis: "Cultura Digital", knowledgeObject: "Impactos da inteligência artificial",
      skillCode: "EF09CO07", competencies: [1, 2, 5], strength: "partial",
      rationale: "O plano propõe discutir vieses e usos da IA em problemas do mundo real; a avaliação mais ampla de implicações políticas, socioambientais e do trabalho exige aprofundamento docente.",
    }),
  ] },
  pedagogy: {
    learningObjective: "Treinar e testar um modelo de aprendizado de máquina, discutir o papel da IA no cotidiano e explicar como vieses humanos podem afetar seus resultados.",
    estimatedDuration: "45 min", participation: ["individual", "pair"], pedagogicalFunction: "exploration",
    applicationProposal: "Apresentar os objetivos em 5 minutos. Durante os 40 minutos de atividade, acompanhar os vídeos e a classificação das imagens, treinar e testar modelos e comparar resultados individualmente ou em duplas. Discutir como os exemplos e os critérios escolhidos influenciam as previsões.",
  },
  requirements: { internet: true, devices: ["Computador ou notebook com navegador"], accountRequired: false, pricing: "free" },
  accessibility: { evaluationStatus: "pending", knownFeatures: [], potentialBarriers: ["Interação com imagens e vídeos", "Plano docente consultado em inglês"], alternatives: [] },
  provenance: { source: "Code.org — AI for Oceans e plano docente oficial", license: "CC BY-NC-SA 4.0 (plano docente); licença do jogo não verificada", lastVerifiedAt: LAST_VERIFIED_AT, status: "verified" },
  supplementaryLinks: [
    { label: "Unidade e orientações para professores", url: "https://studio.code.org/courses/oceans/units/1?viewAs=Instructor" },
    { label: "Plano docente oficial — 45 minutos (PDF em inglês)", url: "https://lesson-plans.code.org/oceans/20250325005525/teacher-lesson-plans/AI-for-Oceans.pdf" },
  ],
  tags: ["inteligência artificial", "IA", "aprendizado de máquina", "machine learning", "classificação", "dados de treinamento", "vieses", "oceanos"],
};

const nameBadge: Resource = {
  id: "microbit-cracha", slug: "microbit-cracha", title: "Crachá — micro:bit",
  sourceUrl: "https://www.microbit.org/pt-br/projects/make-it-code-it/name-badge/",
  provider: "Micro:bit Educational Foundation", type: "activity", language: "Português do Brasil",
  topic: "Algoritmos, repetição e saída em LEDs",
  summary: "Tutorial introdutório para programar um crachá que mostra um nome em texto deslizante no visor de LEDs do micro:bit. A programação pode ser feita em MakeCode ou Python, usando a placa ou o simulador MakeCode.",
  additionalInformation: "O tutorial é classificado pela fonte como iniciante e se organiza em três etapas: fazer, codificar e aprimorar. O programa usa uma repetição infinita para exibir o texto continuamente. Há código, vídeos e propostas para adicionar novos textos e ícones. A placa física pode ser substituída pelo simulador MakeCode; baterias são opcionais. Não são informados duração ou ano escolar. A recomendação do 4º ao 6º ano é curatorial.",
  recommendedGrades: [4, 5, 6],
  curatorNotes: "A fonte declara nível iniciante, não anos escolares. Familiaridade, anos e vínculos com a BNCC são curatoriais. O uso de simulador é explicitamente autorizado no tutorial e não exige comprar uma placa.",
  curriculum: { alignments: [
    createCurriculumAlignment({
      grade: 4, axis: "Pensamento Computacional", knowledgeObject: "Programação com sequências e repetição",
      skillCode: "EF04CO03", competencies: [3, 4], strength: "partial",
      rationale: "A criação e execução do crachá utiliza sequência e repetição indefinida, mas o tutorial não desenvolve repetições aninhadas.",
    }),
    createCurriculumAlignment({
      grade: 5, axis: "Pensamento Computacional", knowledgeObject: "Programação com sequências e repetição",
      skillCode: "EF05CO04", competencies: [3, 4], strength: "partial",
      rationale: "O programa contém sequência e repetição; a seleção condicional prevista na habilidade não é trabalhada no projeto básico.",
    }),
    createCurriculumAlignment({
      grade: 6, axis: "Pensamento Computacional", knowledgeObject: "Linguagem de programação",
      skillCode: "EF06CO02", competencies: [3, 4], strength: "partial",
      rationale: "MakeCode ou Python permite implementar e executar instruções sequenciais e repetição; o tutorial básico não inclui seleção condicional.",
    }),
  ] },
  pedagogy: {
    learningObjective: "Criar um conjunto de instruções que exiba texto continuamente na saída de LEDs, compreendendo algoritmos e repetição infinita.",
    pedagogicalFunction: "introduction",
    materials: ["Placa micro:bit ou simulador MakeCode", "Editor MakeCode ou Python", "Conjunto de baterias (opcional, para a placa física)"],
    applicationProposal: "Seguir as etapas Fazer e Codificar do tutorial para exibir um nome em texto deslizante com repetição infinita. Executar no simulador MakeCode ou na placa. Na etapa Aprimorar, adicionar outros textos e ícones, conforme as propostas da fonte.",
  },
  requirements: { internet: true, devices: ["Computador ou notebook com navegador"], pricing: "free" },
  accessibility: { evaluationStatus: "pending", knownFeatures: [], potentialBarriers: ["Saída visual em LEDs e programação visual na opção MakeCode"], alternatives: [] },
  provenance: { source: "Micro:bit Educational Foundation — tutorial oficial Crachá", license: "CC BY-SA 4.0", lastVerifiedAt: LAST_VERIFIED_AT, status: "verified" },
  supplementaryLinks: [{ label: "Editor e simulador MakeCode", url: "https://makecode.microbit.org/" }],
  tags: ["micro:bit", "microbit", "MakeCode", "Python", "crachá", "programação", "algoritmos", "repetições", "LED", "simulador"],
};

const internetGuide: Resource = {
  id: "nicbr-internet-responsa-adolescentes", slug: "internet-com-responsa-adolescentes",
  title: "Internet com Responsa — Só para Adolescentes",
  sourceUrl: "https://nic.br/media/docs/publicacoes/13/pt-br/20251020185522/internet_com_responsa_adolescentes.pdf",
  canonicalUrl: "https://www.nic.br/publicacao/internet-com-responsa-so-para-adolescentes-protecao-no-uso-da-internet/",
  provider: "NIC.br", type: "text", language: "Português do Brasil",
  topic: "Proteção, convivência e uso responsável da Internet",
  summary: "Guia para adolescentes sobre oportunidades e riscos da vida digital, com discussões sobre cyberbullying, convivência, privacidade, apostas, intimidade, tempo de tela e inteligência artificial.",
  additionalInformation: "A publicação foi elaborada a partir de conversas com adolescentes de diferentes regiões do Brasil e contém perguntas e situações para reflexão. O PDF consultado tem 44 páginas. O professor pode selecionar capítulos de acordo com o objetivo e a turma, utilizando leitura digital ou impressão. A fonte não informa duração ou anos escolares específicos; a recomendação do 7º ao 9º ano é curatorial. O próprio PDF declara CC BY-ND, sem indicar versão da licença, prevalecendo sobre a licença geral do portal.",
  recommendedGrades: [7, 8, 9],
  curatorNotes: "Anos, familiaridade, função pedagógica e sugestão de discussão são curatoriais. Não transformar o guia completo em uma aula com duração presumida; a licença específica do PDF é CC BY-ND, com versão não indicada.",
  curriculum: { alignments: [
    createCurriculumAlignment({
      grade: 7, axis: "Cultura Digital", knowledgeObject: "Cyberbullying e convivência na Internet",
      skillCode: "EF07CO09", competencies: [1, 7],
      rationale: "O capítulo sobre cyberbullying, comunidades e convívio fornece situações e reflexões para reconhecer e debater violência online.",
    }),
    createCurriculumAlignment({
      grade: 8, axis: "Cultura Digital", knowledgeObject: "Segurança e privacidade em ambientes virtuais",
      skillCode: "EF08CO10", competencies: [1, 7],
      rationale: "A leitura e a discussão dos capítulos sobre intimidade, riscos e proteção de informações mobilizam segurança e privacidade em ambientes virtuais.",
    }),
    createCurriculumAlignment({
      grade: 9, axis: "Cultura Digital", knowledgeObject: "Impactos das tecnologias digitais",
      skillCode: "EF09CO07", competencies: [1, 2, 7], strength: "partial",
      rationale: "O guia discute implicações sociais da IA, das plataformas e do tempo de tela; a elaboração de alternativas e a análise abrangente prevista na habilidade precisam de aprofundamento docente.",
    }),
  ] },
  pedagogy: {
    learningObjective: "Reconhecer riscos do ambiente online e fazer escolhas mais seguras, conscientes e autônomas no uso da Internet.",
    pedagogicalFunction: "exposition",
    materials: ["Guia em PDF ou exemplar impresso"],
  },
  requirements: { internet: false, accountRequired: false, pricing: "free" },
  accessibility: { evaluationStatus: "pending", knownFeatures: [], potentialBarriers: [], alternatives: [] },
  provenance: { source: "NIC.br — publicação oficial e PDF Internet com Responsa: Só para Adolescentes", license: "CC BY-ND (versão não indicada no PDF)", lastVerifiedAt: LAST_VERIFIED_AT, status: "verified" },
  supplementaryLinks: [{ label: "Página oficial da publicação", url: "https://www.nic.br/publicacao/internet-com-responsa-so-para-adolescentes-protecao-no-uso-da-internet/" }],
  tags: ["cidadania digital", "cyberbullying", "privacidade", "segurança online", "redes sociais", "convivência", "tempo de tela", "inteligência artificial", "apostas", "guia", "adolescentes"],
};

export const additionalTeachingMaterials: Resource[] = [bugs, tetris, automata, logicGates, oceans, nameBadge, internetGuide];
