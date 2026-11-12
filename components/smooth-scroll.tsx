"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initLenis, destroyLenis, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      destroyLenis();
      return;
    }
    if (isReducedMotion()) return;

    const lenis = initLenis();
    if (!lenis) return;

    const initialRefresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(initialRefresh);
      destroyLenis();
    };
  }, [pathname]);

  return null;
}
