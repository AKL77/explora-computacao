export type Grade = 6 | 7 | 8 | 9;

export type BnccAxis =
  | "Pensamento Computacional"
  | "Mundo Digital"
  | "Cultura Digital";

export type ValidationStatus = "validated" | "pending";

export interface SkillReference {
  code: string;
  officialText: string;
  sourceEdition: string;
  sourceUrl: string;
  validationStatus: ValidationStatus;
}
