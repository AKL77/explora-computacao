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
 * continuam vindo do acervo; esta camada descreve como eles entram no novo
 * fluxo sem duplicar o cadastro completo de cada material.
 */
export const pilotTeachingResources: readonly PilotTeachingResource[] = [
  {
    resourceId: "unicamp-desplugada-atividade-5",
    grades: [5],
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
    grades: [5],
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
    grades: [5],
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

function inferActivityMode(resource: Resource): ActivityMode {
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
  if (curated) return curated;

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
  };
}
