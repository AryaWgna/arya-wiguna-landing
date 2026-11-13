import type { BoxView } from "@/components/vadim-glass-box";
import type { PortraitCell } from "./cosmos-items";
import { LANE } from "./config/portfolio";

export type CosmosSimState = {
  dist: number;
  target: number;
  rewind: { from: number; t0: number; dur: number } | null;
  rewindLockUntil: number;
  mx: number;
  my: number;
  smx: number;
  smy: number;
  pointerX: number;
  pointerY: number;
  aimX: number;
  aimY: number;
  aimTx: number;
  aimTy: number;
  aimOn: boolean;
  aimAt: number;
  pendingOpen: {
    itemIdx: number;
    mediaIdx: number;
    at: number;
    t0: number;
  } | null;
  hoverPieceIdx: number;
  hoverWorldPos: { x: number; y: number; z: number } | null;
  introStart: number;
  sigStart: number;
  sigWasAway: boolean;
  sigTotalLen: number;
  autoFlyAt: number;
  activeView: BoxView;
  lang: "en" | "id";
  nowK: number;
  seenSet: Set<number>;
  fr: { cx: number; cy: number; w: number; h: number; ready: boolean };
  layout: {
    W: number;
    H: number;
    dpr: number;
    lowPower: boolean;
    topbarBottom: number;
    boxRight: number;
    boxHeight: number;
    sigLeft: number;
    sigTop: number;
    dirty: boolean;
  };
  lastHx: number;
  lastHy: number;
  lastHrx: number;
  lastHry: number;
  lastInputAt: number;
  lastRenderAt: number;
  lastAwayClass: boolean;
  lastFarClass: boolean;
  lastHotClass: boolean;
  lastHudPieceIdx: number;
  cells: PortraitCell[];
  portraitCanvas: HTMLCanvasElement | null;
  thumbs: (HTMLCanvasElement | null)[];
  hiImgs: (HTMLImageElement | null)[];
  drawnRects: {
    x: number;
    y: number;
    w: number;
    h: number;
    pieceIdx: number;
    wx: number;
    wy: number;
    wz: number;
  }[];
};

export function createInitialSimState(): CosmosSimState {
  return {
    dist: 0,
    target: 0,
    rewind: null,
    rewindLockUntil: 0,
    mx: 0,
    my: 0,
    smx: 0,
    smy: 0,
    pointerX: -999,
    pointerY: -999,
    aimX: 0,
    aimY: 0,
    aimTx: 0,
    aimTy: 0,
    aimOn: false,
    aimAt: 0,
    pendingOpen: null,
    hoverPieceIdx: -1,
    hoverWorldPos: null,
    introStart: -1,
    sigStart: -1,
    sigWasAway: false,
    sigTotalLen: 3600,
    autoFlyAt: 0,
    activeView: "closed",
    lang: "en",
    nowK: -1,
    seenSet: new Set([0]),
    fr: { cx: 0, cy: 0, w: 0, h: 0, ready: false },
    layout: {
      W: 1280,
      H: 800,
      dpr: 1,
      lowPower: false,
      topbarBottom: 68,
      boxRight: 560,
      boxHeight: 640,
      sigLeft: 0,
      sigTop: 96,
      dirty: true,
    },
    lastHx: -999,
    lastHy: -999,
    lastHrx: 0,
    lastHry: 0,
    lastInputAt: 0,
    lastRenderAt: 0,
    lastAwayClass: false,
    lastFarClass: false,
    lastHotClass: false,
    lastHudPieceIdx: -2,
    cells: [],
    portraitCanvas: null,
    thumbs: [],
    hiImgs: [],
    drawnRects: [],
  };
}

export function maxPieceDist(pieceCount: number): number {
  return LANE.z0 + Math.max(0, pieceCount - 1) * LANE.step;
}

export function computeFlightTarget(
  s: Pick<CosmosSimState, "dist" | "target">,
  delta: number,
  endReturnDist: number,
  maxStep: number
): number {
  return Math.min(
    endReturnDist + 6,
    s.dist + maxStep,
    Math.max(0, s.target + delta)
  );
}

export function shouldWrapAtEnd(
  delta: number,
  nextTarget: number,
  endReturnDist: number,
  dist: number
): boolean {
  return delta > 0 && nextTarget >= endReturnDist && dist > 40;
}

export function beginLoopWrap(s: CosmosSimState, now: number): void {
  s.dist = 0;
  s.target = 0;
  s.aimOn = false;
  s.aimTx = 0;
  s.aimTy = 0;
  s.introStart = now;
  s.sigStart = now + 120;
  s.seenSet = new Set([0]);
  s.nowK = -1;
  s.autoFlyAt = 0;
}
