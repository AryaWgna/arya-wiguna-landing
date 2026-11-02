"use client";

import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import { isReducedMotion } from "@/lib/gsap";

/**
 * Seni organik generatif (p5.js) — kontur medan noise yang hidup perlahan.
 * Bukan blob/partikel: garis kontur topografi, palet situs, tenang.
 * Setiap load memakai seed acak → setiap kunjungan sedikit berbeda (buatan tangan).
 */
export default function HeroArt({ paused = false }: { paused?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (paused) return;
    const mount = mountRef.current;
    if (!mount) return;

    const sketch = (p: p5) => {
      const seed = Math.floor(Math.random() * 100000);
      const reduced = isReducedMotion();
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      let mx = 0.5;
      let my = 0.5;
      let tx = 0.5;
      let ty = 0.5;

      p.setup = () => {
        p.pixelDensity(Math.min(window.devicePixelRatio || 1, 1.5));
        p.noiseSeed(seed);
        p.frameRate(30);
        resize();
        if (reduced) p.noLoop();
      };

      const resize = () => {
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        p.resizeCanvas(w, h);
        p.clear();
      };

      const drawField = () => {
        p.clear();
        const t = reduced ? 0 : p.millis() / 1000;
        const ox = (tx - 0.5) * 40;
        const oy = (ty - 0.5) * 40;
        const cx = p.width / 2 + ox;
        const cy = p.height / 2 + oy;
        const maxR = Math.min(p.width, p.height) * 0.46;
        const rings = 18;
        const pts = 90;
        const ls = 0.014;
        const lt = 0.08;
        const NAVY = [23, 42, 69];
        const BLUE = [71, 120, 169];

        p.strokeWeight(1.1);
        p.noFill();

        for (let r = 0; r < rings; r++) {
          const base = (r / rings) * maxR;
          const alpha = 30 + (1 - r / rings) * 36;
          const col = r % 3 === 0 ? NAVY : BLUE;
          p.stroke(col[0], col[1], col[2], alpha);
          p.beginShape();
          for (let i = 0; i <= pts; i++) {
            const a = (i / pts) * Math.PI * 2;
            const n = p.noise(
              cx + Math.cos(a) * base * ls,
              cy + Math.sin(a) * base * ls,
              t * lt
            );
            const rr = base * (0.72 + n * 0.56);
            p.vertex(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
          }
          p.endShape(p.CLOSE);
        }
      };

      p.draw = () => {
        tx += (mx - tx) * 0.04;
        ty += (my - ty) * 0.04;
        drawField();
      };

      const onPointer = (e: PointerEvent) => {
        const rect = mount.getBoundingClientRect();
        mx = (e.clientX - rect.left) / Math.max(rect.width, 1);
        my = (e.clientY - rect.top) / Math.max(rect.height, 1);
      };

      if (finePointer && !reduced) {
        mount.addEventListener("pointermove", onPointer);
      }

      let inView = true;
      const obs = new IntersectionObserver((entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        if (inView && !document.hidden) p.loop();
        else p.noLoop();
      });
      obs.observe(mount);

      const onVis = () => {
        if (!document.hidden && inView) p.loop();
        else p.noLoop();
      };
      document.addEventListener("visibilitychange", onVis);

      const ro = new ResizeObserver(resize);
      ro.observe(mount);
    };

    const inst = new p5(sketch, mount);
    setReady(true);

    return () => {
      inst.remove();
    };
  }, [paused]);

  return (
    <div className="relative aspect-square w-full max-w-[420px]" aria-hidden="true">
      <div ref={mountRef} className="absolute inset-0" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-40 rounded-full border border-border-line bg-surface" />
        </div>
      )}
    </div>
  );
}
