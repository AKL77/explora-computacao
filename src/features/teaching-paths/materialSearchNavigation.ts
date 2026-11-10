import { createContext, useCallback, useContext, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Grade } from "@/domain/curriculum";
import type { MaterialType } from "@/domain/materialType";
import type { MaterialKeywordId } from "@/data/materialKeywords";

export interface MaterialSearchFilters {
  query: string;
  selectedGrades: Grade[];
  selectedActivityModes: Array<"plugged" | "unplugged">;
  selectedMaterialTypes: MaterialType[];
  selectedKeywordIds: MaterialKeywordId[];
  selectedSkillCodes: string[];
}

export type MaterialSearchView = "list" | "covers";

export interface MaterialSearchSnapshot {
  filters: MaterialSearchFilters;
  scrollY: number;
  view: MaterialSearchView;
}

export const MaterialSearchNavigationContext = createContext<Map<string, MaterialSearchSnapshot> | null>(null);

export function useMaterialSearchNavigation(ready: boolean) {
  const cache = useContext(MaterialSearchNavigationContext);
  const { key } = useLocation();
  const [initialSnapshot] = useState(() => cache?.get(key));
  const [view, setView] = useState<MaterialSearchView>(initialSnapshot?.view ?? "list");

  const rememberFilters = useCallback((filters: MaterialSearchFilters) => {
    if (!cache) return;
    cache.set(key, { filters, scrollY: cache.get(key)?.scrollY ?? 0, view });
    if (cache.size > 20) cache.delete(cache.keys().next().value!);
  }, [cache, key, view]);

  const rememberPosition = useCallback(() => {
    if (!cache) return;
    const snapshot = cache.get(key);
    if (snapshot) cache.set(key, { ...snapshot, scrollY: window.scrollY });
  }, [cache, key]);

  useLayoutEffect(() => {
    if (!ready || !cache) return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: initialSnapshot?.scrollY ?? 0, left: 0, behavior: "instant" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [cache, initialSnapshot, ready]);

  return { initialFilters: initialSnapshot?.filters, rememberFilters, rememberPosition, entryKey: key, view, setView };
}
