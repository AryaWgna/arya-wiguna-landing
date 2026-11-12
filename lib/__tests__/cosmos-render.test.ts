import { describe, expect, it } from "vitest";
import {
  applyStageFraming,
  buildRenderTiles,
  clamp01,
  computeHeadMask,
  computeSignatureProgress,
  easeInOutCubic,
  fitTextToWidth,
  isOffscreen,
  SIG_DRAW_DURATION,
  smoothstep01,
} from "../cosmos-render";
import { createInitialSimState } from "../cosmos-sim";

describe("easeInOutCubic", () => {
  it("maps endpoints exactly", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
  });

  it("is symmetric around 0.5", () => {
    expect(easeInOutCubic(0.25)).toBeCloseTo(1 - easeInOutCubic(0.75), 6);
  });
});

describe("smoothstep01", () => {
  it("matches smoothstep formula", () => {
    expect(smoothstep01(0)).toBe(0);
    expect(smoothstep01(1)).toBe(1);
    expect(smoothstep01(0.5)).toBe(0.5);
  });

  it("clamps outside [0,1]", () => {
    expect(smoothstep01(-1)).toBe(0);
    expect(smoothstep01(2)).toBe(1);
  });
});

describe("clamp01", () => {
  it("clamps values", () => {
    expect(clamp01(-0.5)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(1.5)).toBe(1);
  });
});

describe("applyStageFraming", () => {
  const layout = {
    W: 1280,
    H: 800,
    topbarBottom: 90,
    boxRight: 560,
    boxHeight: 640,
  };

  it("steps the frame toward its target and marks it ready", () => {
    const s = {
      activeView: "closed",
      fr: { cx: 0, cy: 0, w: 100, h: 100, ready: false },
    };
    applyStageFraming(s, layout, 1 / 60);
    expect(s.fr.ready).toBe(true);
    expect(s.fr.cx).toBeGreaterThan(0);
    expect(s.fr.w).toBeGreaterThan(100);
  });

  it("returns positive focal & portrait metrics", () => {
    const s = {
      activeView: "closed",
      fr: { cx: 100, cy: 100, w: 600, h: 400, ready: true },
    };
    const out = applyStageFraming(s, layout, 1 / 60);
    expect(out.focal).toBeGreaterThan(0);
    expect(out.portraitWorldW).toBeGreaterThan(0);
    expect(out.portraitWorldH).toBeGreaterThan(0);
    expect(out.D0).toBeGreaterThan(0);
  });

  it("frames around the box when a side view is open", () => {
    const s = {
      activeView: "credentials",
      fr: { cx: 0, cy: 0, w: 100, h: 100, ready: false },
    };
    applyStageFraming(s, layout, 0.1);
    // Wide desktop: stage shifts right of the box edge
    expect(s.fr.cx).toBeGreaterThan(200);
  });
});

describe("computeSignatureProgress", () => {
  it("is idle before start", () => {
    const r = computeSignatureProgress(0, 1000, 3600);
    expect(r.rawP).toBe(0);
    expect(r.drawn).toBe(0);
    expect(r.live).toBe(false);
    expect(r.offset).toBe("3600.0");
  });

  it("is live mid-stroke and finishes at full length", () => {
    const start = 1000;
    const mid = computeSignatureProgress(start + SIG_DRAW_DURATION / 2, start, 3600);
    expect(mid.live).toBe(true);
    expect(mid.drawn).toBeGreaterThan(0);
    expect(mid.drawn).toBeLessThan(3600);

    const done = computeSignatureProgress(
      start + SIG_DRAW_DURATION,
      start,
      3600
    );
    expect(done.rawP).toBe(1);
    expect(done.drawn).toBe(3600);
    expect(done.live).toBe(false);
    expect(done.offset).toBe("0.0");
  });
});

describe("computeHeadMask", () => {
  it("computes head-centered hole coordinates", () => {
    const m = computeHeadMask(
      { cx: 640, cy: 400 },
      500,
      800,
      600,
      2000,
      0,
      0
    );
    expect(m.hrx).toBeGreaterThan(0);
    expect(m.hry).toBeGreaterThan(0);
    expect(m.headX).toBeLessThan(640);
    expect(m.headY).toBeLessThan(400);
  });
});

describe("fitTextToWidth", () => {
  const measure = (s: string) => s.length * 8; // mock: 8px per char

  it("returns the string when it fits", () => {
    expect(fitTextToWidth("Hello", 100, measure)).toBe("Hello");
  });

  it("truncates with an ellipsis while staying under the max width", () => {
    const out = fitTextToWidth("A very long title that overflows", 120, measure);
    expect(out.endsWith("…")).toBe(true);
    expect(measure(out)).toBeLessThanOrEqual(120 + 8);
  });
});

describe("buildRenderTiles", () => {
  it("returns an empty list with no cells and no distance", () => {
    const s = createInitialSimState();
    const out = buildRenderTiles({
      s,
      W: 1280,
      H: 800,
      lowPower: false,
      ease: 0,
      introElapsed: 999999,
      camX: 0,
      camY: 0,
      camZ: 0,
      focal: 500,
      D0: 2000,
      cols: 10,
      rows: 10,
      cellW: 100,
      cellH: 100,
      maxPieceDist: 148 + 39 * 36,
      pieces: [],
      now: 0,
    });
    expect(out).toEqual([]);
  });
});

describe("isOffscreen", () => {
  const W = 1280;
  const H = 800;

  it("keeps visible rects", () => {
    expect(isOffscreen(100, 100, 200, 200, W, H)).toBe(false);
  });

  it("culls rects fully outside with margin", () => {
    expect(isOffscreen(-1000, 0, 200, 200, W, H)).toBe(true);
    expect(isOffscreen(W + 100, 0, 200, 200, W, H)).toBe(true);
    expect(isOffscreen(0, H + 100, 200, 200, W, H)).toBe(true);
  });

  it("keeps edge-touching rects", () => {
    expect(isOffscreen(-20, 0, 200, 200, W, H)).toBe(false);
    expect(isOffscreen(W - 20, 0, 200, 200, W, H)).toBe(false);
  });
});
