import type { Resource } from "@/domain/resource";

import { publicAsset } from "@/lib/publicAsset";

export const RESOURCE_PLACEHOLDER = publicAsset("branding/resource-placeholder.svg");

export const typeLabels: Record<Resource["type"], string> = {
  game: "Jogo",
  video: "Vídeo",
  text: "Texto",
  simulator: "Simulador",
  activity: "Atividade",
  tool: "Ferramenta",
};
