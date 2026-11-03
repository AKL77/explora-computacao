import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isClassroom, isClassroomInput, normalizeClassroomCode, type Classroom, type ClassroomInput, type ClassroomMaterial } from "@/domain/classroom";
import { isOnlineMode, onlineMemoryStorage } from "@/lib/backend/config";
import { remoteMutation, type MaybePromise } from "@/lib/backend/workspaceState";
import { teacherWorkspaceRepository } from "@/repositories/TeacherWorkspaceRepository";

export const CLASSROOMS_STORAGE_KEY = "explora-computacao:classrooms:v1";

interface ClassroomsState { classrooms: Classroom[]; retiredCodes: string[]; }
interface ClassroomsStore extends ClassroomsState {
  createClassroom: (input: ClassroomInput) => MaybePromise<Classroom | null>;
  updateClassroom: (id: string, input: ClassroomInput) => MaybePromise<boolean>;
  archiveClassroom: (id: string) => MaybePromise<boolean>;
  unarchiveClassroom: (id: string) => MaybePromise<boolean>;
  deleteClassroom: (id: string) => MaybePromise<boolean>;
  addMaterials: (id: string, resourceIds: readonly string[]) => MaybePromise<boolean>;
  updateMaterial: (id: string, resourceId: string, update: Partial<Pick<ClassroomMaterial, "visible" | "instruction">>) => MaybePromise<boolean>;
  removeMaterial: (id: string, resourceId: string) => MaybePromise<boolean>;
  moveMaterial: (id: string, resourceId: string, direction: -1 | 1) => MaybePromise<boolean>;
  findByCode: (code: string) => Classroom | undefined;
}

function sanitizeState(value: unknown): ClassroomsState {
  if (!value || typeof value !== "object") return { classrooms: [], retiredCodes: [] };
  const state = value as Record<string, unknown>;
  const classrooms: Classroom[] = [];
  const ids = new Set<string>();
  const codes = new Set<string>();
  if (Array.isArray(state.classrooms)) for (const classroom of state.classrooms) {
    if (!isClassroom(classroom) || ids.has(classroom.id) || codes.has(classroom.code)) continue;
    ids.add(classroom.id); codes.add(classroom.code); classrooms.push(classroom);
  }
  const retiredCodes = Array.isArray(state.retiredCodes) ? [...new Set(state.retiredCodes.filter((code): code is string => typeof code === "string" && /^\d{6}$/.test(code)))] : [];
  return { classrooms, retiredCodes };
}

function generateDemoCode(state: ClassroomsState): string | null {
  const used = new Set([...state.retiredCodes, ...state.classrooms.map((classroom) => classroom.code)]);
  const random = new Uint32Array(1);
  globalThis.crypto.getRandomValues(random);
  const start = random[0] % 900_000;
  for (let offset = 0; offset < 900_000; offset++) {
    const code = String(100_000 + ((start + offset) % 900_000));
    if (!used.has(code)) return code;
  }
  return null;
}

export const useClassroomsStore = create<ClassroomsStore>()(persist((set, get) => {
  const replace = (classroom: Classroom | null) => {
    if (classroom) set((state) => ({ classrooms: state.classrooms.some((item) => item.id === classroom.id) ? state.classrooms.map((item) => item.id === classroom.id ? classroom : item) : [classroom, ...state.classrooms] }));
  };
  const save = (classroom: Classroom): MaybePromise<boolean> => {
    if (isOnlineMode) return remoteMutation<Classroom | null>(() => teacherWorkspaceRepository.saveClassroom(classroom), replace, null).then(Boolean);
    replace(classroom); return true;
  };
  const changeMaterials = (id: string, change: (materials: ClassroomMaterial[]) => ClassroomMaterial[]): MaybePromise<boolean> => {
    const classroom = get().classrooms.find((item) => item.id === id && !item.archived);
    return classroom ? save({ ...classroom, materials: change(classroom.materials) }) : false;
  };
  return {
    classrooms: [], retiredCodes: [],
    createClassroom: (input) => {
      if (!isClassroomInput(input)) return null;
      const normalized = { ...input, name: input.name.trim(), school: input.school.trim() };
      if (isOnlineMode) return remoteMutation<Classroom | null>(() => teacherWorkspaceRepository.saveClassroom(normalized), replace, null);
      const code = generateDemoCode(get());
      if (!code) return null;
      const classroom: Classroom = { ...normalized, id: crypto.randomUUID(), code, archived: false, materials: [], createdAt: new Date().toISOString() };
      replace(classroom); return classroom;
    },
    updateClassroom: (id, input) => {
      const current = get().classrooms.find((item) => item.id === id && !item.archived);
      return current && isClassroomInput(input) ? save({ ...current, ...input, name: input.name.trim(), school: input.school.trim() }) : false;
    },
    archiveClassroom: (id) => {
      const current = get().classrooms.find((item) => item.id === id && !item.archived);
      return current ? save({ ...current, archived: true }) : false;
    },
    unarchiveClassroom: (id) => {
      const current = get().classrooms.find((item) => item.id === id && item.archived);
      if (!current) return false;
      if (isOnlineMode) return remoteMutation<Classroom | null>(() => teacherWorkspaceRepository.unarchiveClassroom(current), replace, null).then(Boolean);
      return save({ ...current, archived: false });
    },
    deleteClassroom: (id) => {
      const current = get().classrooms.find((item) => item.id === id);
      if (!current) return false;
      if (isOnlineMode) return remoteMutation(() => teacherWorkspaceRepository.deleteClassroom(current), (ok) => { if (ok) set((state) => ({ classrooms: state.classrooms.filter((item) => item.id !== id) })); }, false);
      set((state) => ({ classrooms: state.classrooms.filter((item) => item.id !== id), retiredCodes: [...new Set([...state.retiredCodes, current.code])] }));
      return true;
    },
    addMaterials: (id, resourceIds) => changeMaterials(id, (materials) => {
      const existing = new Set(materials.map((material) => material.resourceId));
      return [...materials, ...[...new Set(resourceIds)].filter((rid) => rid.trim() && !existing.has(rid)).map((resourceId) => ({ resourceId, visible: true, instruction: "" }))];
    }),
    updateMaterial: (id, resourceId, update) => changeMaterials(id, (materials) => materials.map((material) => material.resourceId === resourceId ? {
      ...material,
      ...(typeof update.visible === "boolean" ? { visible: update.visible } : {}),
      ...(typeof update.instruction === "string" ? { instruction: update.instruction.trim().slice(0, 500) } : {}),
    } : material)),
    removeMaterial: (id, resourceId) => changeMaterials(id, (materials) => materials.filter((material) => material.resourceId !== resourceId)),
    moveMaterial: (id, resourceId, direction) => changeMaterials(id, (materials) => {
      const index = materials.findIndex((material) => material.resourceId === resourceId);
      const next = index + direction;
      if (index < 0 || next < 0 || next >= materials.length) return materials;
      const ordered = [...materials];
      [ordered[index], ordered[next]] = [ordered[next], ordered[index]];
      return ordered;
    }),
    findByCode: (code) => isOnlineMode ? undefined : get().classrooms.find((classroom) => !classroom.archived && classroom.code === normalizeClassroomCode(code)),
  };
}, {
  name: CLASSROOMS_STORAGE_KEY, version: 1,
  storage: createJSONStorage(() => isOnlineMode ? onlineMemoryStorage : localStorage),
  partialize: ({ classrooms, retiredCodes }) => ({ classrooms, retiredCodes }),
  merge: (persisted, current) => ({ ...current, ...sanitizeState(persisted) }),
}));
