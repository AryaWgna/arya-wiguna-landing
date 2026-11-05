"use client";

import { useEffect } from "react";
import { initLenis, destroyLenis, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

export function SmoothScroll() {
  useEffect(() => {
    if (isReducedMotion()) return;

    const lenis = initLenis();
    if (!lenis) return;

    const initialRefresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);

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
