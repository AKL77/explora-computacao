import type {
  BnccAxis,
  Grade,
  SkillReference,
  ValidationStatus,
} from "@/domain/curriculum";

export type ResourceType =
  | "game"
  | "video"
  | "text"
  | "simulator"
  | "activity"
  | "tool";

export type ParticipationMode =
  | "individual"
  | "pair"
  | "group"
  | "whole-class";

export type PricingModel = "free" | "freemium" | "paid" | "unknown";

export type ResourceAvailabilityStatus =
  | "draft"
  | "verified"
  | "unavailable";

export interface Resource {
  id: string;
  slug: string;
  title: string;
  sourceUrl: string;
  canonicalUrl?: string;
  provider: string;
  type: ResourceType;
  language: string;
  summary: string;
  curatorNotes?: string;
  recommendedGrades: Grade[];
  curriculum: {
    axis: BnccAxis;
    knowledgeObject?: string;
    skills: SkillReference[];
    relatedCompetencies?: string[];
  };
  pedagogy: {
    learningObjective?: string;
    estimatedDuration?: string;
    participation?: ParticipationMode[];
    methodologies?: string[];
    prerequisites?: string[];
  };
  requirements: {
    internet?: boolean;
    devices?: string[];
    accountRequired?: boolean;
    pricing?: PricingModel;
  };
  accessibility: {
    evaluationStatus: ValidationStatus;
    knownFeatures: string[];
    potentialBarriers: string[];
    alternatives: string[];
  };
  provenance: {
    source: string;
    license?: string;
    curator?: string;
    lastVerifiedAt: string;
    status: ResourceAvailabilityStatus;
  };
  image?: {
    src: string;
    alt: string;
    focalPoint?: string;
    license?: string;
  };
  tags: string[];
}
