import type { Resource } from "@/domain/resource";
import { getResourceMaterialTypes, materialTypeOptions } from "@/domain/materialType";

import { publicAsset } from "@/lib/publicAsset";

export const RESOURCE_PLACEHOLDER = publicAsset("branding/resource-placeholder-explora.svg");

export function getResourceTypeLabels(resource: Resource): string[] {
  return getResourceMaterialTypes(resource).map(
    (type) => materialTypeOptions.find((option) => option.id === type)!.singular,
  );
}

export function formatResourceTypes(resource: Resource): string {
  return getResourceTypeLabels(resource).join(" · ");
}

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
