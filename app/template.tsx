"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, isReducedMotion, scrollToHash } from "@/lib/gsap";

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

    scrollToHash(window.location.hash);

    return () => {
      tween.kill();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
