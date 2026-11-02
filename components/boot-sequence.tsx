"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { BootSketch } from "@/components/boot-sketch";
import { useLang, useBoot } from "@/components/providers";

const BOOT_LINES: { en: string; id: string }[] = [
  { en: "aryawgna", id: "aryawgna" },
  { en: "initializing portfolio…", id: "menginisialisasi portfolio…" },
  { en: "loading geometries…", id: "memuat geometri…" },
  { en: "mounting 3D scene…", id: "memasang scene 3D…" },
  { en: "ready.", id: "siap." },
];

export function BootSequence() {
  const { lang } = useLang();
  const { setBootActive } = useBoot();
  // Tangkap bahasa saat mount pertama — boot hanya berjalan sekali per load penuh
  const langRef = useRef(lang);
  const [phase, setPhase] = useState<"mounting" | "boot" | "done">("mounting");
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    // Hormati prefers-reduced-motion (aksesibilitas). Boot selalu tampil saat refresh.
    if (isReducedMotion()) {
      setBootActive(false);
      setPhase("done");
      return;
    }
    setPhase("boot");

    const locale = langRef.current === "id" ? "id" : "en";
    const activeLines = BOOT_LINES.map((l) => (locale === "id" ? l.id : l.en));

    const finished = () => {
      setBootActive(false);
      setPhase("done");
    };

    let overlay: HTMLElement | null = null;
    let ctx: gsap.Context | null = null;
    const total = 350 + BOOT_LINES.length * 420 + 500;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const tick = requestAnimationFrame(() => {
      overlay = document.getElementById("boot-sequence");
      if (!overlay) return;

      const idLines = activeLines;
      ctx = gsap.context(() => {
        setLines(idLines.slice(0, 1));
        gsap.fromTo(
          "#boot-3d",
          { scale: 0.85, autoAlpha: 0, y: 12 },
          { scale: 1, autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out" }
        );
        gsap.fromTo(
          "#boot-scanline",
          { yPercent: -120 },
          { yPercent: 320, duration: 2.4, ease: "none", repeat: -1 }
        );
        gsap.fromTo(
          "#boot-progress",
          { scaleX: 0 },
          { scaleX: 1, duration: total / 1000, ease: "power1.inOut" }
        );
      }, overlay);

      idLines.forEach((_, idx) => {
        later(() => {
          setLines(idLines.slice(0, idx + 1));
        }, 350 + idx * 420);
      });

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
      <div id="boot-3d" className="relative h-40 w-40 opacity-0">
        <BootSketch />
        {/* Scanline ala terminal boot */}
        <div
          id="boot-scanline"
          className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-blue/10 to-transparent"
        />
      </div>

      <div className="absolute right-6 top-6 font-mono text-xs tracking-widest text-muted">
        [{langRef.current === "id" ? "ID" : "EN"}]
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
