import type { Grade } from "@/domain/curriculum";
import type { Resource } from "@/domain/resource";

export type ActivityMode = "plugged" | "unplugged" | "mixed";
export type TeachingApproach = "active" | "combined" | "expository";

export interface PilotTeachingResource {
  resourceId: string;
  grades: readonly Grade[];
  objective: string;
  studentActivity: string;
  materials: readonly string[];
  activityMode: ActivityMode;
  teachingApproach: TeachingApproach;
  searchAliases: readonly string[];
}

/**
 * Metadados curatoriais usados somente no piloto da trilha. Os recursos-base
 * continuam vindo do catálogo; esta camada descreve como eles entram no novo
 * fluxo sem duplicar o cadastro completo de cada material. Os anos vêm sempre
 * de recommendedGrades, para manter a ficha, a busca e as propostas alinhadas.
 */
export const pilotTeachingResources: readonly Omit<PilotTeachingResource, "grades">[] = [
  {
    resourceId: "unicamp-desplugada-atividade-5",
    objective: "Usar perguntas de “sim” ou “não” para compreender bits e decisões.",
    studentActivity:
      "Uma pessoa escolhe um número ou uma sequência, enquanto os demais formulam perguntas respondidas apenas com “sim” ou “não”. A turma conta os palpites, compara estratégias e observa que dividir as possibilidades pela metade reduz o número de perguntas. Na extensão, representa as decisões em uma árvore.",
    materials: [
      "Nenhum material obrigatório",
      "Folha “Árvores de Decisão” (extensão)",
    ],
    activityMode: "unplugged",
    teachingApproach: "active",
    searchAliases: [
      "algoritmo",
      "algoritmos",
      "condicional",
      "condicionais",
      "árvore de decisão",
      "árvores de decisão",
      "teoria da informação",
      "perguntas sim ou não",
      "bits",
      "EF05CO04",
    ],
  },
  {
    resourceId: "google-blockly-games",
    objective: "Construir algoritmos visuais com blocos, laços e condicionais.",
    studentActivity:
      "Os estudantes resolvem, no próprio ritmo, uma série de jogos: encaixam blocos, solucionam labirintos, utilizam laços e condicionais, produzem desenhos, animações e músicas e, nos níveis mais avançados, alternam entre blocos e JavaScript.",
    materials: [
      "Dispositivo com navegador e internet",
      "Ou versão offline previamente instalada",
    ],
    activityMode: "plugged",
    teachingApproach: "active",
    searchAliases: [
      "programação em blocos",
      "algoritmo",
      "algoritmos",
      "sequência",
      "sequências",
      "repetição",
      "repetições",
      "laço",
      "laços",
      "laço de repetição",
      "laços de repetição",
      "loop",
      "loops",
      "iteração",
      "iterações",
      "condicional",
      "condicionais",
      "funções",
      "JavaScript",
      "EF05CO04",
    ],
  },
  {
    resourceId: "rozelma-sertao-bit",
    objective: "Resolver desafios para exercitar algoritmos e decomposição.",
    studentActivity:
      "Os estudantes acompanham a história de Lampião Júnior e Maria Bonitinha e resolvem 11 desafios ligados ao enredo. Conforme o desafio, manipulam materiais impressos, realizam atividades sem computador, criam projetos no Scratch ou interagem com Makey Makey ou FRANZMakey.",
    materials: [
      "Livro-jogo e guia docente",
      "Materiais impressos e manipuláveis",
      "Scratch",
      "Makey Makey ou FRANZMakey",
    ],
    activityMode: "mixed",
    teachingApproach: "combined",
    searchAliases: [
      "pensamento computacional",
      "algoritmo",
      "algoritmos",
      "sequência",
      "sequências",
      "decomposição",
      "reconhecimento de padrões",
      "Scratch",
      "EF05CO04",
      "EF15CO04",
    ],
  },
];

// Texto breve para comparar materiais na busca e consultar as etapas da trilha.
// Mantém o roteiro completo e as observações na ficha original, sem duplicar
// turma, classificação, objetivo ou outros metadados nesta apresentação.
const conciseTeachingContent: Record<
  string,
  Partial<Pick<PilotTeachingResource, "studentActivity" | "materials">>
> = {
  "altinovare-cyberbullying": {
    studentActivity: "Os estudantes exploram os dilemas do jogo, individualmente ou em grupos, e analisam as consequências de suas escolhas. Ao final, discutem atitudes para prevenir e enfrentar o cyberbullying.",
  },
  "computacional-evolucao-computacao": {
    studentActivity: "Os estudantes comparam máquinas e tecnologias de diferentes épocas no painel e discutem mudanças em seus usos. O professor amplia os trechos e esclarece que Ada Lovelace foi colaboradora de Babbage.",
    materials: ["Painel ampliado, projetado ou impresso", "Caderno"],
  },
  "certbr-guardiao-cibernetico": {
    studentActivity: "A turma acompanha os slides e discute situações de exposição de dados pessoais. Com apoio do professor e dos fascículos, identifica riscos e relaciona cada situação a formas de proteção.",
    materials: ["Slides e notas do apresentador", "Computador e projetor", "Fascículos (opcionais)"],
  },
  "sme-goiania-as-fake-news": {
    studentActivity: "Os estudantes leem o texto sobre notícias falsas, respondem às questões e pesquisam seus efeitos. Depois, compartilham as conclusões e justificam a avaliação das informações com fontes e evidências.",
    materials: ["Texto e atividade", "Computador com internet", "Slides e vídeo (opcionais)"],
  },
  "ufsc-splashcode": {
    studentActivity: "Em grupos, os estudantes organizam cartas de programação e simulam os movimentos no tabuleiro. Comparam os percursos e ajustam a sequência de comandos quando necessário.",
    materials: ["Jogo impresso e montado (9 páginas)", "Tesoura e cola bastão", "Tampas de garrafa"],
  },
  "nicbr-tabuleiro-seguranca-online": {
    studentActivity: "Os estudantes jogam em grupos, avançando pelo tabuleiro conforme as regras. Ao longo da partida, discutem como as atitudes retratadas ajudam ou prejudicam a segurança dos dados e dispositivos.",
    materials: ["Tabuleiro e regras impressos", "Dado e marcadores", "Tesoura e cola (se montar as peças)"],
  },
  "toxicode-compute-it": {
    studentActivity: "Os estudantes leem programas e executam os comandos em português para mover a bolinha pelo percurso. Resolvem os desafios por tentativa, com dicas quando necessário, e explicam como a ordem das instruções, as repetições e as condições afetam o resultado.",
    materials: ["Computador com teclado e internet"],
  },
  "sme-goiania-tecnologia-vida-humana": {
    studentActivity: "A turma responde às perguntas dos slides, reconhece tecnologias do cotidiano e compara seus benefícios e impactos. Depois, discute desigualdade de acesso e descarte de eletrônicos com exemplos próximos à sua realidade.",
    materials: ["Slides", "Computador e projetor", "Texto e atividade (opcionais)"],
  },
  "manual-mundo-computadores-pessoas": {
    studentActivity: "Os estudantes assistem ao vídeo com pausas para conversar sobre calculadores humanos e máquinas mecânicas. Comparam como os cálculos eram feitos em diferentes épocas e discutem as mudanças no trabalho.",
    materials: ["Computador com internet", "Tela e som"],
  },
  "manual-mundo-memoria-computador": {
    studentActivity: "A turma acompanha o vídeo e compara exemplos de memória e armazenamento. Com o professor, distingue o que é temporário do que permanece guardado quando o computador é desligado.",
    materials: ["Computador com internet", "Tela e som"],
  },
  "nicbr-como-funciona-internet-playlist": {
    studentActivity: "A turma assiste aos episódios escolhidos pelo professor e discute como os dados circulam na Internet. Em seguida, representa o caminho de uma solicitação, relacionando endereços IP, protocolos e DNS.",
    materials: ["Computador com internet", "Tela e som", "Quadro ou caderno"],
  },
  "microbit-cracha": {
    materials: ["Computador com internet", "Editor e simulador MakeCode", "Placa e baterias (opcionais)"],
  },
};

function inferActivityMode(resource: Resource): ActivityMode {
  // Anotar em papel durante a exibição não torna o vídeo utilizável sem tela.
  if (resource.type === "video") return "plugged";
  // O simulador é uma alternativa à placa; ler o guia também admite impressão.
  if (resource.id === "microbit-cracha") return "plugged";
  if (resource.id === "nicbr-internet-responsa-adolescentes") return "mixed";

  const needsDigitalAccess =
    resource.requirements.internet === true || (resource.requirements.devices?.length ?? 0) > 0;
  const usesClassroomMaterials = (resource.pedagogy.materials?.length ?? 0) > 0;

  if (!needsDigitalAccess) return "unplugged";
  return usesClassroomMaterials ? "mixed" : "plugged";
}

function inferTeachingApproach(resource: Resource): TeachingApproach {
  if (resource.pedagogy.pedagogicalFunction === "exposition") return "expository";
  if (
    resource.type === "activity" ||
    resource.type === "game" ||
    resource.type === "simulator" ||
    resource.type === "tool"
  ) {
    return "active";
  }
  return "combined";
}

function inferMaterials(resource: Resource): readonly string[] {
  const materials = resource.pedagogy.materials ?? [];
  const devices = resource.requirements.devices ?? [];
  const internet = resource.requirements.internet === true ? ["Acesso à internet"] : [];
  const inferred = Array.from(new Set([...materials, ...devices, ...internet]));

  return inferred.length > 0 ? inferred : ["Consulte as orientações do material"];
}

/**
 * Preserva a curadoria detalhada do piloto e completa os demais itens do catálogo
 * com informações já existentes no próprio cadastro do recurso.
 */
export function getTeachingResourceMetadata(resource: Resource): PilotTeachingResource {
  const curated = pilotTeachingResources.find((item) => item.resourceId === resource.id);
  if (curated) return { ...curated, grades: resource.recommendedGrades };

  return {
    resourceId: resource.id,
    grades: resource.recommendedGrades,
    objective:
      resource.pedagogy.learningObjective ??
      resource.curriculum.alignments[0]?.mapping.rationale ??
      `Explorar ${resource.topic.toLocaleLowerCase("pt-BR")}.`,
    studentActivity: resource.pedagogy.applicationProposal ?? resource.summary,
    materials: inferMaterials(resource),
    activityMode: inferActivityMode(resource),
    teachingApproach: inferTeachingApproach(resource),
    searchAliases: [
      resource.provider,
      resource.summary,
      resource.additionalInformation,
      ...resource.tags,
      ...resource.curriculum.alignments.flatMap((alignment) => [
        alignment.axis,
        alignment.knowledgeObject ?? "",
        alignment.skill.code,
        alignment.skill.officialText,
      ]),
    ],
    ...conciseTeachingContent[resource.id],
  };
}
