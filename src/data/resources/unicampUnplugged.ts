import type { CurriculumAlignment, Grade } from "@/domain/curriculum";
import type { ParticipationMode, Resource } from "@/domain/resource";
import { publicAsset } from "@/lib/publicAsset";

import { createCurriculumAlignment } from "../bnccComputing";

const COLLECTION_NAME = "Computação Desplugada — Unicamp";
const COLLECTION_LICENSE = "CC BY-NC-SA 4.0";
const LAST_VERIFIED_AT = "2026-08-28";

type UnicampSourceLevel =
  | "Anos Iniciais do Ensino Fundamental"
  | "Anos Finais do Ensino Fundamental"
  | "Anos Iniciais e Finais do Ensino Fundamental"
  | "Anos Finais do Ensino Fundamental e Ensino Médio";

const SOURCE_LEVEL_GRADES: Record<UnicampSourceLevel, readonly Grade[]> = {
  "Anos Iniciais do Ensino Fundamental": [4, 5],
  "Anos Finais do Ensino Fundamental": [6, 7, 8, 9],
  "Anos Iniciais e Finais do Ensino Fundamental": [4, 5, 6, 7, 8, 9],
  "Anos Finais do Ensino Fundamental e Ensino Médio": [6, 7, 8, 9],
};

interface UnicampActivityInput {
  number: number;
  slug: string;
  title: string;
  topic: string;
  sourceLevel: UnicampSourceLevel;
  summary: string;
  additionalInformation: string;
  recommendedGrades: Grade[];
  alignments: CurriculumAlignment[];
  materials: string[];
  participation?: ParticipationMode[];
  imageAlt: string;
  supplementaryLinks?: Array<{ label: string; url: string }>;
  tags: string[];
}

function getApplicableGrades(
  sourceLevel: UnicampSourceLevel,
  curatedGrades: readonly Grade[],
): Grade[] {
  return Array.from(
    new Set([...SOURCE_LEVEL_GRADES[sourceLevel], ...curatedGrades]),
  ).sort((left, right) => left - right);
}

function activitySource(number: number): string {
  return `https://desplugada.ime.unicamp.br/atividade${number}/index.html`;
}

function createUnicampActivity({
  number,
  slug,
  title,
  topic,
  sourceLevel,
  summary,
  additionalInformation,
  recommendedGrades,
  alignments,
  materials,
  participation,
  imageAlt,
  supplementaryLinks,
  tags,
}: UnicampActivityInput): Resource {
  return {
    id: `unicamp-desplugada-atividade-${number}`,
    slug: `unicamp-desplugada-${slug}`,
    title,
    sourceUrl: activitySource(number),
    provider: COLLECTION_NAME,
    type: "activity",
    language: "Português do Brasil",
    topic,
    summary,
    additionalInformation: `${additionalInformation} No site original, a indicação de público é “${sourceLevel}”. A duração não é informada pela fonte.`,
    recommendedGrades: getApplicableGrades(sourceLevel, recommendedGrades),
    curriculum: { alignments },
    pedagogy: {
      ...(participation ? { participation } : {}),
      materials,
    },
    requirements: {
      internet: false,
      devices: [],
      accountRequired: false,
      pricing: "free",
    },
    accessibility: {
      evaluationStatus: "pending",
      knownFeatures: [],
      potentialBarriers: [],
      alternatives: [],
    },
    provenance: {
      source: `${COLLECTION_NAME} — Atividade ${number}: ${topic}`,
      license: COLLECTION_LICENSE,
      curator: "Informática Explorer",
      lastVerifiedAt: LAST_VERIFIED_AT,
      status: "verified",
    },
    image: {
      src: publicAsset(
        `images/cards/unicamp/atividade-${String(number).padStart(2, "0")}.png`,
      ),
      thumbnailSrc: publicAsset(
        `images/cards/thumbnails/unicamp/atividade-${String(number).padStart(2, "0")}.jpg`,
      ),
      alt: imageAlt,
      license: COLLECTION_LICENSE,
    },
    ...(supplementaryLinks ? { supplementaryLinks } : {}),
    tags: ["computação desplugada", "Unicamp", ...tags],
  };
}

export const unicampUnpluggedResources: Resource[] = [
  createUnicampActivity({
    number: 1,
    slug: "contando-os-pontos",
    title: "Contando os Pontos — Números Binários",
    topic: "Números Binários",
    sourceLevel: "Anos Iniciais do Ensino Fundamental",
    summary:
      "Atividade com cinco cartões de valores 1, 2, 4, 8 e 16 para representar números por meio de cartões visíveis e ocultos, relacionando esses estados a zeros e uns do sistema binário.",
    additionalInformation:
      "A sequência permite converter números, criar mensagens e discutir como informações podem ser armazenadas e transmitidas em formato binário.",
    recommendedGrades: [4],
    alignments: [
      createCurriculumAlignment({
        grade: 4,
        axis: "Mundo Digital",
        knowledgeObject: "Codificação da informação",
        skillCode: "EF04CO04",
        competencies: [3, 4],
        rationale:
          "A dinâmica mostra que números e mensagens precisam ser codificados em um formato compreendido pela máquina.",
      }),
      createCurriculumAlignment({
        grade: 4,
        axis: "Mundo Digital",
        knowledgeObject: "Codificação da informação",
        skillCode: "EF04CO05",
        competencies: [3, 4],
        rationale:
          "A representação por cartões visíveis e ocultos trabalha explicitamente codificação binária com zeros e uns.",
      }),
    ],
    materials: [
      "Cinco cartões de demonstração com valores 1, 2, 4, 8 e 16",
      "Folhas de atividades",
    ],
    participation: ["individual", "group", "whole-class"],
    imageAlt:
      "Cartões com pontos usados para representar números binários na atividade Contando os Pontos",
    tags: ["números binários", "codificação", "bits", "representação"],
  }),
  createUnicampActivity({
    number: 2,
    slug: "colorindo-com-numeros",
    title: "Colorindo com Números — Representação de Imagens",
    topic: "Representação de Imagens",
    sourceLevel: "Anos Iniciais do Ensino Fundamental",
    summary:
      "Atividade de decodificar e criar imagens em grades de pixels a partir de sequências numéricas que indicam grupos de quadrados brancos e pretos. A técnica apresentada é uma forma de codificação por comprimento de sequência.",
    additionalInformation:
      "No 4º ano, o foco curatorial é matriz, coordenadas, pixels e codificação. No 6º, a mesma proposta pode ser retomada para comparar a imagem bruta com a codificação RLE e discutir compactação.",
    recommendedGrades: [4, 6],
    alignments: [
      createCurriculumAlignment({
        grade: 4,
        axis: "Pensamento Computacional",
        knowledgeObject: "Matrizes e registros",
        skillCode: "EF04CO01",
        competencies: [3, 4],
        rationale:
          "As imagens são organizadas em uma matriz de linhas e colunas, e cada pixel ocupa uma posição definida.",
      }),
      createCurriculumAlignment({
        grade: 4,
        axis: "Mundo Digital",
        knowledgeObject: "Codificação da informação",
        skillCode: "EF04CO04",
        competencies: [3, 4],
        rationale:
          "A imagem é guardada e recuperada por meio de uma codificação numérica legível como formato digital.",
      }),
      createCurriculumAlignment({
        grade: 4,
        axis: "Mundo Digital",
        knowledgeObject: "Codificação da informação",
        skillCode: "EF04CO05",
        competencies: [3, 4],
        rationale:
          "A atividade codifica atributos de pixels e reconstrói imagens digitais a partir dessa representação.",
      }),
      createCurriculumAlignment({
        grade: 6,
        axis: "Mundo Digital",
        knowledgeObject: "Gestão de dados",
        skillCode: "EF06CO08",
        competencies: [3, 4, 5],
        rationale:
          "A codificação por comprimento de sequência permite manipular, compactar e recuperar a imagem, comparando representações.",
      }),
    ],
    materials: ["Projetor, se disponível", "Folhas com grades de pixels", "Lápis"],
    imageAlt:
      "Grade de pixels em preto e branco da atividade Colorindo com Números",
    tags: ["pixels", "matrizes", "RLE", "compressão", "imagens digitais"],
  }),
  createUnicampActivity({
    number: 3,
    slug: "voce-pode-repetir",
    title: "Você Pode Repetir? — Compressão de Texto",
    topic: "Compressão de Texto",
    sourceLevel: "Anos Iniciais do Ensino Fundamental",
    summary:
      "Atividade de localizar letras, palavras e frases repetidas e substituí-las por referências, reduzindo o espaço necessário para representar um texto. A proposta relaciona a estratégia à compressão do tipo Lempel–Ziv.",
    additionalInformation:
      "Embora a Unicamp indique Anos Iniciais, o 6º ano é a primeira correspondência anual, dentro do recorte do projeto, cuja habilidade menciona explicitamente compactação. Não foi usado EF04CO03, pois repetição textual não equivale a laço algorítmico.",
    recommendedGrades: [6],
    alignments: [
      createCurriculumAlignment({
        grade: 6,
        axis: "Mundo Digital",
        knowledgeObject: "Gestão de dados",
        skillCode: "EF06CO08",
        competencies: [3, 4, 5],
        rationale:
          "Os estudantes compactam e recuperam textos por referências a padrões repetidos e podem comparar o tamanho das representações.",
      }),
    ],
    materials: ["Texto ou poema para projeção", "Folhas de atividade", "Lápis"],
    imageAlt:
      "Trecho de texto ilustrado para a atividade Você Pode Repetir?",
    tags: ["compressão", "texto", "Lempel-Ziv", "padrões"],
  }),
  createUnicampActivity({
    number: 4,
    slug: "a-magica-de-virar-as-cartas",
    title: "A Mágica de Virar as Cartas — Detecção e Correção de Erros",
    topic: "Detecção e Correção de Erros",
    sourceLevel: "Anos Iniciais do Ensino Fundamental",
    summary:
      "Demonstração com uma matriz de cartas em dois estados e uma regra de paridade por linha e coluna. Quando uma carta é virada, a turma usa as paridades alteradas para localizar e corrigir o erro.",
    additionalInformation:
      "A atividade também pode ser relacionada a dígitos verificadores de ISBN e códigos de barras. A correspondência do 6º ano é parcial: a explicação oficial da habilidade aborda partes corrompidas na transmissão, mas não cita códigos de paridade.",
    recommendedGrades: [4, 6],
    alignments: [
      createCurriculumAlignment({
        grade: 4,
        axis: "Pensamento Computacional",
        knowledgeObject: "Matrizes e registros",
        skillCode: "EF04CO01",
        competencies: [4, 5],
        rationale:
          "A regra de paridade é aplicada sobre linhas e colunas de uma matriz para identificar a posição alterada.",
      }),
      createCurriculumAlignment({
        grade: 4,
        axis: "Mundo Digital",
        knowledgeObject: "Codificação da informação",
        skillCode: "EF04CO05",
        competencies: [4, 5],
        rationale:
          "Os dois estados das cartas representam bits, aos quais são acrescentadas informações de paridade.",
      }),
      createCurriculumAlignment({
        grade: 6,
        axis: "Mundo Digital",
        knowledgeObject: "Fundamentos de transmissão de dados",
        skillCode: "EF06CO07",
        competencies: [4, 5],
        strength: "partial",
        rationale:
          "A dinâmica permite discutir detecção e reconstrução de informação corrompida, aspecto citado na explicação oficial da habilidade, sem simular todo o percurso de pacotes.",
      }),
    ],
    materials: [
      "Trinta e seis cartas com duas faces",
      "Quadro metálico ou superfície para organizar a matriz",
    ],
    participation: ["group", "whole-class"],
    imageAlt:
      "Matriz de cartas usada para demonstrar paridade e localizar uma carta virada",
    tags: ["paridade", "detecção de erros", "matrizes", "bits"],
  }),
  createUnicampActivity({
    number: 5,
    slug: "vinte-palpites",
    title: "Vinte Palpites — Teoria da Informação",
    topic: "Teoria da Informação",
    sourceLevel: "Anos Iniciais do Ensino Fundamental",
    summary:
      "Jogo de perguntas com respostas sim ou não em que os estudantes procuram reduzir pela metade o conjunto de possibilidades a cada rodada. A extensão registra árvores de decisão e relaciona cada resposta a um bit de informação.",
    additionalInformation:
      "No 5º ano, o foco é construir decisões condicionais. O alinhamento do 8º ano só se aplica quando a estratégia de divisão pela metade é formalizada como busca binária sobre candidatos ordenados.",
    recommendedGrades: [5, 8],
    alignments: [
      createCurriculumAlignment({
        grade: 5,
        axis: "Pensamento Computacional",
        knowledgeObject: "Algoritmos com seleção condicional",
        skillCode: "EF05CO04",
        competencies: [3, 4, 5],
        rationale:
          "A estratégia é construída como uma sequência de perguntas condicionais, repetidas até identificar o elemento escolhido.",
      }),
      createCurriculumAlignment({
        grade: 8,
        axis: "Pensamento Computacional",
        knowledgeObject: "Algoritmos clássicos",
        skillCode: "EF08CO03",
        competencies: [3, 4, 5],
        strength: "partial",
        rationale:
          "A correspondência depende de formalizar a redução sucessiva do intervalo como busca binária em uma lista ordenada.",
      }),
    ],
    materials: ["Folha para registrar perguntas", "Árvore de decisão da extensão"],
    participation: ["pair", "group", "whole-class"],
    imageAlt:
      "Título ilustrado da atividade Vinte Palpites sobre teoria da informação",
    tags: ["busca binária", "árvore de decisão", "bits", "condicionais"],
  }),
  createUnicampActivity({
    number: 6,
    slug: "batalha-naval",
    title: "Batalha Naval — Algoritmos de Busca",
    topic: "Algoritmos de Busca",
    sourceLevel: "Anos Iniciais e Finais do Ensino Fundamental",
    summary:
      "Três variações de Batalha Naval para experimentar busca linear, busca binária e busca por dispersão. Os estudantes registram tentativas e comparam como a organização dos dados altera a eficiência da busca.",
    additionalInformation:
      "No 5º ano, a busca é uma manipulação concreta de listas. No 8º, a atividade permite estudo formal de algoritmos clássicos, melhor e pior caso; hashing permanece como enriquecimento não nomeado no enunciado da habilidade.",
    recommendedGrades: [5, 8],
    alignments: [
      createCurriculumAlignment({
        grade: 5,
        axis: "Pensamento Computacional",
        knowledgeObject: "Listas e grafos",
        skillCode: "EF05CO01",
        competencies: [4, 5],
        rationale:
          "Os estudantes representam itens em sequência, procuram elementos e observam como a organização da lista interfere na busca.",
      }),
      createCurriculumAlignment({
        grade: 8,
        axis: "Pensamento Computacional",
        knowledgeObject: "Algoritmos clássicos",
        skillCode: "EF08CO03",
        competencies: [4, 5],
        rationale:
          "A atividade utiliza e compara busca linear e binária sobre listas, exemplos citados na explicação oficial da habilidade.",
      }),
    ],
    materials: ["Folhas de Batalha Naval para cada dupla", "Lápis"],
    participation: ["pair"],
    imageAlt:
      "Tabuleiros da atividade Batalha Naval usados para comparar algoritmos de busca",
    tags: ["busca linear", "busca binária", "hashing", "listas"],
  }),
  createUnicampActivity({
    number: 7,
    slug: "o-mais-leve-e-o-mais-pesado",
    title: "O Mais Leve e o Mais Pesado — Algoritmos de Ordenação",
    topic: "Algoritmos de Ordenação",
    sourceLevel: "Anos Iniciais e Finais do Ensino Fundamental",
    summary:
      "Desafio de ordenar oito recipientes por peso usando apenas comparações entre pares. A atividade apresenta e compara estratégias como inserção, bolha, intercalação e ordenação rápida.",
    additionalInformation:
      "No 5º ano, a ordenação é uma manipulação concreta de listas. No 8º, podem ser comparados algoritmos clássicos e o número de comparações. Recursão só deve ser associada com uma extensão programada, ausente no material básico.",
    recommendedGrades: [5, 8],
    alignments: [
      createCurriculumAlignment({
        grade: 5,
        axis: "Pensamento Computacional",
        knowledgeObject: "Listas e grafos",
        skillCode: "EF05CO01",
        competencies: [4, 5],
        rationale:
          "Os recipientes formam uma sequência que é manipulada até ficar ordenada por meio de comparações.",
      }),
      createCurriculumAlignment({
        grade: 8,
        axis: "Pensamento Computacional",
        knowledgeObject: "Algoritmos clássicos",
        skillCode: "EF08CO03",
        competencies: [4, 5],
        rationale:
          "A turma utiliza, compara e avalia algoritmos clássicos de ordenação sobre uma lista.",
      }),
    ],
    materials: [
      "Oito recipientes iguais com pesos diferentes",
      "Balança de dois pratos",
    ],
    participation: ["group", "whole-class"],
    imageAlt:
      "Balança e recipientes da atividade O Mais Leve e o Mais Pesado",
    tags: ["ordenação", "listas", "comparação", "algoritmos"],
  }),
  createUnicampActivity({
    number: 8,
    slug: "seja-o-mais-rapido",
    title: "Seja o Mais Rápido! — Redes de Ordenação",
    topic: "Redes de Ordenação",
    sourceLevel: "Anos Iniciais e Finais do Ensino Fundamental",
    summary:
      "Seis estudantes percorrem uma rede desenhada no chão e comparam valores simultaneamente em pontos definidos. A dinâmica contrasta execução serial e paralela e mostra como tarefas independentes podem ocorrer ao mesmo tempo.",
    additionalInformation:
      "O núcleo curricular é paralelismo no 8º ano. A ordenação por rede também pode apoiar algoritmos clássicos, mas essa segunda correspondência é complementar.",
    recommendedGrades: [8],
    alignments: [
      createCurriculumAlignment({
        grade: 8,
        axis: "Mundo Digital",
        knowledgeObject: "Fundamentos de sistemas distribuídos",
        skillCode: "EF08CO05",
        competencies: [4, 5],
        rationale:
          "Comparações independentes são executadas simultaneamente, permitindo observar paralelismo e comparar tempos de execução.",
      }),
      createCurriculumAlignment({
        grade: 8,
        axis: "Pensamento Computacional",
        knowledgeObject: "Algoritmos clássicos",
        skillCode: "EF08CO03",
        competencies: [4, 5],
        strength: "partial",
        rationale:
          "A rede realiza ordenação de uma lista, mas o foco principal do material é a execução paralela das comparações.",
      }),
    ],
    materials: ["Giz ou fita para desenhar a rede", "Cartões numerados", "Cronômetro"],
    participation: ["group", "whole-class"],
    imageAlt:
      "Rede de ordenação percorrida por estudantes na atividade Seja o Mais Rápido!",
    tags: ["paralelismo", "redes de ordenação", "concorrência", "algoritmos"],
  }),
  createUnicampActivity({
    number: 9,
    slug: "a-cidade-enlameada",
    title: "A Cidade Enlameada — Árvores Geradoras Mínimas",
    topic: "Árvores Geradoras Mínimas",
    sourceLevel: "Anos Finais do Ensino Fundamental e Ensino Médio",
    summary:
      "Desafio em que os estudantes conectam todas as casas de uma cidade usando o menor comprimento total de ruas. A dinâmica introduz grafos, conectividade, ciclos, árvores geradoras e comparação de estratégias de otimização.",
    additionalInformation:
      "A proposta utiliza uma folha com o mapa da cidade e permite discutir o algoritmo de Kruskal depois da exploração das soluções criadas pela turma.",
    recommendedGrades: [7],
    alignments: [
      createCurriculumAlignment({
        grade: 7,
        axis: "Pensamento Computacional",
        knowledgeObject: "Propriedades de grafos",
        skillCode: "EF07CO04",
        competencies: [4, 5],
        rationale:
          "A turma representa a rede como grafo, trabalha conectividade e ciclos, constrói árvores geradoras e compara estratégias para reduzir o comprimento total.",
      }),
    ],
    materials: ["Folha de atividade com o mapa da cidade", "Lápis"],
    imageAlt:
      "Ilustração da atividade A Cidade Enlameada, com casas conectadas por caminhos",
    tags: ["grafos", "árvore geradora mínima", "otimização", "Kruskal"],
  }),
  createUnicampActivity({
    number: 10,
    slug: "o-jogo-da-laranja",
    title: "O Jogo da Laranja — Roteamento e Bloqueios nas Redes",
    topic: "Roteamento e Bloqueios nas Redes",
    sourceLevel: "Anos Iniciais e Finais do Ensino Fundamental",
    summary:
      "Jogo em roda no qual cada participante deve encaminhar laranjas identificadas até seus destinos, usando apenas mãos vazias adjacentes. A dinâmica modela concorrência por recursos, congestionamento e bloqueio.",
    additionalInformation:
      "Cada participante recebe duas laranjas ou bolas identificadas; uma mão deve permanecer vazia para permitir os movimentos. A página relaciona o jogo a travas de dados e computação paralela.",
    recommendedGrades: [8],
    alignments: [
      createCurriculumAlignment({
        grade: 8,
        axis: "Mundo Digital",
        knowledgeObject: "Fundamentos de sistemas distribuídos",
        skillCode: "EF08CO05",
        competencies: [4, 5],
        rationale:
          "O jogo modela concorrência por recursos, congestionamento e bloqueio, conceitos centrais de sistemas distribuídos.",
      }),
    ],
    materials: [
      "Duas laranjas ou bolas de tênis por participante",
      "Etiquetas para identificar os objetos",
    ],
    participation: ["group", "whole-class"],
    imageAlt:
      "Ilustração de participantes em roda na atividade O Jogo da Laranja",
    tags: ["concorrência", "deadlock", "roteamento", "sistemas distribuídos"],
  }),
  createUnicampActivity({
    number: 11,
    slug: "caca-ao-tesouro",
    title: "Caça ao Tesouro — Autômatos de Estados Finitos",
    topic: "Autômatos de Estados Finitos",
    sourceLevel: "Anos Iniciais e Finais do Ensino Fundamental",
    summary:
      "Percurso por ilhas em que instruções do tipo A ou B determinam a próxima posição. Ao registrar rotas e representar as transições, os estudantes exploram estados, entradas, caminhos e estados finais de um autômato.",
    additionalInformation:
      "A correspondência curricular é parcial: a dinâmica cobre a representação abstrata por estados e transições, mas a habilidade do 9º ano só é integralmente atendida com uma extensão em linguagem de programação baseada em eventos.",
    recommendedGrades: [9],
    alignments: [
      createCurriculumAlignment({
        grade: 9,
        axis: "Pensamento Computacional",
        knowledgeObject: "Autômatos e linguagens baseadas em eventos",
        skillCode: "EF09CO03",
        competencies: [3, 4, 5],
        strength: "partial",
        rationale:
          "A atividade desenvolve estados, transições, entradas e descrição abstrata de comportamentos, mas não realiza a automatização em linguagem baseada em eventos exigida pela habilidade completa.",
      }),
    ],
    materials: [
      "Cartões de demonstração",
      "Cartões de ilhas",
      "Mapa para registro das rotas",
    ],
    imageAlt:
      "Ilustração de ilhas e rotas da atividade Caça ao Tesouro",
    tags: ["autômatos", "estados", "transições", "linguagens formais"],
  }),
  createUnicampActivity({
    number: 12,
    slug: "seguindo-instrucoes",
    title: "Seguindo Instruções — Linguagens de Programação",
    topic: "Linguagens de Programação",
    sourceLevel: "Anos Iniciais do Ensino Fundamental",
    summary:
      "Atividade de comunicação algorítmica em que um estudante descreve uma figura e os demais tentam reproduzi-la sem vê-la. A comparação dos resultados evidencia precisão, teste e refinamento de instruções.",
    additionalInformation:
      "A proposta trabalha diretamente sequência e clareza algorítmica. A correspondência com EF15CO02 é parcial porque a atividade publicada não exige seleções condicionais nem repetições.",
    recommendedGrades: [4, 5],
    alignments: [
      createCurriculumAlignment({
        grade: 4,
        axis: "Pensamento Computacional",
        knowledgeObject: "Algoritmos",
        skillCode: "EF15CO02",
        competencies: [3, 4, 5],
        strength: "partial",
        rationale:
          "Descrever, executar, testar e refinar instruções trabalha sequências e precisão algorítmica; seleções condicionais e repetições não são exigidas na proposta.",
      }),
      createCurriculumAlignment({
        grade: 5,
        axis: "Pensamento Computacional",
        knowledgeObject: "Algoritmos",
        skillCode: "EF15CO02",
        competencies: [3, 4, 5],
        strength: "partial",
        rationale:
          "Descrever, executar, testar e refinar instruções trabalha sequências e precisão algorítmica; seleções condicionais e repetições não são exigidas na proposta.",
      }),
    ],
    materials: ["Cartões com figuras", "Papel", "Lápis", "Régua"],
    participation: ["pair", "group"],
    imageAlt:
      "Ilustração de uma figura geométrica usada na atividade Seguindo Instruções",
    tags: ["algoritmos", "instruções", "precisão", "comunicação"],
  }),
  createUnicampActivity({
    number: 13,
    slug: "tabuas-de-pedra",
    title: "Tábuas de Pedra — Protocolos de Comunicação na Rede",
    topic: "Protocolos de Comunicação na Rede",
    sourceLevel: "Anos Finais do Ensino Fundamental e Ensino Médio",
    summary:
      "Simulação em que uma mensagem é fragmentada em tábuas que podem chegar atrasadas, fora de ordem ou não chegar. A turma cria e revisa regras para ordenar, confirmar o recebimento e reenviar partes da mensagem.",
    additionalInformation:
      "A dinâmica permite observar cabeçalhos, numeração de pacotes, confirmação de recebimento e recuperação de falhas em um protocolo de comunicação.",
    recommendedGrades: [6, 7],
    alignments: [
      createCurriculumAlignment({
        grade: 6,
        axis: "Mundo Digital",
        knowledgeObject: "Fundamentos de transmissão de dados",
        skillCode: "EF06CO07",
        competencies: [3, 4, 5],
        rationale:
          "A mensagem é dividida, sujeita a atraso, perda e desordenação, e depois reconstruída com informações de controle.",
      }),
      createCurriculumAlignment({
        grade: 7,
        axis: "Mundo Digital",
        knowledgeObject: "Protocolos de comunicação em redes",
        skillCode: "EF07CO06",
        competencies: [3, 4, 5],
        rationale:
          "A turma cria, testa e revisa regras de comunicação, incluindo cabeçalho, confirmação de recebimento e reenvio.",
      }),
    ],
    materials: [
      "Tábuas ou cartões em branco",
      "Cartões de ação: entregar, atrasar e descartar",
    ],
    participation: ["group", "whole-class"],
    imageAlt:
      "Ilustração de tábuas numeradas usada na atividade sobre protocolos de comunicação",
    tags: ["protocolos", "pacotes", "transmissão de dados", "redes"],
  }),
  createUnicampActivity({
    number: 14,
    slug: "o-cartografo-pobre",
    title: "O Cartógrafo Pobre — Colorindo Mapas",
    topic: "Colorindo Mapas",
    sourceLevel: "Anos Finais do Ensino Fundamental e Ensino Médio",
    summary:
      "Desafio de colorir mapas de modo que regiões vizinhas tenham cores diferentes, usando o menor número possível de cores. A atividade converte o mapa em grafo e explora restrições de adjacência.",
    additionalInformation:
      "A explicação oficial da habilidade EF07CO04 cita coloração entre as propriedades de grafos, tornando esta uma correspondência curricular direta no nível conceitual.",
    recommendedGrades: [7],
    alignments: [
      createCurriculumAlignment({
        grade: 7,
        axis: "Pensamento Computacional",
        knowledgeObject: "Propriedades de grafos",
        skillCode: "EF07CO04",
        competencies: [4, 5],
        rationale:
          "A atividade representa mapas como grafos, aplica restrições de adjacência e minimiza cores; coloração é citada na explicação oficial da habilidade.",
      }),
    ],
    materials: [
      "Folhas com mapas",
      "Lápis ou marcadores",
      "Quatro cores diferentes",
    ],
    imageAlt:
      "Mapa com regiões coloridas para a atividade O Cartógrafo Pobre",
    tags: ["grafos", "coloração", "mapas", "restrições"],
  }),
  createUnicampActivity({
    number: 15,
    slug: "cidade-turistica",
    title: "Cidade Turística — Conjuntos Dominantes",
    topic: "Conjuntos Dominantes",
    sourceLevel: "Anos Finais do Ensino Fundamental e Ensino Médio",
    summary:
      "Problema de posicionar o menor número de carrinhos de sorvete para que todo cruzamento da cidade esteja a no máximo uma rua de um carrinho. A turma explora vizinhança e conjuntos dominantes em grafos.",
    additionalInformation:
      "A proposta pode ser resolvida por tentativa sistemática e comparação de soluções. O termo conjunto dominante não aparece nominalmente na BNCC, mas designa uma propriedade de grafos trabalhada diretamente na atividade.",
    recommendedGrades: [7],
    alignments: [
      createCurriculumAlignment({
        grade: 7,
        axis: "Pensamento Computacional",
        knowledgeObject: "Propriedades de grafos",
        skillCode: "EF07CO04",
        competencies: [4, 5],
        rationale:
          "A turma explora vértices, arestas, vizinhança e distância de um passo ao procurar e comparar conjuntos dominantes.",
      }),
    ],
    materials: [
      "Folha com o mapa da cidade",
      "Marcadores ou fichas para representar os carrinhos",
      "Projetor, se disponível",
    ],
    imageAlt:
      "Mapa de cidade com carrinhos de sorvete na atividade Cidade Turística",
    tags: ["grafos", "conjunto dominante", "otimização", "vizinhança"],
  }),
  createUnicampActivity({
    number: 16,
    slug: "estradas-de-gelo",
    title: "Estradas de Gelo — Árvores de Steiner",
    topic: "Árvores de Steiner",
    sourceLevel: "Anos Finais do Ensino Fundamental e Ensino Médio",
    summary:
      "Desafio de conectar pontos com o menor comprimento possível de barbante. Ao comparar redes, os estudantes exploram conectividade, ausência de ciclos, medição e a introdução de pontos de Steiner.",
    additionalInformation:
      "A correspondência é conceitual. O aprofundamento em árvores de Steiner e complexidade pode ser mantido como extensão opcional, sem ser necessário para a exploração de grafos no 7º ano.",
    recommendedGrades: [7],
    alignments: [
      createCurriculumAlignment({
        grade: 7,
        axis: "Pensamento Computacional",
        knowledgeObject: "Propriedades de grafos",
        skillCode: "EF07CO04",
        competencies: [4, 5],
        rationale:
          "A turma constrói redes conexas sem ciclos, mede comprimentos, introduz pontos intermediários e compara soluções.",
      }),
    ],
    materials: ["Estacas ou pinos", "Barbante", "Régua", "Papel", "Lápis"],
    imageAlt:
      "Pontos conectados por linhas na atividade Estradas de Gelo",
    tags: ["grafos", "árvore de Steiner", "otimização", "conectividade"],
  }),
  createUnicampActivity({
    number: 17,
    slug: "compartilhando-segredos",
    title: "Compartilhando Segredos — Informações Escondidas em Protocolos",
    topic: "Informações Escondidas em Protocolos",
    sourceLevel: "Anos Finais do Ensino Fundamental",
    summary:
      "Protocolo em que um grupo calcula a soma e a média das idades sem revelar os valores individuais. Um número aleatório inicia a sequência, cada participante acrescenta sua idade e apenas o resultado coletivo é divulgado.",
    additionalInformation:
      "A atividade permite uma progressão do problema de proteção no 7º ano para privacidade no 8º e análise de uma técnica criptográfica no 9º. Esta última correspondência é parcial e requer explicitar o mecanismo como protocolo de proteção de dados.",
    recommendedGrades: [7, 8, 9],
    alignments: [
      createCurriculumAlignment({
        grade: 7,
        axis: "Mundo Digital",
        knowledgeObject: "Fundamentos de Segurança Cibernética",
        skillCode: "EF07CO07",
        competencies: [1, 4, 5, 7],
        rationale:
          "Os estudantes identificam a exposição de valores individuais como problema e experimentam um protocolo de proteção.",
      }),
      createCurriculumAlignment({
        grade: 8,
        axis: "Cultura Digital",
        knowledgeObject: "Segurança em ambientes virtuais",
        skillCode: "EF08CO10",
        competencies: [1, 4, 5, 7],
        rationale:
          "A dinâmica oferece uma situação concreta para discutir privacidade e compartilhamento controlado de dados.",
      }),
      createCurriculumAlignment({
        grade: 9,
        axis: "Mundo Digital",
        knowledgeObject: "Segurança cibernética",
        skillCode: "EF09CO05",
        competencies: [1, 4, 5, 7],
        strength: "partial",
        rationale:
          "O protocolo pode ser analisado como técnica criptográfica para preservar dados, embora não realize criptografia de mensagens no sentido mais usual.",
      }),
    ],
    materials: ["Papel", "Lápis ou caneta", "Três ou mais participantes"],
    participation: ["group"],
    imageAlt:
      "Grupo compartilhando valores de forma protegida na atividade Compartilhando Segredos",
    tags: ["privacidade", "protocolos", "dados pessoais", "criptografia"],
  }),
  createUnicampActivity({
    number: 18,
    slug: "cara-ou-coroa",
    title: "Cara ou Coroa — Protocolos de Segurança",
    topic: "Protocolos de Segurança",
    sourceLevel: "Anos Finais do Ensino Fundamental e Ensino Médio",
    summary:
      "Protocolo para duas pessoas distantes produzirem uma escolha aleatória justa sem confiar uma na outra. A dinâmica usa entradas binárias, paridade e circuitos E/OU para discutir verificação, fraude e funções de mão única.",
    additionalInformation:
      "A página recomenda conhecimentos prévios de binário, paridade e funções de mão única. O alinhamento do 9º ano é uma extensão: a construção deve ser explicitamente analisada como técnica criptográfica.",
    recommendedGrades: [7, 9],
    alignments: [
      createCurriculumAlignment({
        grade: 7,
        axis: "Mundo Digital",
        knowledgeObject: "Protocolos de comunicação em redes",
        skillCode: "EF07CO06",
        competencies: [4, 5, 7],
        rationale:
          "Os estudantes executam e avaliam um conjunto público de regras para que participantes distantes produzam um resultado verificável.",
      }),
      createCurriculumAlignment({
        grade: 7,
        axis: "Mundo Digital",
        knowledgeObject: "Fundamentos de Segurança Cibernética",
        skillCode: "EF07CO07",
        competencies: [4, 5, 7],
        rationale:
          "A atividade apresenta a fraude como problema de segurança e permite experimentar um mecanismo de proteção e verificação.",
      }),
      createCurriculumAlignment({
        grade: 9,
        axis: "Mundo Digital",
        knowledgeObject: "Segurança cibernética",
        skillCode: "EF09CO05",
        competencies: [4, 5, 7],
        strength: "partial",
        rationale:
          "A correspondência exige aprofundar a função de mão única e analisar o protocolo como construção criptográfica.",
      }),
    ],
    materials: [
      "Folha com o circuito",
      "Vinte e quatro botões, fichas ou peças em duas cores",
    ],
    participation: ["pair", "group"],
    imageAlt:
      "Circuito lógico ilustrado da atividade Cara ou Coroa sobre protocolos de segurança",
    tags: ["protocolos", "segurança", "função de mão única", "circuitos lógicos"],
  }),
  createUnicampActivity({
    number: 19,
    slug: "criptografia-para-jovens",
    title: "Criptografia para Jovens — Criptografia de Chaves Públicas",
    topic: "Criptografia de Chaves Públicas",
    sourceLevel: "Anos Finais do Ensino Fundamental e Ensino Médio",
    summary:
      "Atividade que usa mapas públicos e privados representados por grafos para codificar e decodificar uma mensagem numérica. Valores são distribuídos pelos vértices e combinados localmente para proteger a informação.",
    additionalInformation:
      "É uma das propostas mais técnicas da coleção e a própria página recomenda atividades anteriores como preparação. O alinhamento de grafos no 7º ano é secundário; a criptografia de chave pública é o núcleo no 9º.",
    recommendedGrades: [7, 9],
    alignments: [
      createCurriculumAlignment({
        grade: 7,
        axis: "Pensamento Computacional",
        knowledgeObject: "Propriedades de grafos",
        skillCode: "EF07CO04",
        competencies: [1, 4, 5],
        strength: "partial",
        rationale:
          "O grafo e suas relações estruturam os mapas público e privado, mas são fundamento secundário da atividade criptográfica.",
      }),
      createCurriculumAlignment({
        grade: 9,
        axis: "Mundo Digital",
        knowledgeObject: "Segurança cibernética",
        skillCode: "EF09CO05",
        competencies: [1, 4, 5],
        rationale:
          "A turma analisa e executa diretamente uma técnica de chave pública para transmissão protegida de dados.",
      }),
    ],
    materials: [
      "Mapas público e privado",
      "Folhas para grupos",
      "Projetor, se disponível",
      "Lápis",
    ],
    participation: ["group"],
    imageAlt:
      "Grafo usado para representar chaves públicas e privadas na atividade Criptografia para Jovens",
    tags: ["criptografia", "chave pública", "grafos", "segurança"],
  }),
  createUnicampActivity({
    number: 20,
    slug: "a-fantastica-fabrica-de-chocolate",
    title: "A Fantástica Fábrica de Chocolate — Design de Interface Humana",
    topic: "Design de Interface Humana",
    sourceLevel: "Anos Finais do Ensino Fundamental e Ensino Médio",
    summary:
      "Sequência de análise e criação de interfaces a partir de portas, fogões, sinais, recipientes e ícones. Os estudantes avaliam correspondência entre forma e função, restrições, convenções culturais e compreensão pelo usuário.",
    additionalInformation:
      "Não há habilidade específica de interação humano-computador para o 6º–9º ano no complemento da BNCC. O cadastro usa a habilidade mais próxima, do 5º ano, mediante simplificação da atividade; o PDF oficial apresenta essa habilidade com o erro tipográfico EF05CO011.",
    recommendedGrades: [5],
    alignments: [
      createCurriculumAlignment({
        grade: 5,
        axis: "Cultura Digital",
        knowledgeObject: "Uso de tecnologias computacionais",
        skillCode: "EF05CO11",
        competencies: [2, 3, 4, 5, 7],
        strength: "partial",
        rationale:
          "Com simplificação para a turma, os estudantes comparam interfaces, escolhem soluções adequadas ao usuário, projetam ícones e testam sua compreensão; a fonte original indica Anos Finais e Ensino Médio.",
      }),
    ],
    materials: [
      "Folhas de atividades",
      "Cartões de funções",
      "Projetor, se disponível",
      "Papel e materiais de desenho",
    ],
    participation: ["individual", "group"],
    imageAlt:
      "Exemplo de interface ilustrada na atividade A Fantástica Fábrica de Chocolate",
    tags: ["design de interface", "usabilidade", "ícones", "interação humano-computador"],
  }),
  createUnicampActivity({
    number: 21,
    slug: "conversas-com-computadores",
    title: "Conversas com Computadores — O Teste de Turing",
    topic: "O Teste de Turing",
    sourceLevel: "Anos Iniciais do Ensino Fundamental",
    summary:
      "Simulação em que a turma envia perguntas a dois respondentes ocultos, um representando uma pessoa e outro usando uma folha de respostas de computador, para argumentar sobre qual deles seria a máquina.",
    additionalInformation:
      "O alinhamento do 5º ano é condicional: a conversa final precisa tratar da evolução da inteligência artificial, de seus limites e de efeitos sociais ou no mundo do trabalho. Sem essa extensão, não há habilidade específica de IA no Ensino Fundamental.",
    recommendedGrades: [5],
    alignments: [
      createCurriculumAlignment({
        grade: 5,
        axis: "Cultura Digital",
        knowledgeObject: "Uso de tecnologias computacionais",
        skillCode: "EF05CO10",
        competencies: [1, 2, 5],
        strength: "partial",
        rationale:
          "A habilidade é mobilizada somente quando a discussão final aborda mudanças na inteligência artificial, seus limites e efeitos na sociedade e no trabalho.",
      }),
    ],
    materials: [
      "Folha de perguntas do Teste de Turing",
      "Folha de respostas do computador",
      "Projetor ou cópias impressas",
    ],
    participation: ["group", "whole-class"],
    imageAlt:
      "Ilustração de uma conversa mediada por computador na atividade sobre o Teste de Turing",
    supplementaryLinks: [
      {
        label: "Perguntas do Teste de Turing (PDF)",
        url: "https://desplugada.ime.unicamp.br/atividade21/perguntas.pdf",
      },
      {
        label: "Respostas do Teste de Turing (PDF)",
        url: "https://desplugada.ime.unicamp.br/atividade21/respostas.pdf",
      },
    ],
    tags: ["Teste de Turing", "inteligência artificial", "argumentação", "computadores"],
  }),
  createUnicampActivity({
    number: 22,
    slug: "jogo-da-desfragmentacao",
    title: "Jogo da Desfragmentação",
    topic: "Desfragmentação",
    sourceLevel: "Anos Iniciais e Finais do Ensino Fundamental",
    summary:
      "Jogo com peças coloridas que representam blocos de arquivos. O desafio é agrupar e ordenar os blocos com o menor número de movimentos, concentrando o espaço livre ao final do armazenamento.",
    additionalInformation:
      "A atividade oferece uma representação física de arquivos fragmentados, reorganização de blocos e comparação da eficiência das soluções. Não foi associada a programação porque o material básico não formaliza nem automatiza o algoritmo.",
    recommendedGrades: [6],
    alignments: [
      createCurriculumAlignment({
        grade: 6,
        axis: "Mundo Digital",
        knowledgeObject: "Gestão de dados",
        skillCode: "EF06CO08",
        competencies: [1, 4, 5],
        rationale:
          "Os estudantes manipulam uma representação de arquivos em armazenamento, reorganizam blocos e comparam soluções pelo número de movimentos.",
      }),
    ],
    materials: ["Peças ou fichas coloridas", "Folha de atividade"],
    participation: ["individual", "pair", "group"],
    imageAlt:
      "Blocos coloridos usados para representar arquivos no Jogo da Desfragmentação",
    supplementaryLinks: [
      {
        label: "Folhas de atividades (PDF)",
        url: "https://desplugada.ime.unicamp.br/atividade22/atividades.pdf",
      },
    ],
    tags: ["desfragmentação", "arquivos", "armazenamento", "gestão de dados"],
  }),
  createUnicampActivity({
    number: 23,
    slug: "nonogramas-e-tomografias",
    title: "Nonogramas e Tomografias",
    topic: "Nonogramas e Tomografias",
    sourceLevel: "Anos Iniciais e Finais do Ensino Fundamental",
    summary:
      "Sequência de resolução e criação de nonogramas em que pistas numéricas por linha e coluna permitem reconstruir uma imagem. A proposta relaciona a representação matricial à ideia de tomografia.",
    additionalInformation:
      "O alinhamento usa matriz no 4º ano e decomposição no 5º. Não foi usado o código EF69CO04 exibido na página: o texto associado ali não corresponde ao Complemento oficial de 2022, cuja habilidade exige programação e automação.",
    recommendedGrades: [4, 5],
    alignments: [
      createCurriculumAlignment({
        grade: 4,
        axis: "Pensamento Computacional",
        knowledgeObject: "Matrizes e registros",
        skillCode: "EF04CO01",
        competencies: [3, 4, 5],
        rationale:
          "A grade do nonograma é uma matriz indexada por linhas e colunas, cujas posições são manipuladas a partir das pistas.",
      }),
      createCurriculumAlignment({
        grade: 5,
        axis: "Pensamento Computacional",
        knowledgeObject: "Decomposição",
        skillCode: "EF15CO04",
        competencies: [3, 4, 5],
        rationale:
          "A resolução divide o problema por linhas e colunas, resolve partes e combina as conclusões para reconstruir a imagem.",
      }),
    ],
    materials: ["Folhas de nonogramas", "Lápis", "Borracha"],
    participation: ["individual", "pair"],
    imageAlt:
      "Grade de nonograma usada para reconstruir uma imagem por pistas numéricas",
    tags: ["nonogramas", "matrizes", "decomposição", "tomografia"],
  }),
];
