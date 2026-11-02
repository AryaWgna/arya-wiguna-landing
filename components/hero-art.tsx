"use client";

import { useEffect, useRef, useState } from "react";
import { isReducedMotion } from "@/lib/gsap";

/**
 * Solar system mini yang tenang (native Canvas 2D) — matahari kecil di
 * pusat dengan lingkaran orbit tipis, planet-planet mengorbit pelan.
 * Unik per kunjungan: jumlah planet, ukuran, fase awal, dan laju orbit
 * diacak dengan seed per load.
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

    // Tata surya mini — unik per kunjungan
    const planetCount = 3 + Math.floor(rng() * 2); // 3–4 planet
    const paletteShift = (rng() - 0.5) * 0.06;
    const sunRadius = 4 + rng() * 1.5;
    const planets = Array.from({ length: planetCount }, (_, i) => {
      const orbit = 0.2 + i * 0.19 + rng() * 0.03;
      return {
        orbit, // pecahan dari R
        size: 0.035 + rng() * 0.03, // pecahan dari R
        speed: (0.28 + rng() * 0.22) / Math.sqrt(orbit),
        phase: rng() * Math.PI * 2,
        blue: i === planetCount - 1,
        ringed: i === 1 && rng() > 0.5, // satu planet boleh bercincin
      };
    });

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
      const R = Math.min(w, h) * 0.42;

      ctx.lineCap = "round";

      // Matahari — inti navy + halo biru lembut
      ctx.fillStyle = NAVY.replace("ALPHA", "230");
      ctx.beginPath();
      ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = BLUE.replace("ALPHA", "60");
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, sunRadius * 2.2, 0, Math.PI * 2);
      ctx.stroke();

      // Orbit tipis + planet
      for (let i = 0; i < planets.length; i++) {
        const p = planets[i];
        const rr = R * p.orbit * (1 + paletteShift);

        ctx.strokeStyle = p.blue
          ? BLUE.replace("ALPHA", "46")
          : NAVY.replace("ALPHA", "34");
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.stroke();

        const th = p.phase + t * p.speed;
        const px = cx + Math.cos(th) * rr;
        const py = cy + Math.sin(th) * rr;
        const size = Math.max(2, R * p.size);

        if (p.ringed) {
          ctx.strokeStyle = NAVY.replace("ALPHA", "150");
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.ellipse(px, py, size * 2.1, size * 0.7, th + 0.4, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = p.blue
          ? BLUE.replace("ALPHA", "200")
          : NAVY.replace("ALPHA", "210");
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
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
