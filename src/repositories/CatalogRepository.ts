import type { Resource } from "@/domain/resource";

export interface CatalogRepository {
  list(): Promise<Resource[]>;
  getBySlug(slug: string): Promise<Resource | null>;
}
