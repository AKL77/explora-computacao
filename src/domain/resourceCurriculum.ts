import type {
  BnccAxis,
  CompetencyReference,
  CurriculumAlignment,
  Grade,
  SkillReference,
} from "@/domain/curriculum";
import type { Resource } from "@/domain/resource";

export function getResourceAlignmentsForGrade(
  resource: Resource,
  grade: Grade,
): CurriculumAlignment[] {
  return resource.curriculum.alignments.filter(
    (alignment) => alignment.grade === grade,
  );
}

export function getResourceAxes(resource: Resource): BnccAxis[] {
  return Array.from(
    new Set(resource.curriculum.alignments.map((alignment) => alignment.axis)),
  );
}

export function getResourceSkills(resource: Resource): SkillReference[] {
  const byCode = new Map<string, SkillReference>();

  for (const { skill } of resource.curriculum.alignments) {
    const normalizedCode = skill.code.trim().toLocaleUpperCase("pt-BR");
    if (!byCode.has(normalizedCode)) {
      byCode.set(normalizedCode, { ...skill });
    }
  }

  return Array.from(byCode.values());
}

export function getResourceCompetencies(
  resource: Resource,
): CompetencyReference[] {
  const byNumber = new Map<number, CompetencyReference>();

  for (const alignment of resource.curriculum.alignments) {
    for (const competency of alignment.competencies) {
      if (!byNumber.has(competency.number)) {
        byNumber.set(competency.number, { ...competency });
      }
    }
  }

  return Array.from(byNumber.values()).sort(
    (left, right) => left.number - right.number,
  );
}
