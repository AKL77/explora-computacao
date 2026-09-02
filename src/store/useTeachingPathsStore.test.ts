import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_TEACHING_PATH_BACKGROUND_COLOR,
  DEFAULT_TEACHING_PATH_ICON,
  DEFAULT_TEACHING_PATH_OBJECTIVE,
} from "@/domain/savedTeachingPath";
import {
  TEACHING_PATHS_SCHEMA_VERSION,
  TEACHING_PATHS_STORAGE_KEY,
  migratePersistedTeachingPathsState,
  sanitizePersistedTeachingPathsState,
  useTeachingPathsStore,
} from "./useTeachingPathsStore";

describe("useTeachingPathsStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useTeachingPathsStore.setState({
      schemaVersion: TEACHING_PATHS_SCHEMA_VERSION,
      paths: [],
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T20:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("salva uma trilha nomeada com os metadados de apresentação e mantém a duração", () => {
    const created = useTeachingPathsStore
      .getState()
      .createPath(" Algoritmos   para o 5º ano ", ["recurso-1", "recurso-2"], {
        objective: " Criar   algoritmos para resolver problemas. ",
        backgroundColor: "violet",
        icon: "route",
      });

    expect(created).toMatchObject({
      name: "Algoritmos para o 5º ano",
      objective: "Criar algoritmos para resolver problemas.",
      backgroundColor: "violet",
      icon: "route",
      resourceIds: ["recurso-1", "recurso-2"],
      lessonCountsByResourceId: {},
      createdAt: "2026-09-01T20:00:00.000Z",
    });
    expect(created).not.toBeNull();

    useTeachingPathsStore
      .getState()
      .setResourceLessonCount(created?.id ?? "", "recurso-1", 2);

    expect(
      useTeachingPathsStore.getState().getPath(created?.id ?? "")?.lessonCountsByResourceId,
    ).toEqual({ "recurso-1": 2 });
    expect(localStorage.getItem(TEACHING_PATHS_STORAGE_KEY)).toContain("Algoritmos para o 5º ano");
  });

  it("mantém createPath compatível e aplica metadados padrão", () => {
    const created = useTeachingPathsStore.getState().createPath("Sequência", ["recurso-1"]);

    expect(created).toMatchObject({
      objective: DEFAULT_TEACHING_PATH_OBJECTIVE,
      backgroundColor: DEFAULT_TEACHING_PATH_BACKGROUND_COLOR,
      icon: DEFAULT_TEACHING_PATH_ICON,
    });
  });

  it("atualiza a trilha inteira de uma vez, preserva a criação e remove durações órfãs", () => {
    const created = useTeachingPathsStore
      .getState()
      .createPath("Sequência", ["um", "dois"], { objective: "Objetivo inicial" });
    const pathId = created?.id ?? "";

    useTeachingPathsStore.getState().setResourceLessonCount(pathId, "um", 1);
    useTeachingPathsStore.getState().setResourceLessonCount(pathId, "dois", 3);
    vi.setSystemTime(new Date("2026-09-01T20:05:00.000Z"));

    const updated = useTeachingPathsStore.getState().updatePath(pathId, {
      name: "  Sequência revisada ",
      objective: "  Compreender algoritmos em sequência. ",
      backgroundColor: "coral",
      icon: "target",
      resourceIds: ["dois", "três"],
      lessonCountsByResourceId: { um: 1, dois: 2, três: undefined },
    });

    expect(updated).toMatchObject({
      name: "Sequência revisada",
      objective: "Compreender algoritmos em sequência.",
      backgroundColor: "coral",
      icon: "target",
      resourceIds: ["dois", "três"],
      lessonCountsByResourceId: { dois: 2 },
      createdAt: created?.createdAt,
      updatedAt: "2026-09-01T20:05:00.000Z",
    });
  });

  it("rejeita atualização inválida sem alterar a trilha persistida", () => {
    const created = useTeachingPathsStore
      .getState()
      .createPath("Sequência", ["um", "dois"], { objective: "Objetivo inicial" });
    const pathId = created?.id ?? "";

    const result = useTeachingPathsStore.getState().updatePath(pathId, {
      name: "Sequência alterada",
      objective: "Outro objetivo",
      backgroundColor: "blue",
      icon: "flag",
      resourceIds: ["um", "um"],
      lessonCountsByResourceId: {},
    });

    expect(result).toBeNull();
    expect(useTeachingPathsStore.getState().getPath(pathId)).toMatchObject({
      name: "Sequência",
      objective: "Objetivo inicial",
      resourceIds: ["um", "dois"],
    });
  });

  it("adiciona, move e remove recursos sem deixar uma trilha vazia", () => {
    const created = useTeachingPathsStore
      .getState()
      .createPath("Sequência", ["um", "dois"]);
    const pathId = created?.id ?? "";

    expect(useTeachingPathsStore.getState().addResourceToPath(pathId, "três")).toBe(true);
    expect(useTeachingPathsStore.getState().moveResourceInPath(pathId, "três", -1)).toBe(true);
    expect(useTeachingPathsStore.getState().getPath(pathId)?.resourceIds).toEqual([
      "um",
      "três",
      "dois",
    ]);
    expect(useTeachingPathsStore.getState().removeResourceFromPath(pathId, "um")).toBe(true);
    expect(useTeachingPathsStore.getState().removeResourceFromPath(pathId, "três")).toBe(true);
    expect(useTeachingPathsStore.getState().removeResourceFromPath(pathId, "dois")).toBe(false);
  });

  it("descarta registros inválidos e versões futuras", () => {
    const legacyValid = {
      id: "trilha-1",
      name: "Sequência válida",
      resourceIds: ["recurso-1"],
      lessonCountsByResourceId: { "recurso-1": 1 },
      createdAt: "2026-09-01T10:00:00.000Z",
      updatedAt: "2026-09-01T10:00:00.000Z",
    };

    const migrated = {
      ...legacyValid,
      objective: DEFAULT_TEACHING_PATH_OBJECTIVE,
      backgroundColor: DEFAULT_TEACHING_PATH_BACKGROUND_COLOR,
      icon: DEFAULT_TEACHING_PATH_ICON,
    };

    expect(
      sanitizePersistedTeachingPathsState({ paths: [legacyValid, { ...legacyValid, id: "" }] }),
    ).toEqual({
      schemaVersion: 2,
      paths: [migrated],
    });
    expect(migratePersistedTeachingPathsState({ paths: [legacyValid] }, 1)).toEqual({
      schemaVersion: 2,
      paths: [migrated],
    });
    expect(migratePersistedTeachingPathsState({ paths: [legacyValid] }, 3)).toEqual({
      schemaVersion: 2,
      paths: [],
    });
  });
});
