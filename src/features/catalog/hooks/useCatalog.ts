import { useEffect, useState } from "react";

import type { Resource } from "@/domain/resource";
import { catalogRepository } from "@/repositories/catalog";

type LoadStatus = "loading" | "success" | "error";

interface CatalogResourcesState {
  resources: Resource[];
  status: LoadStatus;
}

interface CatalogResourceState {
  resource: Resource | null;
  status: LoadStatus;
}

export function useCatalogResources(): CatalogResourcesState {
  const [state, setState] = useState<CatalogResourcesState>({
    resources: [],
    status: "loading",
  });

  useEffect(() => {
    let active = true;

    catalogRepository.list().then(
      (resources) => {
        if (active) setState({ resources, status: "success" });
      },
      () => {
        if (active) setState({ resources: [], status: "error" });
      },
    );

    return () => {
      active = false;
    };
  }, []);

  return state;
}

export function useCatalogResource(slug: string | undefined): CatalogResourceState {
  const [state, setState] = useState<CatalogResourceState>({
    resource: null,
    status: "loading",
  });

  useEffect(() => {
    let active = true;

    catalogRepository.getBySlug(slug ?? "").then(
      (resource) => {
        if (active) setState({ resource, status: "success" });
      },
      () => {
        if (active) setState({ resource: null, status: "error" });
      },
    );

    return () => {
      active = false;
    };
  }, [slug]);

  return state;
}
