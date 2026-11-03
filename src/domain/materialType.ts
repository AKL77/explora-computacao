import type { Resource, ResourceType } from "./resource";

export const materialTypeOptions = [
  { id: "game", label: "Jogos", singular: "Jogo" },
  { id: "activity", label: "Atividades e exercícios", singular: "Atividade" },
  { id: "video", label: "Vídeos", singular: "Vídeo" },
  { id: "presentation", label: "Apresentações e slides", singular: "Apresentação / slides" },
  { id: "text", label: "Textos e guias", singular: "Texto / guia" },
] as const;

export type MaterialType = (typeof materialTypeOptions)[number]["id"];

export const materialTypeGroups: ReadonlyArray<{
  label: string;
  types: readonly MaterialType[];
}> = [
  { label: "Abordagem ativa", types: ["game", "activity"] },
  { label: "Abordagem expositiva", types: ["video", "presentation", "text"] },
];

const legacyTypes: Record<ResourceType, MaterialType> = {
  game: "game",
  activity: "activity",
  video: "video",
  text: "text",
  simulator: "activity",
  tool: "activity",
};

export function getResourceMaterialTypes(
  resource: Pick<Resource, "type" | "materialTypes">,
): readonly MaterialType[] {
  return resource.materialTypes?.length
    ? resource.materialTypes
    : [legacyTypes[resource.type]];
}
