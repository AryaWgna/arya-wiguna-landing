"use client";

import { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

/**
 * Boot — komposisi minimalis: wordmark tipis + hairline tipis + titik.
 * Tanpa goresan tangan, tanpa geometri 3D, tanpa efek terminal.
 */
export function BootSketch() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = root.querySelectorAll("[data-boot-min]");

    if (isReducedMotion()) {
      items.forEach((el) => el.classList.remove("opacity-0"));
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.18, ease: "power2.out", delay: 0.05 }
      );
      gsap.fromTo(
        "#boot-min-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: "power1.inOut", delay: 0.32 }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex h-full w-full flex-col items-center justify-center gap-4"
    >
      <p
        data-boot-min
        className="origin-left font-sans text-2xl font-light uppercase tracking-[0.18em] text-foreground opacity-0 md:text-3xl"
      >
        arya<span className="text-blue">.</span>wiguna
      </p>
      <div className="h-px w-44 overflow-hidden bg-border-line md:w-60">
        <div id="boot-min-rule" className="h-full w-full origin-center bg-blue" />
      </div>
      <div data-boot-min className="h-1.5 w-1.5 rounded-full bg-navy opacity-0" />
    </div>
  );
}