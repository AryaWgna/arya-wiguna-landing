// Schedule heavy non-critical work during idle time so the first frame doesn't
// block on it (falls back to a short macrotask when idle callback is missing).
export function scheduleIdle(fn: () => void) {
  if (typeof window !== "undefined") {
    const w = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number }
      ) => number;
    };
    if (w.requestIdleCallback) {
      w.requestIdleCallback(fn, { timeout: 1500 });
      return;
    }
    w.setTimeout(fn, 120);
  } else {
    setTimeout(fn, 120);
  }
}
