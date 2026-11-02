"use client";

import { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

/**
 * Boot sketch — monogram "AW." (Arya Wiguna), satu garis bersih per tarikan,
 * dikomposisi di tengah kanvas (SVG + GSAP draw-on).
 */
const DRAW_PATHS = [
  // ── Huruf "A" ───────────────────────────────────────────
  // Kaki kiri
  "M26 114 L52 46",
  // Kaki kanan
  "M52 46 L78 114",
  // Palang tengah
  "M38 92 L66 92",
  // ── Huruf "W" ───────────────────────────────────────────
  "M84 46 L94 114",
  "M94 114 L104 46",
  "M104 46 L114 114",
  "M114 114 L124 46",
  // ── Titik kecil di akhir ─────────────────────────────────
  "M132 107.5 Q135 110 132 112.5 Q129 110 132 107.5",
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
          stroke={i === DRAW_PATHS.length - 1 ? "var(--blue)" : "var(--navy)"}
          strokeWidth={i === DRAW_PATHS.length - 1 ? 1.4 : 1.8}
          opacity={1}
        />
      ))}
    </svg>
  );
}
