"use client";

import { useEffect, useRef } from "react";
import { isReducedMotion } from "@/lib/gsap";

/**
 * TiltCard — efek 3D miring natural mengikuti kursor (CSS/JS murni).
 * Menggunakan lerp halus (bukan snap) sehingga terasa seperti benda nyata.
 * Nonaktif otomatis saat reduced-motion, layar sentuh, atau pointer kasar.
 */
export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let cx = 0;
    let cy = 0;
    let rx = 0;
    let ry = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      cx = (e.clientX - r.left) / r.width - 0.5;
      cy = (e.clientY - r.top) / r.height - 0.5;
    };
    const onLeave = () => {
      cx = 0;
      cy = 0;
    };
    const loop = () => {
      rx += (-cy * 7 - rx) * 0.1;
      ry += (cx * 9 - ry) * 0.1;
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
