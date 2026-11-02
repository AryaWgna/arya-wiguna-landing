"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

type Seg = [[number, number], [number, number]];

/**
 * Alfabet monoline (unit 0–1, y mengarah ke bawah) — kerangka huruf blok.
 * Di atasnya dibangun "tangan": goresan Q melengkung, overshoot,
 * jitter acak per kunjungan, tekanan garis bervariasi.
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
const X0 = 54; // margin kiri agar komposisi di tengah
const Y0 = 6; // margin atas
const ADV = 57; // jarak antar huruf (> SX agar huruf tidak nyatu)
const SPACE_ADV = 80; // jarak antar kata

type Stroke = { d: string; w: number; c: string };

let seedCounter = 0;

/** PRNG kecil ber-seed — deterministik per kunjungan, unik antar kunjungan. */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Susun goresan tangan "ARYA WIGUNA" dalam viewBox 700×120.
 * Setiap segmen jadi kurva Q dengan offset tegak-lurus acak + overshoot
 * kecil; tiap huruf dapat drift vertikal halus; urutan goresan diacak
 * (seperti tangan yang tidak pernah menggambar dua kali sama persis).
 */
function buildHandStrokes(): Stroke[] {
  const rng = makeRng((seedCounter++ * 7919 + Date.now()) >>> 0);
  const strokes: Stroke[] = [];
  let x = X0;
  let letterIdx = 0;

  const addSeg = (x1: number, y1: number, x2: number, y2: number, w: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    // overshoot ~3–6% agar ujung goresan "melewati" seperti tangan cepat
    const ov = 1 + 0.03 + rng() * 0.03;
    const sx = x1 - (dx / len) * (ov - 1) * len * 0.5;
    const sy = y1 - (dy / len) * (ov - 1) * len * 0.5;
    const ex = x2 + (dx / len) * (ov - 1) * len * 0.5;
    const ey = y2 + (dy / len) * (ov - 1) * len * 0.5;
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;
    const jitter = (rng() - 0.5) * 5.2;
    const nx = -dy / len;
    const ny = dx / len;
    const cx = mx + nx * jitter;
    const cy = my + ny * jitter;
    strokes.push({
      d: `M${sx.toFixed(1)} ${sy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      w,
      c: "var(--navy)",
    });
  };

  for (const ch of SPELLING) {
    if (ch === " ") {
      x += SPACE_ADV;
      letterIdx += 0.5;
      continue;
    }
    const segs = LETTERS[ch];
    if (!segs) continue;
    // drift vertikal halus per huruf — seperti tangan tidak lurus sempurna
    const yDrift = Math.sin(letterIdx * 1.7) * 2.4;
    for (const [[x1, y1], [x2, y2]] of segs) {
      addSeg(
        x + x1 * SX,
        Y0 + y1 * SY + yDrift,
        x + x2 * SX,
        Y0 + y2 * SY + yDrift,
        1.5 + rng() * 0.7
      );
    }
    x += ADV;
    letterIdx++;
  }

  // Akhiran: goresan bawah seperti garis bawah tangan + 2 titik tinta
  const baseY = 104 + (rng() - 0.5) * 4;
  strokes.push({
    d: `M40 ${baseY.toFixed(1)} Q${(350 + (rng() - 0.5) * 16).toFixed(1)} ${(baseY - 5 - rng() * 6).toFixed(1)} 660 ${baseY.toFixed(1)}`,
    w: 1.2,
    c: "var(--blue)",
  });
  for (let i = 0; i < 2; i++) {
    const dx = 640 + rng() * 24;
    const dy = baseY + 2 + rng() * 5;
    strokes.push({
      d: `M${dx.toFixed(1)} ${dy.toFixed(1)} l0.001 0.001`,
      w: 2.4 + rng() * 1.6,
      c: "var(--blue)",
    });
  }

  // Acak urutan goresan utama (tetap sisakan akhiran di akhir)
  const main = strokes.slice(0, strokes.length - 3);
  for (let i = main.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [main[i], main[j]] = [main[j], main[i]];
  }
  return [...main, ...strokes.slice(-3)];
}

export function BootSketch() {
  const svgRef = useRef<SVGSVGElement>(null);
  const strokes = useMemo(buildHandStrokes, []);

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
          duration: 0.42,
          stagger: 0.05,
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
      viewBox="0 0 700 120"
      className="h-full w-full"
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transformOrigin: "50% 50%" }}
    >
      <defs>
        <filter id="boot-grain" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.3 0 0 0 0 0.35 0 0 0 0 0.4 0 0 0 0.05 0" />
        </filter>
      </defs>
      <rect x="0" y="0" width="700" height="120" filter="url(#boot-grain)" opacity="0.5" />
      {strokes.map((s, i) => (
        <path key={i} d={s.d} stroke={s.c} strokeWidth={s.w} />
      ))}
    </svg>
  );
}
