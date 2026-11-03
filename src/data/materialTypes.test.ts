import { describe, expect, it } from "vitest";
import { getResourceMaterialTypes, materialTypeGroups, materialTypeOptions } from "@/domain/materialType";
import { materialTypeOverrides } from "./materialTypes";
import { resources } from "./resources.mock";

describe("classificação por tipo de material", () => {
  it("classifica todo o catálogo sem tipos repetidos, desconhecidos ou referências órfãs", () => {
    const validTypes = materialTypeOptions.map((option) => option.id);
    const usedTypes = new Set<string>();
    for (const resource of resources) {
      expect(resource.materialTypes?.length, resource.id).toBeGreaterThan(0);
      const types = getResourceMaterialTypes(resource);
      expect(new Set(types).size, resource.id).toBe(types.length);
      for (const type of types) {
        expect(validTypes, resource.id).toContain(type);
        usedTypes.add(type);
      }
    }
    expect([...usedTypes].sort()).toEqual([...validTypes].sort());
    const groupedTypes = materialTypeGroups.flatMap((group) => group.types);
    expect([...groupedTypes].sort()).toEqual([...validTypes].sort());
    for (const id of Object.keys(materialTypeOverrides)) {
      expect(resources.some((resource) => resource.id === id), id).toBe(true);
    }
  });

  it("considera os componentes oferecidos, sem confundir um PDF ou vídeo de instruções com o tipo principal", () => {
    const typesOf = (id: string) => getResourceMaterialTypes(resources.find((resource) => resource.id === id)!);
    expect(typesOf("rozelma-sertao-bit")).toEqual(expect.arrayContaining(["book", "game", "activity"]));
    expect(typesOf("sme-goiania-as-fake-news")).toEqual(expect.arrayContaining(["text", "activity", "presentation", "video"]));
    expect(typesOf("certbr-guardiao-cibernetico")).toEqual(expect.arrayContaining(["presentation", "text"]));
    expect(typesOf("computacional-evolucao-computacao")).toEqual(["poster"]);
    expect(typesOf("microbit-cracha")).toEqual(expect.arrayContaining(["tutorial", "activity"]));
    expect(typesOf("unicamp-desplugada-atividade-5")).not.toContain("video");
    expect(typesOf("unicamp-desplugada-atividade-1")).toEqual(["activity"]);
  });

  it("mantém compatibilidade com materiais sem a nova classificação", () => {
    expect(getResourceMaterialTypes({ type: "game" })).toEqual(["game"]);
    expect(getResourceMaterialTypes({ type: "text", materialTypes: [] })).toEqual(["text"]);
    expect(getResourceMaterialTypes({ type: "text", materialTypes: ["presentation"] })).toEqual(["presentation"]);
  });
});
