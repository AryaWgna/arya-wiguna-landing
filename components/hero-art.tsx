"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isReducedMotion } from "@/lib/gsap";

/* ──────────────────────────────────────────────
   Konfigurasi planet — teks bilingual + palet tekstur
   ────────────────────────────────────────────── */

type PlanetDef = {
  id: string;
  name: { en: string; id: string };
  tagline: { en: string; id: string };
  color: string;
  accent: string;
  clouds?: boolean;
  stripes?: boolean;
  size: number;
  orbit: number;
  speed: number;
  phase: number;
  tilt: number;
  rotSpeed: number;
  hasMoon?: boolean;
  ring?: boolean;
};

const PLANETS: PlanetDef[] = [
  {
    id: "mercury",
    name: { en: "Mercury", id: "Merkurius" },
    tagline: { en: "closest to the sun", id: "terdekat dengan matahari" },
    color: "#8a8f98",
    accent: "#5b616b",
    size: 0.13,
    orbit: 1.1,
    speed: 0.5,
    phase: 0.4,
    tilt: 0.03,
    rotSpeed: 0.35,
  },
  {
    id: "venus",
    name: { en: "Venus", id: "Venus" },
    tagline: { en: "the brightest point", id: "titik paling terang" },
    color: "#d8b78a",
    accent: "#b28a5c",
    size: 0.16,
    orbit: 1.4,
    speed: 0.36,
    phase: 1.9,
    tilt: 0.06,
    rotSpeed: 0.2,
  },
  {
    id: "earth",
    name: { en: "Earth", id: "Bumi" },
    tagline: { en: "our pale blue dot", id: "titik biru kecil kita" },
    color: "#2e5f8a",
    accent: "#4f7d4f",
    clouds: true,
    size: 0.17,
    orbit: 1.7,
    speed: 0.28,
    phase: 4.1,
    tilt: 0.41,
    rotSpeed: 0.5,
    hasMoon: true,
  },
  {
    id: "mars",
    name: { en: "Mars", id: "Mars" },
    tagline: { en: "the red planet", id: "planet merah" },
    color: "#b0563c",
    accent: "#7a3426",
    size: 0.14,
    orbit: 2.0,
    speed: 0.22,
    phase: 0.9,
    tilt: 0.15,
    rotSpeed: 0.42,
  },
  {
    id: "jupiter",
    name: { en: "Jupiter", id: "Jupiter" },
    tagline: { en: "the gas giant", id: "raksasa gas" },
    color: "#c9a77d",
    accent: "#8c5f3f",
    stripes: true,
    size: 0.34,
    orbit: 2.35,
    speed: 0.16,
    phase: 2.6,
    tilt: 0.05,
    rotSpeed: 0.6,
  },
  {
    id: "saturn",
    name: { en: "Saturn", id: "Saturnus" },
    tagline: { en: "ringed beauty", id: "mempesona bercincin" },
    color: "#d4b483",
    accent: "#a8814e",
    stripes: true,
    size: 0.3,
    orbit: 2.7,
    speed: 0.12,
    phase: 5.2,
    tilt: 0.47,
    rotSpeed: 0.5,
    ring: true,
  },
  {
    id: "uranus",
    name: { en: "Uranus", id: "Uranus" },
    tagline: { en: "the sideways planet", id: "planet yang miring" },
    color: "#9cc6cf",
    accent: "#6fa3b0",
    size: 0.26,
    orbit: 3.0,
    speed: 0.09,
    phase: 3.3,
    tilt: 1.65,
    rotSpeed: 0.3,
  },
  {
    id: "neptune",
    name: { en: "Neptune", id: "Neptunus" },
    tagline: { en: "the windy blue giant", id: "raksasa biru berangin" },
    color: "#4368a8",
    accent: "#2f4e80",
    size: 0.25,
    orbit: 3.3,
    speed: 0.075,
    phase: 0.6,
    tilt: 0.25,
    rotSpeed: 0.45,
  },
];

const SUN_LABEL = {
  name: { en: "The Sun", id: "Matahari" },
  tagline: { en: "the center of it all", id: "pusat segalanya" },
};

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

function makePlanetTexture(def: PlanetDef, seed: number): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d")!;
  const rng = makeRng(seed);

  const grad = g.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, def.color);
  grad.addColorStop(1, def.accent);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);

  if (def.stripes) {
    for (let i = 0; i < 12; i++) {
      const y = rng() * size;
      const hgt = 8 + rng() * 20;
      g.globalAlpha = 0.2 + rng() * 0.35;
      g.fillStyle = rng() > 0.5 ? def.accent : "#e9dcc4";
      g.fillRect(0, y, size, hgt);
    }
    g.globalAlpha = 1;
  } else {
    const n = 26 + Math.floor(rng() * 18);
    for (let i = 0; i < n; i++) {
      g.globalAlpha = 0.12 + rng() * 0.3;
      g.fillStyle = rng() > 0.5 ? def.accent : "#0f1b2a";
      const x = rng() * size;
      const y = rng() * size;
      const r = 6 + rng() * 22;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
  }

  if (def.clouds) {
    for (let i = 0; i < 7; i++) {
      g.globalAlpha = 0.14 + rng() * 0.18;
      g.strokeStyle = "#f2f4f7";
      g.lineWidth = 3 + rng() * 6;
      const x0 = rng() * size;
      const y0 = rng() * size;
      g.beginPath();
      g.moveTo(x0, y0);
      g.bezierCurveTo(
        x0 + (rng() - 0.5) * 120,
        y0 + (rng() - 0.5) * 120,
        x0 + 80 + (rng() - 0.5) * 120,
        y0 + (rng() - 0.5) * 120,
        x0 + 160,
        y0
      );
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,214,160,0.85)");
  grad.addColorStop(0.35, "rgba(255,190,120,0.28)");
  grad.addColorStop(1, "rgba(255,180,110,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeStars(seed: number): THREE.Points {
  const rng = makeRng(seed);
  const count = 650;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const navy = new THREE.Color(0x172a45);
  const blue = new THREE.Color(0x4778a9);
  for (let i = 0; i < count; i++) {
    const r = 10 + rng() * 12;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const col = rng() > 0.55 ? navy : blue;
    col.multiplyScalar(0.6 + rng() * 0.5);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

export default function HeroArt({ paused = false }: { paused?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (paused) return;
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = isReducedMotion();
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL tidak tersedia — biarkan placeholder
    }
    renderer.setClearColor(0x000000, 0);

    const seed = Math.floor(Math.random() * 1e9);
    const rng = makeRng(seed);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 1.8, 9);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    group.rotation.x = 0.38;
    group.rotation.y = rng() * Math.PI * 2;
    scene.add(group);

    // Matahari + glow
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0xf1b96a })
    );
    sun.userData.planetId = "sun";
    group.add(sun);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeGlowTexture(),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.55,
      })
    );
    glow.scale.set(3, 3, 1);
    group.add(glow);

    // Bintang latar
    scene.add(makeStars(seed ^ 0x9e3779b9));

    // Planet + orbit + bulan
    const bodies: { mesh: THREE.Mesh; def: PlanetDef }[] = [];
    const hitMeshes: THREE.Object3D[] = [sun];
    const moons: { mesh: THREE.Mesh; orbit: number; speed: number; phase: number }[] = [];

    for (const def of PLANETS) {
      const tex = makePlanetTexture(def, seed + def.id.length * 97);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(def.size, 48, 32),
        new THREE.MeshBasicMaterial({ map: tex })
      );
      mesh.rotation.z = def.tilt;
      mesh.userData.planetId = def.id;
      group.add(mesh);
      bodies.push({ mesh, def });
      hitMeshes.push(mesh);

      if (def.ring) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(def.size * 1.35, def.size * 2.15, 72),
          new THREE.MeshBasicMaterial({
            color: 0xcbb087,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.55,
          })
        );
        ring.rotation.x = Math.PI / 2;
        mesh.add(ring);
      }

      if (def.hasMoon) {
        const moon = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 20, 16),
          new THREE.MeshBasicMaterial({ color: 0x8d99a6 })
        );
        group.add(moon);
        moons.push({
          mesh: moon,
          orbit: def.orbit + 0.26,
          speed: 1.4,
          phase: rng() * Math.PI * 2,
        });
      }

      const pts: THREE.Vector3[] = [];
      for (let k = 0; k < 96; k++) {
        const a = (k / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * def.orbit, 0, Math.sin(a) * def.orbit));
      }
      const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x172a45, transparent: true, opacity: 0.18 })
      );
      group.add(line);
    }

    /* ── Hover label ──────────────────────────────── */
    type HoverLabel = {
      name: { en: string; id: string };
      tagline: { en: string; id: string };
    };
    type HoverState = { label: HoverLabel; target: THREE.Object3D };

    const labelEl = labelRef.current;
    const lang = () => (document.documentElement.lang === "id" ? "id" : "en");

    const updateLabel = (label: HoverLabel | null, sx = 0, sy = 0) => {
      if (!labelEl) return;
      if (!label) {
        labelEl.style.opacity = "0";
        return;
      }
      const nameEl = labelEl.querySelector("[data-label-name]") as HTMLElement | null;
      const tagEl = labelEl.querySelector("[data-label-tagline]") as HTMLElement | null;
      if (nameEl) nameEl.textContent = label.name[lang()];
      if (tagEl) tagEl.textContent = label.tagline[lang()];
      labelEl.style.opacity = "1";
      labelEl.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) translate(-50%, -115%)`;
    };

    const projectLabel = (h: HoverState) => {
      const v = new THREE.Vector3();
      h.target.getWorldPosition(v);
      const proj = v.project(camera);
      updateLabel(
        h.label,
        (proj.x * 0.5 + 0.5) * mount.clientWidth,
        (-proj.y * 0.5 + 0.5) * mount.clientHeight
      );
    };

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(10, 10); // di luar [-1,1] → "tidak ada hover"
    let hovered: HoverState | null = null;
    let lastHoverKey = "";

    const raycastHover = () => {
      if (pointerNdc.x === 10 && pointerNdc.y === 10) return;
      raycaster.setFromCamera(pointerNdc, camera);
      const hit = raycaster.intersectObjects(hitMeshes, false)[0] ?? null;
      const key = hit ? (hit.object.userData.planetId as string) : "";
      if (key && key !== lastHoverKey) {
        lastHoverKey = key;
        const label: HoverLabel = hit!.object === sun ? SUN_LABEL : PLANETS.find((p) => p.id === key)!;
        hovered = { label, target: hit!.object };
        projectLabel(hovered);
        mount.style.cursor = "pointer";
      } else if (!key && lastHoverKey) {
        lastHoverKey = "";
        hovered = null;
        updateLabel(null);
        mount.style.cursor = "default";
      } else if (hovered) {
        projectLabel(hovered);
      }
    };

    /* ── Pointer (parallax + hover) ────────────────── */
    let mx = 0.5;
    let my = 0.5;
    let tx = 0.5;
    let ty = 0.5;

    const onPointer = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mx = (e.clientX - rect.left) / Math.max(rect.width, 1);
      my = (e.clientY - rect.top) / Math.max(rect.height, 1);
      pointerNdc.set(
        ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1,
        -((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1
      );
      if (reduced) raycastHover();
    };

    const onPointerLeave = () => {
      mx = 0.5;
      my = 0.5;
      pointerNdc.set(10, 10);
      lastHoverKey = "";
      hovered = null;
      updateLabel(null);
      mount.style.cursor = "default";
    };

    if (finePointer) {
      mount.addEventListener("pointermove", onPointer);
      mount.addEventListener("pointerleave", onPointerLeave);
    }

    /* ── Resize ─────────────────────────────────────── */
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer!.setPixelRatio(dpr);
      renderer!.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    /* ── Render per frame ────────────────────────────── */
    const baseYaw = group.rotation.y;
    const clock = new THREE.Clock();

    const renderFrame = (t: number) => {
      for (const b of bodies) {
        const a = b.def.phase + t * b.def.speed;
        b.mesh.position.set(Math.cos(a) * b.def.orbit, 0, Math.sin(a) * b.def.orbit);
        b.mesh.rotation.y = t * b.def.rotSpeed;
      }
      for (const m of moons) {
        const a = m.phase + t * m.speed;
        m.mesh.position.set(Math.cos(a) * m.orbit, 0, Math.sin(a) * m.orbit);
      }

      tx += (mx - tx) * 0.05;
      ty += (my - ty) * 0.05;
      group.rotation.y = baseYaw + t * 0.06 + (tx - 0.5) * 1.1;
      group.rotation.x = 0.38 + (ty - 0.5) * 0.45;

      raycastHover();
      renderer!.render(scene, camera);
    };

    let raf = 0;
    let inView = true;

    const startLoop = () => {
      if (raf) return;
      const tick = () => {
        renderFrame(clock.getElapsedTime());
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

    if (reduced) {
      renderFrame(0); // satu frame statis
    } else {
      startLoop();
    }

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
      if (reduced) renderFrame(0);
    });
    ro.observe(mount);

    setReady(true);

    return () => {
      stopLoop();
      if (finePointer) {
        mount.removeEventListener("pointermove", onPointer);
        mount.removeEventListener("pointerleave", onPointerLeave);
      }
      document.removeEventListener("visibilitychange", onVis);
      obs.disconnect();
      ro.disconnect();
      group.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineLoop || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          const mat = obj.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
      scene.clear();
      renderer?.dispose();
      if (renderer?.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [paused]);

  return (
    <div className="relative aspect-square w-full max-w-[420px]" aria-hidden="true">
      <div ref={mountRef} className="absolute inset-0" />
      <div
        ref={labelRef}
        className="pointer-events-none absolute left-0 top-0 z-10 opacity-0 transition-opacity duration-200"
        style={{ transform: "translate(-50%, -115%)" }}
      >
        <div className="rounded-lg border border-border-line bg-background/95 px-3 py-2 text-center shadow-lg backdrop-blur-sm">
          <div data-label-name className="font-mono text-xs font-bold text-foreground" />
          <div data-label-tagline className="mt-0.5 whitespace-nowrap font-mono text-[10px] text-muted" />
        </div>
      </div>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-40 rounded-full border border-border-line bg-surface" />
        </div>
      )}
    </div>
  );
}



