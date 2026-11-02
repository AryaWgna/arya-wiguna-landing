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

    // Parameter "tangan" unik per kunjungan
    const ringCount = 3 + Math.floor(rng() * 2);
    const strokeCount = 20 + Math.floor(rng() * 12);
    const drift = rng() * Math.PI * 2;
    const breath = 0.012 + rng() * 0.02;
    const skew = (rng() - 0.5) * 0.08;

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
      const ox = (tx - 0.5) * 36;
      const oy = (ty - 0.5) * 36;
      const cx = w / 2 + ox;
      const cy = h / 2 + oy;
      const R = Math.min(w, h) * 0.44;
      const rot = t * 0.02 + drift;
      const scale = 1 + Math.sin(t * 0.5) * breath;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Doodle orbit: goresan pendek yang saling tumpang tindih
      for (let i = 0; i < strokeCount; i++) {
        const ring = i % ringCount;
        const radius = R * (0.55 + (ring / Math.max(ringCount - 1, 1)) * 0.32);
        const a0 = rng() * Math.PI * 2;
        const span = 0.5 + rng() * 1.1;
        const sag = 0.018 + rng() * 0.03;
        const alpha = 26 + rng() * 34;
        const col = rng() > 0.5 ? NAVY : BLUE;
        const lw = 0.9 + rng() * 0.9;
        const wob = (rng() - 0.5) * 4;

        ctx.strokeStyle = col.replace("ALPHA", String(alpha));
        ctx.lineWidth = lw;
        ctx.beginPath();
        const steps = 9;
        for (let k = 0; k <= steps; k++) {
          const a = a0 + (k / steps) * span + rot;
          const rr = radius + Math.sin(a * 2.2 + i) * sag * radius + wob;
          const px = cx + Math.cos(a) * rr * scale + Math.sin(a * 3 + i) * skew * R * 0.2;
          const py = cy + Math.sin(a) * rr * scale;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Serpihan pena: goresan pendek acak di sekitar gambar
      const ticks = 5 + Math.floor(rng() * 5);
      for (let i = 0; i < ticks; i++) {
        const a = rng() * Math.PI * 2 + rot;
        const rr = R * (0.98 + rng() * 0.3);
        const px = cx + Math.cos(a) * rr;
        const py = cy + Math.sin(a) * rr;
        const len = 5 + rng() * 9;
        const tang = a + Math.PI / 2 + (rng() - 0.5) * 0.5;
        ctx.strokeStyle = BLUE.replace("ALPHA", String(24 + rng() * 26));
        ctx.lineWidth = 0.8 + rng() * 0.6;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(tang) * len, py + Math.sin(tang) * len);
        ctx.stroke();
      }
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
