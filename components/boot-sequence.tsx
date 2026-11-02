"use client";

import { useEffect, useState } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { BootSketch } from "@/components/boot-sketch";
import { useBoot } from "@/components/providers";

export function BootSequence() {
  const { setBootActive } = useBoot();
  const [phase, setPhase] = useState<"mounting" | "boot" | "done">("mounting");

  useEffect(() => {
    // Hormati prefers-reduced-motion (aksesibilitas). Boot selalu tampil saat refresh.
    if (isReducedMotion()) {
      setBootActive(false);
      setPhase("done");
      return;
    }
    setPhase("boot");

    const finished = () => {
      setBootActive(false);
      setPhase("done");
    };

    let overlay: HTMLElement | null = null;
    let ctx: gsap.Context | null = null;
    const total = 2600;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const tick = requestAnimationFrame(() => {
      overlay = document.getElementById("boot-sequence");
      if (!overlay) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          "#boot-visual",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
        gsap.fromTo(
          "#boot-progress",
          { scaleX: 0 },
          { scaleX: 1, duration: total / 1000, ease: "power1.inOut" }
        );
      }, overlay);

      later(() => {
        const el = overlay;
        if (!el) return;
        gsap.to(el, {
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: finished,
        });
      }, total);
    });

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      cancelAnimationFrame(tick);
      ctx?.revert();
      setBootActive(false);
    };
  }, []);

  if (phase !== "boot") return null;

  return (
    <div
      id="boot-sequence"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      aria-hidden="true"
    >
      <div
        id="boot-visual"
        className="relative aspect-square w-[min(62vw,420px)] opacity-0"
      >
        <BootSketch />
      </div>

      <div className="mt-12 h-px w-52 overflow-hidden bg-border-line">
        <div className="h-full w-full origin-left bg-blue" id="boot-progress" />
      </div>

      <button
        type="button"
        onClick={() => {
          setBootActive(false);
          setPhase("done");
        }}
        className="absolute bottom-6 right-6 font-mono text-xs text-muted transition-colors hover:text-foreground"
      >
        skip →
      </button>
    </div>
  );
}
