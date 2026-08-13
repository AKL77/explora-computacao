import type { CatalogRepository } from "@/repositories/CatalogRepository";
import { LocalCatalogRepository } from "@/repositories/LocalCatalogRepository";

export const catalogRepository: CatalogRepository = new LocalCatalogRepository();
