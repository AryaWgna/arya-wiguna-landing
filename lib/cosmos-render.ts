// Pure math helpers shared by the 3D frame loop. Kept outside the component so
// they can be unit-tested and reused without touching DOM/canvas concerns.

import { PORTRAIT_CONFIG, rng } from "./cosmos-items";
import type { CosmosSimState } from "./cosmos-sim";
import { LANE, PERIOD, STREAM_R } from "./config/portfolio";

/** Cubic ease-in-out: 0 → 1, smooth at both ends. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Smoothstep (Hermite) clamp: 0 → 1. */
export function smoothstep01(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

/** Clamp helper, 0..1. */
export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

export const SIG_DRAW_DURATION = 2850;

/**
 * Progress of the hand-signing stroke draw. Returns the eased progress, the
 * drawn length, the dash offset, and whether the pen is live (mid-stroke).
 */
export function computeSignatureProgress(
  now: number,
  sigStart: number,
  totalLen: number,
  dur = SIG_DRAW_DURATION
): {
  rawP: number;
  drawn: number;
  offset: string;
  live: boolean;
} {
  const rawP = Math.min(1, Math.max(0, (now - sigStart) / dur));
  const p =
    rawP < 0.5 ? 2 * rawP * rawP : 1 - Math.pow(-2 * rawP + 2, 2) / 2;
  const drawn = p * totalLen;
  return {
    rawP,
    drawn,
    offset: (totalLen - drawn).toFixed(1),
    live: rawP > 0.01 && rawP < 0.995,
  };
}

/** Truncate a string with an ellipsis to fit a max width using the provided measure fn. */
export function fitTextToWidth(
  str: string,
  maxW: number,
  measure: (s: string) => number
): string {
  if (measure(str) <= maxW) return str;
  let out = str;
  while (out.length > 4 && measure(`${out}…`) > maxW) {
    out = out.slice(0, -1);
  }
  return `${out}…`;
}

/** True when a tile rect lies fully outside the viewport (with margin). */
export function isOffscreen(
  x: number,
  y: number,
  w: number,
  h: number,
  W: number,
  H: number,
  margin = 40
): boolean {
  return x + w < -margin || x > W + margin || y + h < -margin || y > H + margin;
}

/**
 * Soft radial hole position & radii in the signature around the portrait head.
 * Pure computation — the caller applies the CSS variables when values move.
 */
export function computeHeadMask(
  fr: { cx: number; cy: number },
  focal: number,
  portraitWorldW: number,
  portraitWorldH: number,
  D0: number,
  sigLeft: number,
  sigTop: number
): { headX: number; headY: number; hrx: number; hry: number } {
  const headX = fr.cx - ((0.06 * portraitWorldW) / D0) * focal - sigLeft;
  const headY = fr.cy - ((0.22 * portraitWorldH) / D0) * focal - sigTop;
  const hrx = ((0.24 * portraitWorldW) / D0) * focal;
  const hry = ((0.28 * portraitWorldH) / D0) * focal;
  return { headX, headY, hrx, hry };
}

type FramingState = {
  activeView: string;
  fr: { cx: number; cy: number; w: number; h: number; ready: boolean };
};

type FramingLayout = {
  W: number;
  H: number;
  topbarBottom: number;
  boxRight: number;
  boxHeight: number;
};

/**
 * Steps the stage framing (portrait rect) toward its target and returns the
 * computed focal length plus portrait world metrics used by later draw code.
 * Pure computation — no DOM access.
 */
export function applyStageFraming(
  s: FramingState,
  layout: FramingLayout,
  dt: number
): { focal: number; portraitWorldW: number; portraitWorldH: number; D0: number } {
  const wide = layout.W > 860;
  const open = s.activeView !== "closed";
  const top = Math.max(layout.topbarBottom, layout.H * 0.085);
  const bottom = layout.H * 1.05;
  let x0 = 0;
  const x1 = layout.W;
  const y0 = top;
  let y1 = Math.max(top + 200, bottom);

  if (open) {
    if (wide) {
      x0 = Math.min(layout.W * 0.52, Math.max(420, layout.boxRight));
    } else {
      y1 = Math.max(top + 160, layout.H - layout.boxHeight - 30);
    }
  }

  const tgtCx = !wide && !open ? layout.W * 0.48 : (x0 + x1) / 2;
  const tgtCy =
    !wide && !open
      ? layout.H * 0.46
      : (y0 + y1) / 2 - (open ? layout.H * 0.02 : layout.H * 0.075);
  const tgtW = Math.max(260, x1 - x0);
  const tgtH = !wide && !open ? layout.H * 0.68 : Math.max(240, y1 - y0);

  const fk = s.fr.ready ? 1 - Math.exp(-dt * 5.2) : 1;
  s.fr.cx += (tgtCx - s.fr.cx) * fk;
  s.fr.cy += (tgtCy - s.fr.cy) * fk;
  s.fr.w += (tgtW - s.fr.w) * fk;
  s.fr.h += (tgtH - s.fr.h) * fk;
  s.fr.ready = true;

  const { cols, rows, cellW, cellH, D0 } = PORTRAIT_CONFIG;
  const portraitWorldH = rows * cellH;
  const portraitWorldW = cols * cellW;
  const focalH = (s.fr.h * 0.92 * D0) / portraitWorldH;
  const focalW = (s.fr.w * 0.88 * D0) / portraitWorldW;
  const focal = wide || open ? Math.min(focalH, focalW) : focalH * 0.95;

  return { focal, portraitWorldW, portraitWorldH, D0 };
}

export function flowField(x: number, y: number, t: number): [number, number] {
  return [
    Math.sin(y * 0.045 + t * 0.35) + 0.6 * Math.sin((x + y) * 0.03 - t * 0.27),
    Math.cos(x * 0.045 - t * 0.31) + 0.6 * Math.cos((x - y) * 0.03 + t * 0.23),
  ];
}

export function lanePos(k: number) {
  const r = rng(k + 11, 99);
  const a = r() * Math.PI * 2;
  const rr = Math.sqrt(r());
  const h = LANE.h * (0.86 + r() * 0.28);
  return {
    x: Math.cos(a) * rr * LANE.x,
    y: Math.sin(a) * rr * LANE.y,
    z: -(LANE.z0 + k * LANE.step),
    h,
  };
}

export type RenderTile = {
  wx: number;
  wy: number;
  wz: number;
  depth: number;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  alpha: number;
  pieceIdx: number;
  rgbStr: string;
  shift: number;
  isLane: boolean;
  isCase: boolean;
};

type BuildRenderTilesCtx = {
  s: CosmosSimState;
  W: number;
  H: number;
  lowPower: boolean;
  ease: number;
  introElapsed: number;
  camX: number;
  camY: number;
  camZ: number;
  focal: number;
  D0: number;
  cols: number;
  rows: number;
  cellW: number;
  cellH: number;
  maxPieceDist: number;
  pieces: { isCaseStudy?: boolean }[];
  now: number;
};

export function buildRenderTiles(ctx: BuildRenderTilesCtx): RenderTile[] {
  const {
    s,
    W,
    H,
    lowPower,
    ease,
    introElapsed,
    camX,
    camY,
    camZ,
    focal,
    D0,
    cols,
    rows,
    cellW,
    cellH,
    maxPieceDist,
    pieces,
    now,
  } = ctx;



      const renderList: RenderTile[] = [];

      // 5A. Portrait cells (gen === 0) & recycled stream atmosphere tiles (gen > 0)
      const cells = s.cells;
      const streamStep = lowPower ? 3 : 2;
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        const gen = Math.max(
          0,
          Math.floor((s.dist - c.d + 35) / PERIOD)
        );

        let wx = 0;
        let wy = 0;
        let wz = 0;
        let h = 0;
        let dim = c.dim;
        let pIdx = c.pieceIndex;

        if (gen === 0) {
          // Hide center fillers when flying into the lane
          if (c.filler && ease > 0.55) continue;
          const k = c.d / D0;
          const h0 = cellH * k * 0.95;
          h = h0 * (c.hs + (1 - c.hs) * (c.filler ? 0 : ease));
          wx = (c.col + 0.5 - cols / 2) * cellW * k;
          wy = (rows / 2 - c.row - 0.5) * cellH * k;
          wz = -c.d;

          // Halo floaters drift in from the dark along a sine-wave flow field
          if (c.float && s.dist < PERIOD) {
            const f = c.float;
            const tSec = now / 1000;
            const u = (tSec * f[0] + f[2]) % 1;
            const out = Math.pow(1 - u, 1.6);
            const bx = wx / k;
            const by = wy / k - 8;
            const len = Math.hypot(bx, by) || 1;
            const sw = flowField(bx, by, tSec + f[3]);
            const R0 = f[4];
            wx += ((bx / len) * out * R0 + sw[0] * out * R0 * 0.35) * k;
            wy += ((by / len) * out * R0 + sw[1] * out * R0 * 0.35) * k;
            dim =
              c.dim *
              Math.min(1, u / 0.3) *
              (1 - Math.max(0, (u - 0.82) / 0.18) * 0.85) *
              (1 - ease * 0.85);
            h *= 0.6 + 0.4 * u;
          }

          // Intro arrival animation from deep space
          if (introElapsed < c.delay + c.dur) {
            let p = Math.min(
              1,
              Math.max(0, (introElapsed - c.delay) / c.dur)
            );
            p = 1 - Math.pow(1 - p, 3);
            wx = c.fromX + (wx - c.fromX) * p;
            wy = c.fromY + (wy - c.fromY) * p;
            wz = c.fromZ + (wz - c.fromZ) * p;
            dim *= Math.min(1, p * 1.6);
            h *= 0.35 + 0.65 * p;
          }
        } else {
          // Recycled atmosphere tunnel tiles when flying deep (capped at the end of the 3D lane)
          if (i % streamStep !== 0) continue;
          wz = -(c.d + gen * PERIOD);
          if (-wz > maxPieceDist + 24) continue;
          const r = rng(i + 1, gen);
          const ang = r() * Math.PI * 2;
          const rad = LANE.rx + (STREAM_R - LANE.rx) * Math.pow(r(), 0.82);
          h = 2.0 + Math.pow(r(), 2.0) * 6.8;
          wx = Math.cos(ang) * rad;
          wy = Math.sin(ang) * rad * 0.8;
          dim = 0.85;
          pIdx = (c.pieceIndex + gen * 7) % pieces.length;
        }

        const depth = camZ - wz;
        if (depth <= h * 1.15 || depth > 1250) continue;

        const fadeNear = Math.min(
          1,
          Math.max(0, (depth - h * 1.15) / (h * 1.45))
        );
        const fadeFar =
          depth > 520 ? Math.max(0, 1 - ((depth - 520) / 730) * ease) : 1;
        const fillerFade = c.filler ? Math.max(0, 1 - ease * 1.7) : 1;
        const alpha = fadeNear * fadeFar * fillerFade * dim;
        if (alpha < 0.04) continue;

        const scale = focal / depth;
        const sh = h * scale;
        const sw = sh * (4 / 3);
        const sx = s.fr.cx + (wx - camX) * scale - sw / 2;
        const sy = s.fr.cy - (wy - camY) * scale - sh / 2;

        if (sx + sw < -20 || sx > W + 20 || sy + sh < -20 || sy > H + 20) {
          continue;
        }

        renderList.push({
          wx,
          wy,
          wz,
          depth,
          sx,
          sy,
          sw,
          sh,
          alpha,
          pieceIdx: pIdx,
          rgbStr: c.rgbStr,
          shift: gen === 0 ? 0.78 * (1 - ease) : 0,
          isLane: false,
          isCase: false,
        });
      }

      // 5B. Center Lane pieces (appear as you fly away from the portrait, capped at pieces.length)
      const laneFade = Math.min(1, Math.max(0, (ease - 0.1) / 0.55));
      if (laneFade > 0.02 && pieces.length > 0) {
        const firstK = Math.max(
          0,
          Math.floor((s.dist - LANE.z0) / LANE.step) - 1
        );
        const laneCount = lowPower ? 28 : LANE.n;
        const maxK = Math.min(pieces.length, firstK + laneCount);
        for (let k = firstK; k < maxK; k++) {
          const lp = lanePos(k);
          const depth = camZ - lp.z;
          if (depth <= lp.h * 1.12 || depth > 1200) continue;

          const fadeNear = Math.min(
            1,
            Math.max(0, (depth - lp.h * 1.12) / (lp.h * 1.5))
          );
          const fadeFar =
            depth > 540 ? Math.max(0, 1 - (depth - 540) / 660) : 1;
          const alpha = laneFade * fadeNear * fadeFar;
          if (alpha < 0.03) continue;

          const scale = focal / depth;
          const sh = lp.h * scale;
          const sw = sh * (4 / 3);
          const sx = s.fr.cx + (lp.x - camX) * scale - sw / 2;
          const sy = s.fr.cy - (lp.y - camY) * scale - sh / 2;

          if (isOffscreen(sx, sy, sw, sh, W, H)) {
            continue;
          }

          const pIdx = k % pieces.length;
          renderList.push({
            wx: lp.x,
            wy: lp.y,
            wz: lp.z,
            depth,
            sx,
            sy,
            sw,
            sh,
            alpha,
            pieceIdx: pIdx,
            rgbStr: "rgb(240,240,240)",
            shift: 0,
            isLane: true,
            isCase: Boolean(pieces[pIdx]?.isCaseStudy),
          });
        }
      }

      // Sort back-to-front (largest depth first)
      renderList.sort((a, b) => b.depth - a.depth);

      return renderList;
}
