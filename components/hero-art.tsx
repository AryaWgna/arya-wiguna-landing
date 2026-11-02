"use client";

import { useEffect, useRef, useState } from "react";
import { isReducedMotion } from "@/lib/gsap";

/**
 * Sketsa tangan asli (native Canvas 2D) — goresan orbit pendek yang tidak
 * sempurna, seperti doodle pena di tepi kertas. Bukan geometri presisi:
 * setiap goresan punya jitter sudut, sag radial, dan tekanan garis yang
 * bervariasi. Seed acak per load → setiap kunjungan unik.
 */
export default function HeroArt({ paused = false }: { paused?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (paused) return;
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;

    const reduced = isReducedMotion();
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const seed = Math.floor(Math.random() * 1e9);
    let s = seed >>> 0;
    const rng = () => {
      s += 0x6d2b79f5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    // Komposisi minimalis — unik per kunjungan
    const ringCount = 2 + Math.floor(rng() * 2); // 2–3 cincin
    const paletteShift = (rng() - 0.5) * 0.06;
    const drift = rng() * Math.PI * 2;
    const dotRadius = 3 + rng() * 1.5;

    const NAVY = "rgba(23, 42, 69, ALPHA)";
    const BLUE = "rgba(71, 120, 169, ALPHA)";

    let mx = 0.5;
    let my = 0.5;
    let tx = 0.5;
    let ty = 0.5;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFrame = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      ctx.clearRect(0, 0, w, h);

      const t = reduced ? 0 : performance.now() / 1000;
      const ox = (tx - 0.5) * 24;
      const oy = (ty - 0.5) * 24;
      const cx = w / 2 + ox;
      const cy = h / 2 + oy;
      const R = Math.min(w, h) * 0.4;
      const rot = t * 0.025 + drift;

      ctx.lineCap = "round";

      // Cincin tipis sempurna — minimalis
      ctx.lineWidth = 1.1;
      for (let i = 0; i < ringCount; i++) {
        const rr = R * (0.34 + i * 0.22) * (1 + paletteShift);
        const col =
          i === ringCount - 1 ? BLUE.replace("ALPHA", "52") : NAVY.replace("ALPHA", "38");
        ctx.strokeStyle = col;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Titik aksen — mengorbit pelan di cincin terluar
      const outerR = R * (0.34 + (ringCount - 1) * 0.22) * (1 + paletteShift);
      ctx.fillStyle = NAVY.replace("ALPHA", "210");
      ctx.beginPath();
      ctx.arc(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      // Titik kecil kedua di cincin dalam (aksen biru)
      const innerR = R * 0.34 * (1 + paletteShift);
      ctx.fillStyle = BLUE.replace("ALPHA", "120");
      ctx.beginPath();
      ctx.arc(
        cx + Math.cos(rot + 2.1) * innerR,
        cy + Math.sin(rot + 2.1) * innerR,
        dotRadius * 0.65,
        0,
        Math.PI * 2
      );
      ctx.fill();
    };

    const loop = () => {
      tx += (mx - tx) * 0.04;
      ty += (my - ty) * 0.04;
      drawFrame();
    };

    const onPointer = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mx = (e.clientX - rect.left) / Math.max(rect.width, 1);
      my = (e.clientY - rect.top) / Math.max(rect.height, 1);
    };

    resize();
    if (finePointer && !reduced) mount.addEventListener("pointermove", onPointer);

    let raf = 0;
    let inView = true;

    if (reduced) {
      drawFrame();
    } else {
      const tick = () => {
        loop();
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    const startLoop = () => {
      if (raf) return;
      const tick = () => {
        loop();
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const obs = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      if (reduced) return;
      if (inView && !document.hidden) startLoop();
      else stopLoop();
    });
    obs.observe(mount);

    const onVis = () => {
      if (reduced) return;
      if (!document.hidden && inView) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", onVis);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) drawFrame();
    });
    ro.observe(mount);

    setReady(true);

    return () => {
      stopLoop();
      mount.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      obs.disconnect();
      ro.disconnect();
    };
  }, [paused]);

  return (
    <div className="relative aspect-square w-full max-w-[420px]" aria-hidden="true">
      <div ref={mountRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-40 rounded-full border border-border-line bg-surface" />
        </div>
      )}
    </div>
  );
}
