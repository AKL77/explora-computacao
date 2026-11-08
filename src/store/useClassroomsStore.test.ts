import { beforeEach, describe, expect, it } from "vitest";
import type { ClassroomInput } from "@/domain/classroom";
import { CLASSROOMS_STORAGE_KEY, useClassroomsStore } from "./useClassroomsStore";
import { useTeachingPathsStore } from "./useTeachingPathsStore";

const input: ClassroomInput = { name: "6º B", grade: 6, school: "Escola Exemplo", schoolYear: 2026, color: "blue" };

beforeEach(() => {
  localStorage.clear();
  useClassroomsStore.setState({ classrooms: [], retiredCodes: [] });
  useTeachingPathsStore.setState({ paths: [] });
});

describe("turmas locais", () => {
  it("compartilha uma cópia independente e só aplica alterações da original ao atualizar", async () => {
    const store = useClassroomsStore.getState();
    const classroom = (await store.createClassroom(input))!;
    const source = (await useTeachingPathsStore.getState().createPath("Algoritmos", ["lightbot-web", "google-blockly-games"], { objective: "Explorar decisões.", lessonCountsByResourceId: { "lightbot-web": 2 }, icon: "puzzle", backgroundColor: "amber" }))!;
    expect(await store.shareTeachingPath(classroom.id, source.id)).toBe(true);
    const initial = structuredClone(store.findByCode(classroom.code)!.sharedPaths![0]);
    expect(initial).toMatchObject({ name: source.name, icon: "puzzle", backgroundColor: "amber", resourceIds: source.resourceIds, visible: true, lessonCountsByResourceId: { "lightbot-web": 2 } });
    expect(await store.shareTeachingPath(classroom.id, source.id)).toBe(true);
    expect(store.findByCode(classroom.code)!.sharedPaths).toHaveLength(1);
    await useTeachingPathsStore.getState().updatePath(source.id, { ...source, name: "Algoritmos revisados", resourceIds: ["google-blockly-games", "lightbot-web"] });
    expect(store.findByCode(classroom.code)!.sharedPaths![0]).toEqual(initial);
    await store.setTeachingPathVisibility(classroom.id, source.id, false);
    expect(await store.updateSharedTeachingPath(classroom.id, source.id)).toBe(true);
    expect(store.findByCode(classroom.code)!.sharedPaths![0]).toMatchObject({ name: "Algoritmos revisados", resourceIds: ["google-blockly-games", "lightbot-web"], visible: false, sharedAt: initial.sharedAt });
    await useTeachingPathsStore.getState().deletePath(source.id);
    expect(store.findByCode(classroom.code)!.sharedPaths).toHaveLength(1);
    expect(await store.updateSharedTeachingPath(classroom.id, source.id)).toBe(false);
  });

  it("mantém ordem e visibilidade por turma e preserva as cópias ao arquivar, reabrir e remover", async () => {
    const store = useClassroomsStore.getState();
    const first = (await store.createClassroom(input))!;
    const second = (await store.createClassroom({ ...input, name: "Outra turma" }))!;
    const a = (await useTeachingPathsStore.getState().createPath("A", ["google-interland"]))!;
    const b = (await useTeachingPathsStore.getState().createPath("B", ["lightbot-web"]))!;
    await store.shareTeachingPath(first.id, a.id); await store.shareTeachingPath(first.id, b.id);
    await store.shareTeachingPath(second.id, a.id);
    await store.setTeachingPathVisibility(first.id, a.id, false);
    await store.moveTeachingPath(first.id, b.id, -1);
    expect(store.findByCode(first.code)!.sharedPaths!.map((path) => path.id)).toEqual([b.id, a.id]);
    expect(store.findByCode(second.code)!.sharedPaths![0].visible).toBe(true);
    await store.archiveClassroom(first.id);
    expect(await store.removeTeachingPath(first.id, a.id)).toBe(false);
    expect(await store.setTeachingPathVisibility(first.id, a.id, true)).toBe(false);
    await useClassroomsStore.persist.rehydrate();
    await store.unarchiveClassroom(first.id);
    expect(store.findByCode(first.code)!.sharedPaths![1].visible).toBe(false);
    await store.removeTeachingPath(first.id, a.id);
    expect(store.findByCode(first.code)!.sharedPaths).toHaveLength(1);
    expect(useTeachingPathsStore.getState().getPath(a.id)).toBeDefined();
    expect(store.findByCode(second.code)!.sharedPaths).toHaveLength(1);
  });

  it("gera códigos distintos e mantém o código ao editar a turma", async () => {
    const first = (await useClassroomsStore.getState().createClassroom(input))!;
    const second = (await useClassroomsStore.getState().createClassroom({ ...input, name: "6º A" }))!;
    expect(first.code).toMatch(/^\d{6}$/);
    expect(second.code).not.toBe(first.code);
    expect((await useClassroomsStore.getState().updateClassroom(first.id, { ...input, name: "  6º C  " }))).toBe(true);
    expect(useClassroomsStore.getState().findByCode(`${first.code.slice(0, 3)} ${first.code.slice(3)}`)?.name).toBe("6º C");
    expect((await useClassroomsStore.getState().createClassroom({ ...input, name: "  " }))).toBeNull();
  });

  it("publica somente materiais adicionados e mantém visibilidade independente por turma", async () => {
    const first = (await useClassroomsStore.getState().createClassroom(input))!;
    const second = (await useClassroomsStore.getState().createClassroom({ ...input, name: "6º A" }))!;
    const store = useClassroomsStore.getState();
    (await store.addMaterials(first.id, ["google-interland", "toxicode-compute-it", "google-interland"]));
    (await store.addMaterials(second.id, ["google-interland"]));
    (await store.updateMaterial(first.id, "google-interland", { visible: false, instruction: "Em duplas." }));
    (await store.moveMaterial(first.id, "toxicode-compute-it", -1));
    expect(store.findByCode(first.code)?.materials).toEqual([
      { resourceId: "toxicode-compute-it", visible: true, instruction: "" },
      { resourceId: "google-interland", visible: false, instruction: "Em duplas." },
    ]);
    expect(store.findByCode(second.code)?.materials).toEqual([{ resourceId: "google-interland", visible: true, instruction: "" }]);
    // Adicionar novamente não duplica nem republica um material que o professor ocultou.
    (await store.addMaterials(first.id, ["google-interland"]));
    expect(store.findByCode(first.code)?.materials[1].visible).toBe(false);
    (await store.removeMaterial(first.id, "toxicode-compute-it"));
    expect(store.findByCode(first.code)?.materials).toHaveLength(1);
  });

  it("arquivar encerra o acesso por código e preserva a seleção sem aceitar novas alterações", async () => {
    const classroom = (await useClassroomsStore.getState().createClassroom(input))!;
    const store = useClassroomsStore.getState();
    (await store.addMaterials(classroom.id, ["google-interland"]));
    (await store.archiveClassroom(classroom.id));
    expect(store.findByCode(classroom.code)).toBeUndefined();
    expect((await store.addMaterials(classroom.id, ["toxicode-compute-it"]))).toBe(false);
    expect((await store.updateClassroom(classroom.id, { ...input, name: "Outro nome" }))).toBe(false);
    (await store.updateMaterial(classroom.id, "google-interland", { visible: false }));
    expect(useClassroomsStore.getState().classrooms[0].materials).toEqual([{ resourceId: "google-interland", visible: true, instruction: "" }]);
  });

  it("desarquiva com o mesmo código e preserva materiais, ordem, orientações e visibilidade", async () => {
    const store = useClassroomsStore.getState();
    const classroom = (await store.createClassroom(input))!;
    expect(await store.unarchiveClassroom(classroom.id)).toBe(false);
    await store.addMaterials(classroom.id, ["google-interland", "toxicode-compute-it"]);
    await store.updateMaterial(classroom.id, "google-interland", { visible: false, instruction: "Em duplas." });
    await store.moveMaterial(classroom.id, "toxicode-compute-it", -1);
    const before = structuredClone(store.findByCode(classroom.code)!);
    await store.archiveClassroom(classroom.id);
    expect(store.findByCode(classroom.code)).toBeUndefined();
    expect(await store.unarchiveClassroom(classroom.id)).toBe(true);
    expect(store.findByCode(classroom.code)).toEqual(before);
    expect(await store.addMaterials(classroom.id, ["lightbot-web"])).toBe(true);
    expect(await store.updateClassroom(classroom.id, { ...input, name: "6º C" })).toBe(true);
    await store.archiveClassroom(classroom.id);
    await useClassroomsStore.persist.rehydrate();
    expect(await store.unarchiveClassroom(classroom.id)).toBe(true);
    expect(store.findByCode(classroom.code)?.name).toBe("6º C");
    await store.deleteClassroom(classroom.id);
    expect(await store.unarchiveClassroom(classroom.id)).toBe(false);
    expect(await store.unarchiveClassroom("inexistente")).toBe(false);
  });

  it("excluir encerra o acesso e reserva o código antigo", async () => {
    const classroom = (await useClassroomsStore.getState().createClassroom(input))!;
    const store = useClassroomsStore.getState();
    (await store.deleteClassroom(classroom.id));
    expect(store.findByCode(classroom.code)).toBeUndefined();
    expect(useClassroomsStore.getState().classrooms).toEqual([]);
    expect(useClassroomsStore.getState().retiredCodes).toContain(classroom.code);
    expect((await store.createClassroom(input))?.code).not.toBe(classroom.code);
  });

  it("restaura materiais, instruções, código e visibilidade após reabrir o navegador", async () => {
    const classroom = (await useClassroomsStore.getState().createClassroom(input))!;
    const store = useClassroomsStore.getState();
    (await store.addMaterials(classroom.id, ["google-interland"]));
    (await store.updateMaterial(classroom.id, "google-interland", { instruction: "Desafios 1 a 3.", visible: false }));
    const saved = localStorage.getItem(CLASSROOMS_STORAGE_KEY)!;
    useClassroomsStore.setState({ classrooms: [], retiredCodes: [] });
    localStorage.setItem(CLASSROOMS_STORAGE_KEY, saved);
    await useClassroomsStore.persist.rehydrate();
    expect(store.findByCode(classroom.code)?.materials).toEqual([{ resourceId: "google-interland", instruction: "Desafios 1 a 3.", visible: false }]);
  });

  it("descarta registros inválidos e códigos duplicados na leitura do armazenamento", async () => {
    const classroom = (await useClassroomsStore.getState().createClassroom(input))!;
    localStorage.setItem(CLASSROOMS_STORAGE_KEY, JSON.stringify({ version: 1, state: {
      classrooms: [classroom, { ...classroom, id: "duplicada" }, { ...classroom, id: "invalida", code: "999999", grade: 99 }],
      retiredCodes: ["123456", null, "abc", "123456"],
    } }));
    await useClassroomsStore.persist.rehydrate();
    expect(useClassroomsStore.getState().classrooms).toEqual([classroom]);
    expect(useClassroomsStore.getState().retiredCodes).toEqual(["123456"]);
  });
});
