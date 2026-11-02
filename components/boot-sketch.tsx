"use client";

import { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

type Seg = [[number, number], [number, number]];

/**
 * Alfabet monoline (unit 0–1, y mengarah ke bawah) — huruf blok bersih
 * ala coretan tangan, dipakai untuk mengeja "ARYA WIGUNA".
 */
const LETTERS: Record<string, Seg[]> = {
  A: [
    [[0.5, 0], [0, 1]],
    [[0.5, 0], [1, 1]],
    [[0.15, 0.66], [0.85, 0.66]],
  ],
  R: [
    [[0, 0], [0, 1]],
    [[0, 0], [0.62, 0]],
    [[0.62, 0], [0.74, 0.2]],
    [[0.74, 0.2], [0.74, 0.4]],
    [[0.74, 0.4], [0.62, 0.58]],
    [[0.62, 0.58], [0, 0.58]],
    [[0.62, 0.58], [1, 1]],
  ],
  Y: [
    [[0, 0], [0.5, 0.5]],
    [[1, 0], [0.5, 0.5]],
    [[0.5, 0.5], [0.5, 1]],
  ],
  W: [
    [[0, 0], [0.33, 1]],
    [[0.33, 1], [0.5, 0]],
    [[0.5, 0], [0.67, 1]],
    [[0.67, 1], [1, 0]],
  ],
  I: [[[0.5, 0], [0.5, 1]]],
  G: [
    [[0.35, 0], [1, 0]],
    [[1, 0], [1, 1]],
    [[1, 1], [0.35, 1]],
    [[0.35, 1], [0.2, 0.5]],
    [[0.2, 0.5], [0.35, 0]],
    [[0.4, 0.55], [1, 0.55]],
  ],
  U: [
    [[0, 0], [0, 1]],
    [[1, 0], [1, 1]],
    [[0, 1], [1, 1]],
  ],
  N: [
    [[0, 0], [0, 1]],
    [[0, 0], [1, 1]],
    [[1, 0], [1, 1]],
  ],
};

const SPELLING = "ARYA WIGUNA";
const SX = 46; // lebar 1 unit huruf (px)
const SY = 108; // tinggi 1 unit huruf (px)
const X0 = 48; // margin kiri agar komposisi di tengah
const Y0 = 6; // margin atas
const ADV = 54; // jarak antar huruf (> SX agar huruf tidak nyatu)
const SPACE_ADV = 76; // jarak antar kata

/** Susun path absolut "ARYA WIGUNA" dalam viewBox 660×120. */
const DRAW_PATHS: string[] = (() => {
  const paths: string[] = [];
  let x = X0;
  for (const ch of SPELLING) {
    if (ch === " ") {
      x += SPACE_ADV;
      continue;
    }
    const segs = LETTERS[ch];
    if (!segs) continue;
    for (const [[x1, y1], [x2, y2]] of segs) {
      paths.push(
        `M${(x + x1 * SX).toFixed(1)} ${(Y0 + y1 * SY).toFixed(1)}` +
          `L${(x + x2 * SX).toFixed(1)} ${(Y0 + y2 * SY).toFixed(1)}`
      );
    }
    x += ADV;
  }
  return paths;
})();

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
      // Ritme cepat: 36 garis selesai ±2.4s — sebelum boot fade-out (2.95s).
      gsap.fromTo(
        paths,
        { strokeDasharray: (i: number) => lens[i], strokeDashoffset: (i: number) => lens[i] },
        {
          strokeDashoffset: 0,
          duration: 0.4,
          stagger: 0.055,
          ease: "power2.inOut",
          delay: 0.1,
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
      viewBox="0 0 660 120"
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
