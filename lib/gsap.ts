"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/** True jika pengguna memilih reduced-motion (semua animasi dimatikan). */
export const isReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Lenis smooth scroll ────────────────────── */
let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (typeof window === "undefined" || isReducedMotion()) return null;
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
  });

  // Bridge Lenis → ScrollTrigger
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

/* ── Smooth hash scrolling (Lenis-aware) ─────────── */
export function scrollToHash(hash: string) {
  const id = hash.length > 1 ? hash.slice(1) : "";
  const lenis = getLenis();

  if (id) {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: -80,
        duration: 1.1,
        easing: (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  if (lenis) lenis.scrollTo(0, { duration: 0.9 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ── Refresh positions on load ──────────────── */
let refreshTimer = 0;

/** Debounce refresh ScrollTrigger (dipakai saat layout bergeser). */
export function scheduleScrollTriggerRefresh() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
}

if (typeof window !== "undefined") {
  window.addEventListener(
    "load",
    () => {
      ScrollTrigger.refresh();
    },
    { once: true }
  );

  // Gambar dimuat belakangan (lazy) menggeser layout → refresh trigger.
  // Capture-phase menangkap semua event load (termasuk <img>).
  document.addEventListener("load", () => scheduleScrollTriggerRefresh(), true);

  // Font selesai dimuat → ukuran teks bisa berubah → refresh.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => scheduleScrollTriggerRefresh());
  }
}

/* ── Text splitting utility ─────────────────── */
export function splitTextIntoSpans(
  element: HTMLElement,
  mode: "words" | "chars" = "words"
): HTMLSpanElement[] {
  const text = element.textContent || "";
  element.textContent = "";
  element.setAttribute("aria-label", text);

  const units = mode === "chars" ? text.split("") : text.split(/(\s+)/);
  const spans: HTMLSpanElement[] = [];

  units.forEach((unit) => {
    if (/^\s+$/.test(unit)) {
      element.appendChild(document.createTextNode(unit));
      return;
    }

    const wrapper = document.createElement("span");
    wrapper.style.display = "inline-block";
    wrapper.style.overflow = "hidden";
    wrapper.style.verticalAlign = "top";

    const inner = document.createElement("span");
    inner.textContent = unit;
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.setAttribute("aria-hidden", "true");

    wrapper.appendChild(inner);
    element.appendChild(wrapper);
    spans.push(inner);
  });

  return spans;
}

/* ── Magnetic effect utility ────────────────── */
export function createMagneticEffect(
  el: HTMLElement,
  strength: number = 0.3
): () => void {
  if (isReducedMotion()) return () => {};

  const onMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: "power3.out" });
  };

  const onLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);

  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };
}

export { gsap, ScrollTrigger };
