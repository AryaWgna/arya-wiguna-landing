"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export const isReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (typeof window === "undefined" || isReducedMotion()) return null;
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
  });

  lenisInstance.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function destroyLenis() {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function scrollToHash(hash: string) {
  const id = hash.length > 1 ? hash.slice(1) : "";
  const lenis = getLenis();

  if (id) {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: -80,
        duration: 1.0,
        easing: (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  if (lenis) lenis.scrollTo(0, { duration: 0.85 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

let refreshTimer = 0;

export function scheduleScrollTriggerRefresh() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
}

if (typeof window !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  document.addEventListener("load", () => scheduleScrollTriggerRefresh(), true);

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => scheduleScrollTriggerRefresh());
  }
}

export { gsap, ScrollTrigger };
