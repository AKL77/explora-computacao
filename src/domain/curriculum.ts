export const SUPPORTED_GRADES = [4, 5, 6, 7, 8, 9] as const;

export type Grade = (typeof SUPPORTED_GRADES)[number];

export type BnccAxis =
  | "Pensamento Computacional"
  | "Mundo Digital"
  | "Cultura Digital";

export type ValidationStatus = "validated" | "pending";

export type CurriculumMappingKind = "source-declared" | "curatorial";

export type CurriculumMappingStrength = "strong" | "partial";

export type CompetencyNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface SkillReference {
  code: string;
  officialText: string;
  sourceEdition: string;
  sourceUrl: string;
  validationStatus: ValidationStatus;
}

export interface CompetencyReference {
  number: CompetencyNumber;
  officialText: string;
  sourceEdition: string;
  sourceUrl: string;
  validationStatus: ValidationStatus;
}

/**
 * Uma correspondência curricular explícita. O ano fica associado à habilidade
 * para que recursos recomendados a várias turmas não produzam combinações
 * curriculares inexistentes.
 */
export interface CurriculumAlignment {
  grade: Grade;
  axis: BnccAxis;
  knowledgeObject?: string;
  skill: SkillReference;
  competencies: CompetencyReference[];
  mapping: {
    kind: CurriculumMappingKind;
    strength: CurriculumMappingStrength;
    rationale: string;
    validationStatus: ValidationStatus;
  };
}
