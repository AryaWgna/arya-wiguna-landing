"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { BootSketch } from "@/components/boot-sketch";
import { useBoot } from "@/components/providers";

/** Durasi overlay tampil setelah konten 3D siap (ms). */
const SHOW_MS = 2400;

/**
 * Batas maksimal menunggu kesiapan 3D (font + WebGL + frame pertama).
 * Jika jaringan lambat sehingga font belum datang dalam batas ini, boot
 * tetap berlanjut agar pengunjung tidak menunggu terlalu lama.
 */
const MAX_WAIT_MS = 5000;

export function BootSequence() {
  const { setBootActive } = useBoot();
  const [phase, setPhase] = useState<"mounting" | "boot" | "done">("mounting");

  const startedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  }, []);

  const finish = useCallback(() => {
    setBootActive(false);
    setPhase("done");
  }, [setBootActive]);

  const startReveal = useCallback(() => {
    const overlay = document.getElementById("boot-sequence");
    if (!overlay) return;

    gsap.context(() => {
      gsap.fromTo(
        "#boot-visual",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }, overlay);

    later(() => {
      const el = document.getElementById("boot-sequence");
      if (!el) return;
      gsap.to(el, {
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: finish,
      });
    }, SHOW_MS);
  }, [later, finish]);

  /** Jalankan reveal sekali saja — menang jika 3D siap atau cap terlampaui. */
  const tryStart = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startReveal();
  }, [startReveal]);

  useEffect(() => {
    // Hormati prefers-reduced-motion (aksesibilitas). Boot selalu tampil saat refresh.
    if (isReducedMotion()) {
      setBootActive(false);
      setPhase("done");
      return;
    }
    setPhase("boot");

    // Pengaman: kalau 3D belum siap dalam MAX_WAIT_MS (font lambat/gagal,
    // WebGL tidak tersedia), tetap lanjut — jangan biarkan layar kosong.
    later(tryStart, MAX_WAIT_MS);

    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, [later, tryStart, setBootActive]);

  if (phase !== "boot") return null;

  return (
    <div
      id="boot-sequence"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      aria-hidden="true"
    >
      <div
        id="boot-visual"
        className="relative h-48 w-[min(98vw,1160px)] opacity-0 md:h-64"
      >
        <BootSketch onReady={tryStart} />
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
