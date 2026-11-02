"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isReducedMotion } from "@/lib/gsap";

/**
 * Solar system 3D yang simpel & minimalis (Three.js).
 * - Matahari: bola kecil solid navy.
 * - Orbit: garis lingkaran tipis di bidang horizontal.
 * - Planet: bola-bola kecil (navy/biru) yang mengorbit pelan.
 * - Kamera miring sedikit + parallax pointer halus (tanpa kontrol rumit).
 * - Unik per kunjungan: jumlah planet, jarak orbit, ukuran, fase, laju.
 * - Hormati prefers-reduced-motion & pause saat tab tersembunyi.
 */
export default function HeroArt({ paused = false }: { paused?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
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
    let s = seed >>> 0;
    const rng = () => {
      s += 0x6d2b79f5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const NAVY = 0x172a45;
    const BLUE = 0x4778a9;

    // Scene + kamera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6.5);
    camera.lookAt(0, 0, 0);

    // Grup utama — dimiringkan untuk kedalaman 3D
    const group = new THREE.Group();
    group.rotation.x = 0.4;
    group.rotation.y = rng() * Math.PI * 2;
    scene.add(group);

    // Matahari — bola solid navy
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 28, 20),
      new THREE.MeshBasicMaterial({ color: NAVY })
    );
    group.add(sun);

    // Orbit + planet — unik per kunjungan
    const planetCount = 3 + Math.floor(rng() * 2); // 3–4 planet
    const planets: {
      mesh: THREE.Mesh;
      radius: number;
      speed: number;
      phase: number;
    }[] = [];

    for (let i = 0; i < planetCount; i++) {
      const radius = 1.0 + i * 0.5 + rng() * 0.15;
      const size = 0.09 + rng() * 0.07;
      const blue = i === planetCount - 1;

      // Orbit — lingkaran tipis di bidang XZ
      const pts: THREE.Vector3[] = [];
      const segs = 72;
      for (let k = 0; k < segs; k++) {
        const a = (k / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
      }
      const ring = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({
          color: blue ? BLUE : NAVY,
          transparent: true,
          opacity: blue ? 0.45 : 0.32,
        })
      );
      group.add(ring);

      // Planet — bola kecil
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(size, 20, 14),
        new THREE.MeshBasicMaterial({ color: blue ? BLUE : NAVY })
      );
      group.add(sphere);

      planets.push({
        mesh: sphere,
        radius,
        speed: (0.25 + rng() * 0.2) / Math.sqrt(radius),
        phase: rng() * Math.PI * 2,
      });
    }

    // Pointer parallax
    let mx = 0.5;
    let my = 0.5;
    let tx = 0.5;
    let ty = 0.5;
    const onPointer = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mx = (e.clientX - rect.left) / Math.max(rect.width, 1);
      my = (e.clientY - rect.top) / Math.max(rect.height, 1);
    };
    if (finePointer && !reduced) mount.addEventListener("pointermove", onPointer);

    // Resize
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

    const clock = new THREE.Clock();
    const baseYaw = group.rotation.y;

    const renderFrame = (t: number) => {
      for (const p of planets) {
        const a = p.phase + t * p.speed;
        p.mesh.position.set(Math.cos(a) * p.radius, 0, Math.sin(a) * p.radius);
      }
      tx += (mx - tx) * 0.05;
      ty += (my - ty) * 0.05;
      group.rotation.y = baseYaw + (tx - 0.5) * 1.2;
      group.rotation.x = 0.4 + (ty - 0.5) * 0.5;
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
      if (finePointer && !reduced) mount.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      obs.disconnect();
      ro.disconnect();
      group.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineLoop) {
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
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-40 rounded-full border border-border-line bg-surface" />
        </div>
      )}
    </div>
  );
}
