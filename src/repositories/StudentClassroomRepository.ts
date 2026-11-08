import { isStudentClassroom, type StudentClassroom } from "@/domain/classroom";
import { backendConfig } from "@/lib/backend/config";

export class StudentAccessError extends Error {
  constructor(readonly reason: "unavailable" | "network" | "rate_limited") {
    super(reason === "unavailable" ? "Turma indisponível. Confira o código com o professor." : reason === "rate_limited" ? "Muitas tentativas. Aguarde um momento e tente novamente." : "Não foi possível consultar a turma. Verifique a conexão e tente novamente.");
  }
}

export async function fetchStudentClassroom(code: string, signal?: AbortSignal): Promise<StudentClassroom> {
  let response: Response;
  try {
    response = await fetch(`${backendConfig.url}/functions/v1/student-classroom`, {
      method: "POST", headers: { apikey: backendConfig.key, "Content-Type": "application/json" },
      body: JSON.stringify({ code }), signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(10000)]) : AbortSignal.timeout(10000),
    });
  } catch { throw new StudentAccessError("network"); }
  if (!response.ok) throw new StudentAccessError(response.status === 404 ? "unavailable" : response.status === 429 ? "rate_limited" : "network");
  const data: unknown = await response.json();
  if (!isStudentClassroom(data) || data.archived || data.materials.some((material) => !material.visible) || data.sharedPaths?.some((path) => !path.visible)) throw new StudentAccessError("network");
  return data;
}
