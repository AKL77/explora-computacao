import { SUPPORTED_GRADES, type Grade } from "./curriculum";

export const CLASSROOM_COLORS = [
  { value: "blue", label: "Azul", hex: "#005c8b" },
  { value: "green", label: "Verde", hex: "#287a4b" },
  { value: "violet", label: "Violeta", hex: "#7553a6" },
  { value: "amber", label: "Dourado", hex: "#9a6700" },
  { value: "coral", label: "Coral", hex: "#b94e35" },
] as const;

export type ClassroomColor = (typeof CLASSROOM_COLORS)[number]["value"];

export interface ClassroomInput {
  name: string;
  grade: Grade;
  school: string;
  schoolYear: number;
  color: ClassroomColor;
}

export interface ClassroomMaterial {
  resourceId: string;
  visible: boolean;
  instruction: string;
}

export interface Classroom extends ClassroomInput {
  revision?: number;
  id: string;
  code: string;
  archived: boolean;
  materials: ClassroomMaterial[];
  createdAt: string;
}

export function normalizeClassroomCode(value: string): string {
  return value.replace(/\s/g, "");
}

export function formatClassroomCode(value: string): string {
  return `${value.slice(0, 3)} ${value.slice(3)}`;
}

export function classroomColor(color: ClassroomColor): string {
  return CLASSROOM_COLORS.find((option) => option.value === color)?.hex ?? CLASSROOM_COLORS[0].hex;
}

export function isClassroomInput(value: unknown): value is ClassroomInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  return (
    typeof input.name === "string" && input.name.trim().length > 0 && input.name.length <= 80 &&
    SUPPORTED_GRADES.includes(input.grade as Grade) &&
    typeof input.school === "string" && input.school.length <= 120 &&
    Number.isInteger(input.schoolYear) && Number(input.schoolYear) >= 2000 && Number(input.schoolYear) <= 2100 &&
    CLASSROOM_COLORS.some((option) => option.value === input.color)
  );
}

export function isClassroom(value: unknown): value is Classroom {
  if (!isClassroomInput(value)) return false;
  const classroom = value as unknown as Record<string, unknown>;
  if (
    typeof classroom.id !== "string" || !classroom.id.trim() ||
    typeof classroom.code !== "string" || !/^\d{6}$/.test(classroom.code) ||
    typeof classroom.archived !== "boolean" ||
    typeof classroom.createdAt !== "string" || !Number.isFinite(Date.parse(classroom.createdAt)) ||
    !Array.isArray(classroom.materials)
  ) return false;

  const ids = new Set<string>();
  return classroom.materials.every((entry: unknown) => {
    if (!entry || typeof entry !== "object") return false;
    const material = entry as Record<string, unknown>;
    if (
      typeof material.resourceId !== "string" || !material.resourceId.trim() || ids.has(material.resourceId) ||
      typeof material.visible !== "boolean" || typeof material.instruction !== "string" || material.instruction.length > 500
    ) return false;
    ids.add(material.resourceId);
    return true;
  });
}
