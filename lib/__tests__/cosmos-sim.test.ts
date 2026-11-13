import { describe, expect, it } from "vitest";
import {
  beginLoopWrap,
  computeFlightTarget,
  createInitialSimState,
  maxPieceDist,
  shouldWrapAtEnd,
} from "../cosmos-sim";
import { LANE } from "../config/portfolio";

describe("createInitialSimState", () => {
  it("returns a fresh default simulation state", () => {
    const s = createInitialSimState();
    expect(s.dist).toBe(0);
    expect(s.target).toBe(0);
    expect(s.activeView).toBe("closed");
    expect(s.lang).toBe("en");
    expect(s.seenSet.has(0)).toBe(true);
    expect(s.pendingOpen).toBeNull();
    expect(s.hoverPieceIdx).toBe(-1);
    expect(s.cells).toEqual([]);
    expect(s.thumbs).toEqual([]);
    expect(s.hiImgs).toEqual([]);
    expect(s.fr.ready).toBe(false);
  });

  it("returns independent states per call", () => {
    const a = createInitialSimState();
    const b = createInitialSimState();
    a.dist = 50;
    a.seenSet.add(7);
    expect(b.dist).toBe(0);
    expect(b.seenSet.has(7)).toBe(false);
  });
});

describe("maxPieceDist", () => {
  it("equals the first lane z for a single piece", () => {
    expect(maxPieceDist(1)).toBe(LANE.z0);
  });

  it("grows by the lane step per extra piece", () => {
    expect(maxPieceDist(5)).toBe(LANE.z0 + 4 * LANE.step);
  });
});

describe("computeFlightTarget", () => {
  it("caps step at maxStep and respects endReturnDist", () => {
    const s = createInitialSimState();
    s.dist = 100;
    s.target = 100;
    expect(computeFlightTarget(s, 500, 2000, 130)).toBe(230);

    const s2 = createInitialSimState();
    s2.dist = 200;
    s2.target = 200;
    expect(computeFlightTarget(s2, 10, 140, 130)).toBe(146);
  });

  it("clamps at zero for reverse input", () => {
    const s = createInitialSimState();
    s.dist = 5;
    s.target = 5;
    expect(computeFlightTarget(s, -20, 2000, 130)).toBe(0);
  });
});

describe("shouldWrapAtEnd", () => {
  it("triggers only when pushing forward past the end beyond the portrait zone", () => {
    expect(shouldWrapAtEnd(10, 2000, 1950, 100)).toBe(true);
    expect(shouldWrapAtEnd(-10, 1900, 1950, 100)).toBe(false);
    expect(shouldWrapAtEnd(10, 1900, 1950, 100)).toBe(false);
    expect(shouldWrapAtEnd(10, 2000, 1950, 30)).toBe(false);
  });
});

describe("beginLoopWrap", () => {
  it("resets flight state and schedules the signature hold", () => {
    const s = createInitialSimState();
    s.dist = 4000;
    s.target = 4000;
    const now = 100000;
    beginLoopWrap(s, now);
    expect(s.dist).toBe(0);
    expect(s.target).toBe(0);
    expect(s.introStart).toBe(now);
    expect(s.sigStart).toBe(now + 120);
    expect(s.autoFlyAt).toBe(0);
    expect(s.seenSet.has(0)).toBe(true);
    expect(s.nowK).toBe(-1);
  });
});

