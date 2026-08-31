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

export function formatRecommendedGrades(
  grades: Resource["recommendedGrades"],
): string {
  const labels = grades.map((grade) => `${grade}º`);

  if (labels.length === 0) {
    return "Não informado";
  }

  if (labels.length === 1) {
    return `${labels[0]} ano`;
  }

  return `${labels.slice(0, -1).join(", ")} e ${labels.at(-1)} anos`;
}
