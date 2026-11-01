"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

/**
 * Transisi antar-halaman (App Router): enter fade/slide halus.
 * Reduced-motion → halaman tampil normal.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || isReducedMotion()) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );

    // Pastikan pindah halaman selalu mulai dari atas, kecuali ada hash (mis. /#projects)
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        }
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      }
    }

    return () => {
      tween.kill();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
