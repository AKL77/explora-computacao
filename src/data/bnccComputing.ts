import type {
  BnccAxis,
  CompetencyNumber,
  CompetencyReference,
  CurriculumAlignment,
  CurriculumMappingKind,
  CurriculumMappingStrength,
  Grade,
  SkillReference,
  ValidationStatus,
} from "@/domain/curriculum";

export const BNCC_COMPUTING_SOURCE_URL =
  "https://basenacionalcomum.mec.gov.br/images/historico/anexo_parecer_cneceb_n_2_2022_bncc_computacao.pdf";

export const BNCC_COMPUTING_SOURCE_EDITION =
  "Computação na Educação Básica — Complemento à BNCC (2022)";

const officialSkill = (code: string, officialText: string): SkillReference => ({
  code,
  officialText,
  sourceEdition: BNCC_COMPUTING_SOURCE_EDITION,
  sourceUrl: BNCC_COMPUTING_SOURCE_URL,
  validationStatus: "validated",
});

export const BNCC_SKILLS = {
  EF04CO01: officialSkill(
    "EF04CO01",
    "Reconhecer objetos do mundo real e/ou digital que podem ser representados através de matrizes que estabelecem uma organização na qual cada componente está em uma posição definida por coordenadas, fazendo manipulações simples sobre estas representações.",
  ),
  EF04CO03: officialSkill(
    "EF04CO03",
    "Criar e simular algoritmos representados em linguagem oral, escrita ou pictográfica, que incluam sequências e repetições simples e aninhadas (iterações definidas e indefinidas), para resolver problemas de forma independente e em colaboração.",
  ),
  EF04CO04: officialSkill(
    "EF04CO04",
    "Entender que para guardar, manipular e transmitir dados deve-se codificá-los de alguma forma que seja compreendida pela máquina (formato digital).",
  ),
  EF04CO05: officialSkill(
    "EF04CO05",
    "Codificar diferentes informações para representação em computador (binária, ASCII, atributos de pixel, como RGB etc.).",
  ),
  EF04CO07: officialSkill(
    "EF04CO07",
    "Demonstrar postura ética nas atividades de coleta, transferência, guarda e uso de dados.",
  ),
  EF04CO08: officialSkill(
    "EF04CO08",
    "Reconhecer a importância de verificar a confiabilidade das fontes de informações obtidas na Internet.",
  ),
  EF05CO01: officialSkill(
    "EF05CO01",
    "Reconhecer objetos do mundo real e/ou digital que podem ser representados através de listas que estabelecem uma organização na qual há um número variável de itens dispostos em sequência, fazendo manipulações simples sobre estas representações.",
  ),
  EF05CO02: officialSkill(
    "EF05CO02",
    "Reconhecer objetos do mundo real e digital que podem ser representados através de grafos que estabelecem uma organização com uma quantidade variável de vértices conectados por arestas, fazendo manipulações simples sobre estas representações.",
  ),
  EF05CO03: officialSkill(
    "EF05CO03",
    "Realizar operações de negação, conjunção e disjunção sobre sentenças lógicas e valores 'verdadeiro' e 'falso'.",
  ),
  EF05CO04: officialSkill(
    "EF05CO04",
    "Criar e simular algoritmos representados em linguagem oral, escrita ou pictográfica, que incluam sequências, repetições e seleções condicionais para resolver problemas de forma independente e em colaboração.",
  ),
  EF05CO06: officialSkill(
    "EF05CO06",
    "Reconhecer que os dados podem ser armazenados em um dispositivo local ou remoto.",
  ),
  EF05CO08: officialSkill(
    "EF05CO08",
    "Acessar as informações na Internet de forma crítica para distinguir os conteúdos confiáveis de não confiáveis.",
  ),
  EF05CO09: officialSkill(
    "EF05CO09",
    "Usar informações considerando aplicações e limites dos direitos autorais em diferentes mídias digitais.",
  ),
  EF05CO10: officialSkill(
    "EF05CO10",
    "Expressar-se crítica e criativamente na compreensão das mudanças tecnológicas no mundo do trabalho e sobre a evolução da sociedade.",
  ),
  EF05CO11: officialSkill(
    "EF05CO11",
    "Identificar a adequação de diferentes tecnologias computacionais na resolução de problemas.",
  ),
  EF15CO01: officialSkill(
    "EF15CO01",
    "Identificar as principais formas de organizar e representar a informação de maneira estruturada (matrizes, registros, listas e grafos) ou não estruturada (números, palavras, valores verdade).",
  ),
  EF15CO02: officialSkill(
    "EF15CO02",
    "Construir e simular algoritmos, de forma independente ou em colaboração, que resolvam problemas simples e do cotidiano com uso de sequências, seleções condicionais e repetições de instruções.",
  ),
  EF15CO04: officialSkill(
    "EF15CO04",
    "Aplicar a estratégia de decomposição para resolver problemas complexos, dividindo esse problema em partes menores, resolvendo-as e combinando suas soluções.",
  ),
  EF15CO09: officialSkill(
    "EF15CO09",
    "Entender que as tecnologias devem ser utilizadas de maneira segura, ética e responsável, respeitando direitos autorais, de imagem e as leis vigentes.",
  ),
  EF06CO06: officialSkill(
    "EF06CO06",
    "Comparar diferentes casos particulares (instâncias) de um mesmo problema, identificando as semelhanças e diferenças entre eles, e criar um algoritmo para resolver todos, fazendo uso de variáveis (parâmetros) para permitir o tratamento de todos os casos de forma genérica.",
  ),
  EF06CO07: officialSkill(
    "EF06CO07",
    "Entender o processo de transmissão de dados, como a informação é quebrada em pedaços, transmitida em pacotes através de múltiplos equipamentos, e reconstruída no destino.",
  ),
  EF06CO08: officialSkill(
    "EF06CO08",
    "Compreender e utilizar diferentes formas de armazenar, manipular, compactar e recuperar arquivos, documentos e metadados.",
  ),
  EF06CO09: officialSkill(
    "EF06CO09",
    "Apresentar conduta e linguagem apropriadas ao se comunicar em ambiente digital, considerando a ética e o respeito.",
  ),
  EF07CO03: officialSkill(
    "EF07CO03",
    "Construir soluções computacionais de problemas de diferentes áreas do conhecimento, de forma individual e colaborativa, selecionando as estruturas de dados e técnicas adequadas, aperfeiçoando e articulando saberes escolares.",
  ),
  EF07CO04: officialSkill(
    "EF07CO04",
    "Explorar propriedades básicas de grafos.",
  ),
  EF07CO05: officialSkill(
    "EF07CO05",
    "Criar algoritmos fazendo uso da decomposição e do reúso no processo de solução de forma colaborativa e cooperativa e automatizá-los usando uma linguagem de programação.",
  ),
  EF07CO06: officialSkill(
    "EF07CO06",
    "Compreender o papel de protocolos para a transmissão de dados.",
  ),
  EF07CO07: officialSkill(
    "EF07CO07",
    "Identificar problemas de segurança cibernética e experimentar formas de proteção.",
  ),
  EF07CO09: officialSkill(
    "EF07CO09",
    "Reconhecer e debater sobre cyberbullying.",
  ),
  EF08CO03: officialSkill(
    "EF08CO03",
    "Utilizar algoritmos clássicos de manipulação sobre listas.",
  ),
  EF08CO05: officialSkill(
    "EF08CO05",
    "Compreender os conceitos de paralelismo, concorrência e armazenamento/processamento distribuídos.",
  ),
  EF08CO06: officialSkill(
    "EF08CO06",
    "Entender como é a estrutura e funcionamento da internet.",
  ),
  EF08CO10: officialSkill(
    "EF08CO10",
    "Discutir questões sobre segurança e privacidade relacionadas ao uso dos ambientes virtuais.",
  ),
  EF09CO02: officialSkill(
    "EF09CO02",
    "Construir soluções computacionais de problemas de diferentes áreas do conhecimento, de forma individual e colaborativa, selecionando as estruturas de dados e técnicas adequadas, aperfeiçoando e articulando saberes escolares.",
  ),
  EF09CO03: officialSkill(
    "EF09CO03",
    "Usar autômatos para descrever comportamentos de forma abstrata automatizando-os através de uma linguagem de programação baseada em eventos.",
  ),
  EF09CO05: officialSkill(
    "EF09CO05",
    "Analisar técnicas de criptografia para armazenamento e transmissão de dados.",
  ),
  EF09CO07: officialSkill(
    "EF09CO07",
    "Avaliar aplicações e implicações políticas, socioambientais e culturais das tecnologias digitais para propor alternativas aos desafios do mundo contemporâneo, incluindo aqueles relativos ao mundo do trabalho.",
  ),
} as const;

const officialCompetency = (
  number: CompetencyNumber,
  officialText: string,
): CompetencyReference => ({
  number,
  officialText,
  sourceEdition: BNCC_COMPUTING_SOURCE_EDITION,
  sourceUrl: BNCC_COMPUTING_SOURCE_URL,
  validationStatus: "validated",
});

export const BNCC_COMPETENCIES: Record<
  CompetencyNumber,
  CompetencyReference
> = {
  1: officialCompetency(
    1,
    "Compreender a Computação como uma área de conhecimento que contribui para explicar o mundo atual e ser um agente ativo e consciente de transformação capaz de analisar criticamente seus impactos sociais, ambientais, culturais, econômicos, científicos, tecnológicos, legais e éticos.",
  ),
  2: officialCompetency(
    2,
    "Reconhecer o impacto dos artefatos computacionais e os respectivos desafios para os indivíduos na sociedade, discutindo questões socioambientais, culturais, científicas, políticas e econômicas.",
  ),
  3: officialCompetency(
    3,
    "Expressar e partilhar informações, ideias, sentimentos e soluções computacionais utilizando diferentes linguagens e tecnologias da Computação de forma criativa, crítica, significativa, reflexiva e ética.",
  ),
  4: officialCompetency(
    4,
    "Aplicar os princípios e técnicas da Computação e suas tecnologias para identificar problemas e criar soluções computacionais, preferencialmente de forma cooperativa, bem como alicerçar descobertas em diversas áreas do conhecimento seguindo uma abordagem científica e inovadora, considerando os impactos sob diferentes contextos.",
  ),
  5: officialCompetency(
    5,
    "Avaliar as soluções e os processos envolvidos na resolução computacional de problemas de diversas áreas do conhecimento, sendo capaz de construir argumentações coerentes e consistentes, utilizando conhecimentos da Computação para argumentar em diferentes contextos com base em fatos e informações confiáveis com respeito à diversidade de opiniões, saberes, identidades e culturas.",
  ),
  6: officialCompetency(
    6,
    "Desenvolver projetos, baseados em problemas, desafios e oportunidades que façam sentido ao contexto ou interesse do estudante, de maneira individual e/ou cooperativa, fazendo uso da Computação e suas tecnologias, utilizando conceitos, técnicas e ferramentas computacionais que possibilitem automatizar processos em diversas áreas do conhecimento com base em princípios éticos, democráticos, sustentáveis e solidários, valorizando a diversidade de indivíduos e de grupos sociais, de maneira inclusiva.",
  ),
  7: officialCompetency(
    7,
    "Agir pessoal e coletivamente com respeito, autonomia, responsabilidade, flexibilidade, resiliência e determinação, identificando e reconhecendo seus direitos e deveres, recorrendo aos conhecimentos da Computação e suas tecnologias para tomar decisões frente às questões de diferentes naturezas.",
  ),
};

type BnccSkillCode = keyof typeof BNCC_SKILLS;

interface AlignmentInput {
  grade: Grade;
  axis: BnccAxis;
  knowledgeObject: string;
  skillCode: BnccSkillCode;
  competencies: CompetencyNumber[];
  rationale: string;
  kind?: CurriculumMappingKind;
  strength?: CurriculumMappingStrength;
  validationStatus?: ValidationStatus;
}

export function createCurriculumAlignment({
  grade,
  axis,
  knowledgeObject,
  skillCode,
  competencies,
  rationale,
  kind = "curatorial",
  strength = "strong",
  validationStatus = kind === "source-declared" ? "validated" : "pending",
}: AlignmentInput): CurriculumAlignment {
  return {
    grade,
    axis,
    knowledgeObject,
    skill: { ...BNCC_SKILLS[skillCode] },
    competencies: competencies.map((number) => ({
      ...BNCC_COMPETENCIES[number],
    })),
    mapping: {
      kind,
      strength,
      rationale,
      validationStatus,
    },
  };
}
