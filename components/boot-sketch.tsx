"use client";

import { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

/**
 * Boot sketch — monogram "AW." (Arya Wiguna) digambar tangan (SVG + GSAP).
 * Setiap garis digambar dua kali dengan offset tipis (efek tinta/pensil),
 * goresan punya ritme stagger sehingga terasa dibuat manusia, bukan render 3D.
 */
const DRAW_PATHS = [
  // ── Huruf "A" ───────────────────────────────────────────
  // Kaki kiri
  "M42 112 L70 44",
  "M43.2 111.2 L69.2 45.2",
  // Kaki kanan
  "M70 44 L98 112",
  "M68.8 45.2 L96.8 111.2",
  // Palang tengah
  "M54 90 L86 90",
  "M54.8 91 L85.2 91",
  // ── Huruf "W" ───────────────────────────────────────────
  "M104 44 L116 112",
  "M104.8 44.8 L115.2 111.2",
  "M116 112 L128 44",
  "M117.2 111.2 L127.2 45.2",
  "M128 44 L140 112",
  "M126.8 45.2 L138.8 111.2",
  "M140 112 L152 44",
  "M140.8 111.2 L151.2 45.2",
  // ── Titik kecil di akhir (hand-drawn dot) ────────────────
  "M154 105 Q157 108 154 111 Q151 108 154 105",
];

export function BootSketch() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));

    if (isReducedMotion()) {
      paths.forEach((p) => {
        p.style.strokeDasharray = "";
        p.style.strokeDashoffset = "";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const lens = paths.map((p) => p.getTotalLength());
      gsap.fromTo(
        paths,
        { strokeDasharray: (i: number) => lens[i], strokeDashoffset: (i: number) => lens[i] },
        {
          strokeDashoffset: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: "power2.inOut",
          delay: 0.15,
        }
      );
      // Kertas goyang — rotasi sangat halus, siklus panjang
      gsap.to(svg, {
        rotation: 1.6,
        scale: 0.985,
        duration: 4.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 160 160"
      className="h-full w-full"
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transformOrigin: "50% 50%" }}
    >
      {DRAW_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={i % 2 === 1 ? "var(--blue)" : "var(--navy)"}
          strokeWidth={i % 2 === 1 ? 1.1 : 1.6}
          opacity={i % 2 === 1 ? 0.55 : 1}
        />
      ))}
    </svg>
  );
}
