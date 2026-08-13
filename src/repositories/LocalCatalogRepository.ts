import { resources } from "@/data/resources.mock";
import type { Resource } from "@/domain/resource";
import type { CatalogRepository } from "@/repositories/CatalogRepository";

function cloneResource(resource: Resource): Resource {
  return structuredClone(resource);
}

export class LocalCatalogRepository implements CatalogRepository {
  constructor(private readonly catalog: readonly Resource[] = resources) {}

  async list(): Promise<Resource[]> {
    return this.catalog
      .map(cloneResource)
      .sort((left, right) =>
        left.title.localeCompare(right.title, "pt-BR", { sensitivity: "base" }),
      );
  }

  async getBySlug(slug: string): Promise<Resource | null> {
    const resource = this.catalog.find((item) => item.slug === slug);

    return resource ? cloneResource(resource) : null;
  }
}
