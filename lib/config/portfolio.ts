export const LANE = {
  step: 36,
  h: 9.2,
  x: 9.2,
  y: 5.2,
  z0: 148,
  n: 40,
  rx: 28,
  ry: 20,
} as const;

export const STREAM_R = 135;

export const PERIOD = 1280;

// Boot / reveal timings (ms)
export const BOOT_SAFETY_REVEAL_MS = 4000;
export const UI_REVEAL_DELAY_MS = 350;

// Flight behaviour defaults
export const FLY_START_TARGET = 108;
export const FLY_STEP = 90;
export const FLY_MAX_STEP = 42;
export const FLY_SLOW_STEP = 18;
export const FLY_END_ZONE = 720;
export const FLY_PORTRAIT_ZONE = 40;
