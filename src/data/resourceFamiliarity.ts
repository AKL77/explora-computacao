import type { RequiredFamiliarity, Resource } from "@/domain/resource";

// Curadoria da forma de uso descrita no catálogo. Coleções com vários desafios
// consideram a entrada indicada na proposta, e não o nível máximo da coleção.
const byResourceId: Record<string, RequiredFamiliarity> = {
  "altinovare-cyberbullying": { student: "basic", teacher: "basic" },
  "unicamp-desplugada-atividade-1": { student: "basic", teacher: "intermediate" },
  "unicamp-desplugada-atividade-2": { student: "basic", teacher: "intermediate" },
  "unicamp-desplugada-atividade-3": { student: "basic", teacher: "intermediate" },
  "unicamp-desplugada-atividade-4": { student: "intermediate", teacher: "intermediate" },
  "unicamp-desplugada-atividade-5": { student: "basic", teacher: "intermediate" },
  "unicamp-desplugada-atividade-6": { student: "intermediate", teacher: "intermediate" },
  "unicamp-desplugada-atividade-7": { student: "intermediate", teacher: "intermediate" },
  "unicamp-desplugada-atividade-8": { student: "intermediate", teacher: "advanced" },
  "unicamp-desplugada-atividade-9": { student: "intermediate", teacher: "advanced" },
  "unicamp-desplugada-atividade-10": { student: "basic", teacher: "intermediate" },
  "unicamp-desplugada-atividade-11": { student: "intermediate", teacher: "advanced" },
  "unicamp-desplugada-atividade-12": { student: "basic", teacher: "basic" },
  "unicamp-desplugada-atividade-13": { student: "basic", teacher: "intermediate" },
  "unicamp-desplugada-atividade-14": { student: "intermediate", teacher: "advanced" },
  "unicamp-desplugada-atividade-15": { student: "advanced", teacher: "advanced" },
  "unicamp-desplugada-atividade-16": { student: "advanced", teacher: "advanced" },
  "unicamp-desplugada-atividade-17": { student: "intermediate", teacher: "intermediate" },
  "unicamp-desplugada-atividade-18": { student: "advanced", teacher: "advanced" },
  "unicamp-desplugada-atividade-19": { student: "advanced", teacher: "advanced" },
  "unicamp-desplugada-atividade-20": { student: "basic", teacher: "intermediate" },
  "unicamp-desplugada-atividade-21": { student: "basic", teacher: "intermediate" },
  "unicamp-desplugada-atividade-22": { student: "basic", teacher: "intermediate" },
  "unicamp-desplugada-atividade-23": { student: "intermediate", teacher: "intermediate" },
  "lightbot-web": { student: "basic", teacher: "intermediate" },
  "google-blockly-games": { student: "basic", teacher: "intermediate" },
  "rozelma-lua-bit-bit-variaveis": { student: "intermediate", teacher: "intermediate" },
  "rozelma-sertao-bit": { student: "basic", teacher: "advanced" },
  "rozelma-aventuras-digitais": { student: "basic", teacher: "intermediate" },
  "rozelma-cyberbullying-brincadeira-mau-gosto": { student: "basic", teacher: "intermediate" },
  "google-interland": { student: "basic", teacher: "basic" },
};

export function addRequiredFamiliarity(resource: Resource): Resource {
  const requiredFamiliarity = byResourceId[resource.id];

  if (!requiredFamiliarity) {
    throw new Error(`Níveis de familiaridade não avaliados: ${resource.id}`);
  }

  return { ...resource, requiredFamiliarity };
}
