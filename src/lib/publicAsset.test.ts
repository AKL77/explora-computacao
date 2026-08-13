import { describe, expect, it } from "vitest";

import { publicAsset } from "./publicAsset";

describe("publicAsset", () => {
  it("remove a barra inicial e usa o caminho-base do Vite", () => {
    expect(publicAsset("/branding/logo.png")).toBe("/branding/logo.png");
    expect(publicAsset("images/card.png")).toBe("/images/card.png");
  });
});
