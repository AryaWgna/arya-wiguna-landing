"use client";

import { useEffect, useState } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import Hero3D from "@/components/hero-3d";

const BOOT_LINES: { en: string; id: string }[] = [
  { en: "aryawgna v2.0.0", id: "aryawgna v2.0.0" },
  { en: "initializing portfolio…", id: "menginisialisasi portfolio…" },
  { en: "loading geometries…", id: "memuat geometri…" },
  { en: "mounting 3D scene…", id: "memasang scene 3D…" },
  { en: "ready.", id: "siap." },
];

export function BootSequence() {
  const [phase, setPhase] = useState<"mounting" | "boot" | "done">("mounting");
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    // Skip: reduced-motion, atau sudah pernah boot di sesi ini
    if (isReducedMotion() || sessionStorage.getItem("aw-booted")) {
      setPhase("done");
      return;
    }
    setPhase("boot");

    const finished = () => {
      sessionStorage.setItem("aw-booted", "1");
      setPhase("done");
    };

    let overlay: HTMLElement | null = null;
    let ctx: gsap.Context | null = null;
    const total = 350 + BOOT_LINES.length * 420 + 500;

    const tick = requestAnimationFrame(() => {
      overlay = document.getElementById("boot-sequence");
      if (!overlay) return;

      const idLines = BOOT_LINES.map((l) => l.id);
      ctx = gsap.context(() => {
        setLines(idLines.slice(0, 1));
        gsap.fromTo(
          "#boot-progress",
          { scaleX: 0 },
          { scaleX: 1, duration: total / 1000, ease: "power1.inOut" }
        );
      }, overlay);

      idLines.forEach((_, idx) => {
        window.setTimeout(() => {
          setLines(idLines.slice(0, idx + 1));
        }, 350 + idx * 420);
      });

      window.setTimeout(() => {
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
      cancelAnimationFrame(tick);
      ctx?.revert();
    };
  }, []);

  if (phase !== "boot") return null;

  return (
    <div
      id="boot-sequence"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      aria-hidden="true"
    >
      <div className="h-40 w-40">
        <Hero3D />
      </div>

      <div className="mt-6 flex items-baseline gap-2 font-mono text-xl font-bold tracking-tight text-foreground">
        AW<span className="text-blue">.</span>
      </div>

      <div className="mt-5 flex min-h-[96px] flex-col items-center gap-1.5 font-mono text-xs text-muted">
        {lines.map((line, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-blue">▸</span>
            <span>{line}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 h-px w-48 overflow-hidden bg-border-line">
        <div className="h-full w-full origin-left bg-blue" id="boot-progress" />
      </div>

      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem("aw-booted", "1");
          setPhase("done");
        }}
        className="absolute bottom-6 right-6 font-mono text-xs text-muted transition-colors hover:text-foreground"
      >
        skip →
      </button>
    </div>
  );
}
