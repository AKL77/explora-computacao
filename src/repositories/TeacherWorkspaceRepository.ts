import { isClassroom, type Classroom, type ClassroomInput } from "@/domain/classroom";
import { isSavedTeachingPath, type SavedTeachingPath } from "@/domain/savedTeachingPath";
import { supabase } from "@/lib/backend/client";

async function rpc(name: string, args?: Record<string, unknown>): Promise<unknown> {
  if (!supabase) throw new Error("Backend não configurado");
  const { data, error } = await supabase.rpc(name, args);
  if (error) throw error;
  return data;
}

export const teacherWorkspaceRepository = {
  async load(): Promise<{ classrooms: Classroom[]; paths: SavedTeachingPath[] }> {
    const data = await rpc("teacher_workspace") as { classrooms?: unknown; paths?: unknown };
    if (!data || !Array.isArray(data.classrooms) || !data.classrooms.every(isClassroom) || !Array.isArray(data.paths) || !data.paths.every(isSavedTeachingPath)) throw new Error("Dados online inválidos");
    return { classrooms: data.classrooms, paths: data.paths };
  },
  async saveClassroom(input: ClassroomInput | Classroom): Promise<Classroom> {
    const current = "id" in input ? input : null;
    const data = await rpc("save_classroom", { p_id: current?.id ?? null, p_data: { ...input, materials: current?.materials ?? [], archived: current?.archived ?? false }, p_revision: current?.revision ?? null });
    if (!isClassroom(data)) throw new Error("Turma inválida");
    return data;
  },
  async deleteClassroom(classroom: Classroom): Promise<boolean> {
    return await rpc("delete_classroom", { p_id: classroom.id, p_revision: classroom.revision }) === true;
  },
  async unarchiveClassroom(classroom: Classroom): Promise<Classroom> {
    const data = await rpc("unarchive_classroom", { p_id: classroom.id, p_revision: classroom.revision });
    if (!isClassroom(data)) throw new Error("Turma inválida");
    return data;
  },
  async savePath(path: SavedTeachingPath): Promise<SavedTeachingPath> {
    const data = await rpc("save_teaching_path", { p_id: path.id, p_data: path, p_revision: path.revision ?? null });
    if (!isSavedTeachingPath(data)) throw new Error("Trilha inválida");
    return data;
  },
  async deletePath(path: SavedTeachingPath): Promise<boolean> {
    return await rpc("delete_teaching_path", { p_id: path.id, p_revision: path.revision }) === true;
  },
};
