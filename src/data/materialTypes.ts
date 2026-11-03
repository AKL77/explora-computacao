import type { Resource } from "@/domain/resource";
import { getResourceMaterialTypes, type MaterialType } from "@/domain/materialType";

/** Classificação complementar dos componentes oferecidos por cada material. */
export const materialTypeOverrides: Readonly<Record<string, readonly MaterialType[]>> = {
  "unicamp-desplugada-atividade-5": ["activity", "game"],
  "unicamp-desplugada-atividade-6": ["activity", "game"],
  "unicamp-desplugada-atividade-10": ["activity", "game"],
  "unicamp-desplugada-atividade-22": ["activity", "game"],
  "rozelma-lua-bit-bit-variaveis": ["activity", "game"],
  "rozelma-sertao-bit": ["book", "activity", "game"],
  "rozelma-aventuras-digitais": ["book", "activity"],
  "rozelma-cyberbullying-brincadeira-mau-gosto": ["activity", "text"],
  "microbit-cracha": ["tutorial", "activity"],
  "computacional-evolucao-computacao": ["poster"],
  "certbr-guardiao-cibernetico": ["presentation", "text"],
  "sme-goiania-as-fake-news": ["activity", "text", "presentation", "video"],
  "sme-goiania-tecnologia-vida-humana": ["presentation", "text", "activity"],
};

export function addMaterialTypes(resource: Resource): Resource {
  return {
    ...resource,
    materialTypes: materialTypeOverrides[resource.id] ?? getResourceMaterialTypes(resource),
  };
}
