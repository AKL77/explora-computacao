import { describe, expect, it } from "vitest";

import { resources } from "@/data/resources.mock";
import { readyPaths } from "./readyTeachingPaths";

describe("Curadoria das Trilhas Prontas", () => {
  it("vincula cada etapa a um material existente e compatível com os anos da trilha", () => {
    expect(new Set(readyPaths.map((path) => path.id)).size).toBe(readyPaths.length);

    for (const path of readyPaths) {
      const ids = path.stages.map((stage) => stage.resourceId);
      expect(new Set(ids).size, path.name).toBe(ids.length);

      for (const stage of path.stages) {
        const resource = resources.find(({ id }) => id === stage.resourceId);
        expect(resource, `${path.name}: ${stage.resourceId}`).toBeDefined();
        for (const grade of path.grades) {
          expect(resource!.recommendedGrades, `${path.name}: ${resource!.title}`)
            .toContain(grade);
        }
      }
    }
  });
});
