import { beforeEach, describe, expect, it } from "vitest";

import {
  LIBRARY_SCHEMA_VERSION,
  LIBRARY_STORAGE_KEY,
  normalizeFolderComparisonName,
  useLibraryStore,
  validateFolderName,
} from "./useLibraryStore";

const RESOURCE_ID = "altinovare-cyberbullying";

describe("useLibraryStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useLibraryStore.setState({
      schemaVersion: LIBRARY_SCHEMA_VERSION,
      favoriteResourceIds: [],
      folders: [],
    });
  });

  it("favorita e desfavorita sem duplicar o recurso", () => {
    const store = useLibraryStore.getState();
    store.setFavorite(RESOURCE_ID, true);
    store.setFavorite(RESOURCE_ID, true);

    expect(useLibraryStore.getState().favoriteResourceIds).toEqual([RESOURCE_ID]);

    useLibraryStore.getState().toggleFavorite(RESOURCE_ID);
    expect(useLibraryStore.getState().favoriteResourceIds).toEqual([]);
  });

  it("normaliza caixa, acentos e espaços ao verificar nomes duplicados", () => {
    const firstResult = useLibraryStore
      .getState()
      .createFolder("  Turma   Lívia Menna  ");

    expect(firstResult.ok).toBe(true);
    expect(useLibraryStore.getState().folders[0]?.name).toBe("Turma Lívia Menna");

    const duplicateResult = useLibraryStore
      .getState()
      .createFolder("turma livia menna");
    expect(duplicateResult).toEqual({ ok: false, error: "duplicate" });
    expect(normalizeFolderComparisonName("  LÍVIA  ")).toBe("livia");
  });

  it("valida nome obrigatório, limite e nome reservado Favoritos", () => {
    expect(validateFolderName("   ", [])).toBe("required");
    expect(validateFolderName("a".repeat(81), [])).toBe("too-long");
    expect(validateFolderName("fávõritos", [])).toBe("duplicate");
    expect(validateFolderName("a", [])).toBeNull();
  });

  it("cria uma pasta com o recurso inicial e atualiza a associação", () => {
    const result = useLibraryStore
      .getState()
      .createFolder("Turma sétimo ano — Escola Lívia Menna Barreto", RESOURCE_ID);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.folder.resourceIds).toEqual([RESOURCE_ID]);
    expect(
      useLibraryStore.getState().addResourceToFolder(result.folder.id, RESOURCE_ID),
    ).toBe(true);
    expect(useLibraryStore.getState().folders[0]?.resourceIds).toEqual([RESOURCE_ID]);

    expect(
      useLibraryStore.getState().removeResourceFromFolder(result.folder.id, RESOURCE_ID),
    ).toBe(true);
    expect(useLibraryStore.getState().folders[0]?.resourceIds).toEqual([]);
  });

  it("define a presença de um recurso em várias pastas de uma só vez", () => {
    const first = useLibraryStore.getState().createFolder("7º ano");
    const second = useLibraryStore.getState().createFolder("Cultura Digital");

    expect(first.ok && second.ok).toBe(true);
    if (!first.ok || !second.ok) {
      return;
    }

    useLibraryStore
      .getState()
      .setResourceFolderMembership(RESOURCE_ID, [first.folder.id, second.folder.id]);

    expect(
      useLibraryStore.getState().folders.every((folder) =>
        folder.resourceIds.includes(RESOURCE_ID),
      ),
    ).toBe(true);

    useLibraryStore
      .getState()
      .setResourceFolderMembership(RESOURCE_ID, [second.folder.id]);

    expect(useLibraryStore.getState().folders[0]?.resourceIds).toEqual([]);
    expect(useLibraryStore.getState().folders[1]?.resourceIds).toEqual([RESOURCE_ID]);
  });

  it("persiste somente o schema, favoritos e pastas", () => {
    useLibraryStore.getState().setFavorite(RESOURCE_ID, true);
    useLibraryStore.getState().createFolder("Planejamento");

    const persistedValue = localStorage.getItem(LIBRARY_STORAGE_KEY);
    expect(persistedValue).not.toBeNull();
    expect(JSON.parse(persistedValue ?? "{}")).toMatchObject({
      state: {
        schemaVersion: 1,
        favoriteResourceIds: [RESOURCE_ID],
        folders: [{ name: "Planejamento" }],
      },
      version: 1,
    });
  });
});
