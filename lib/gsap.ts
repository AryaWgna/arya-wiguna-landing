"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** True jika pengguna memilih reduced-motion (semua animasi dimatikan). */
export const isReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Refresh posisi trigger sekali setelah halaman selesai dimuat
// (font/asset bisa menggeser layout).
if (typeof window !== "undefined") {
  window.addEventListener(
    "load",
    () => {
      ScrollTrigger.refresh();
    },
    { once: true }
  );
}

export { gsap, ScrollTrigger };
