"use client";

import { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

/**
 * Boot sketch — doodle digambar tangan (SVG + GSAP).
 * Setiap garis digambar dua kali dengan offset tipis (efek tinta/pensil),
 * goresan punya ritme stagger sehingga terasa dibuat manusia, bukan render 3D.
 */
const DRAW_PATHS = [
  // Diagonal 1 (double-stroke)
  "M42 42 L118 118",
  "M43.4 42.6 L117.4 117.4",
  // Diagonal 2
  "M118 42 L42 118",
  "M117.4 43.4 L42.6 117.4",
  // Garis tengah vertikal
  "M80 36 L80 124",
  "M80.8 37 L79.2 123",
  // Lingkaran luar (dua busur saling susul — kesan coretan)
  "M80 34 A46 46 0 1 1 79.9 34",
  "M80 35.6 A44.4 44.4 0 1 0 80 35.6",
  // Belah ketupat kecil di pusat
  "M80 68 L96 80 L80 92 L64 80 Z",
  "M80 70.2 L93.8 80 L80 89.8 L66.2 80 Z",
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
