import { describe, expect, it } from "vitest";
import { rng } from "../cosmos-items";

describe("rng", () => {
  it("is deterministic for the same seed", () => {
    const a = rng(42, 99);
    const b = rng(42, 99);
    const va = [a(), a(), a()];
    const vb = [b(), b(), b()];
    expect(va).toEqual(vb);
  });

  it("produces values in [0, 1)", () => {
    const r = rng(1, 17);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
