"use client";

import { useEffect } from "react";
import { initLenis, destroyLenis, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

/**
 * Initialises Lenis smooth scroll and the scroll progress bar.
 * Mount once in the root layout (inside Providers).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (isReducedMotion()) return;

    const lenis = initLenis();
    if (!lenis) return;

    // Refresh trigger awal setelah layout stabil (font/gambar belum tentu siap).
    const initialRefresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    // Scroll progress indicator
    const bar = document.getElementById("scroll-progress");
    if (bar) {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          bar.style.transform = `scaleX(${self.progress})`;
        },
      });
    }

    return () => {
      window.clearTimeout(initialRefresh);
      destroyLenis();
    };
  }, []);

  return null;
}
