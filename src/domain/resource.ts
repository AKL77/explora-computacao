import type {
  CurriculumAlignment,
  Grade,
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

export type PedagogicalFunction =
  | "introduction"
  | "exposition"
  | "exploration"
  | "practice"
  | "consolidation"
  | "assessment";

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
  topic: string;
  summary: string;
  additionalInformation: string;
  curatorNotes?: string;
  recommendedGrades: Grade[];
  curriculum: {
    alignments: CurriculumAlignment[];
  };
  pedagogy: {
    learningObjective?: string;
    estimatedDuration?: string;
    participation?: ParticipationMode[];
    pedagogicalFunction?: PedagogicalFunction;
    applicationProposal?: string;
    assessmentSuggestion?: string;
    methodologies?: string[];
    prerequisites?: string[];
    materials?: string[];
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
    thumbnailSrc?: string;
    alt: string;
    focalPoint?: string;
    license?: string;
  };
  supplementaryLinks?: Array<{
    label: string;
    url: string;
  }>;
  tags: string[];
}
