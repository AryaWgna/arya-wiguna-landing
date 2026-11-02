"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

/**
 * Aksen 3D subtle untuk hero — skulptur minimal anti AI-slop.
 * - Satu inti poligon matte navy + garis tepi biru + satu cincin tipis.
 * - Rotasi sangat lambat, tanpa partikel/wireframe sphere/float acak.
 * - Dimuat hanya di client (dynamic import ssr:false).
 * - Fallback: komposisi CSS statis (hanya saat WebGL gagal).
 * - Menghormati prefers-reduced-motion; berhenti saat tab/elemen tak terlihat.
 * - DPR dibatasi 1.5.
 */
export default function Hero3D({ paused = false }: { paused?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => {
    // Saat paused (mis. boot sequence aktif), jangan buat scene/context WebGL dulu.
    if (paused) return;
    const mount = mountRef.current;
    if (!mount) return;

    // Deteksi WebGL
    try {
      const test = document.createElement("canvas");
      const gl = test.getContext("webgl") || test.getContext("experimental-webgl");
      if (!gl) {
        setWebglOk(false);
        return;
      }
    } catch {
      setWebglOk(false);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.4, 5.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    setWebglOk(true);

    // Cahaya — kunci utama + rim light biru lembut
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.15);
    dir.position.set(4, 3, 4);
    scene.add(dir);
    const rim = new THREE.PointLight(0x4778a9, 1.0, 20);
    rim.position.set(-3, -1, 3);
    scene.add(rim);

    // Skulptur minimal: satu inti poligon datar + garis tepi + satu cincin tipis
    const group = new THREE.Group();

    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.35, 0),
      new THREE.MeshStandardMaterial({
        color: 0x172a45,
        flatShading: true,
        metalness: 0.2,
        roughness: 0.35,
      })
    );
    core.scale.set(1, 1.25, 1);
    group.add(core);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.35, 0)),
      new THREE.LineBasicMaterial({ color: 0x4778a9, transparent: true, opacity: 0.5 })
    );
    edges.scale.set(1, 1.25, 1);
    group.add(edges);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.95, 0.012, 8, 72),
      new THREE.MeshStandardMaterial({
        color: 0x9fb6d6,
        transparent: true,
        opacity: 0.45,
        metalness: 0.1,
        roughness: 0.5,
      })
    );
    ring.rotation.x = Math.PI / 2.3;
    ring.rotation.z = 0.45;
    group.add(ring);

    // Pointer parallax (GSAP quickTo) — gerakan sangat halus
    const tiltGroup = new THREE.Group();
    tiltGroup.add(group);
    scene.add(tiltGroup);

    let qX: gsap.QuickToFunc | null = null;
    let qY: gsap.QuickToFunc | null = null;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (finePointer && !reducedMotion) {
      qX = gsap.quickTo(tiltGroup.rotation, "y", {
        duration: 0.8,
        ease: "power3.out",
      });
      qY = gsap.quickTo(tiltGroup.rotation, "x", {
        duration: 0.8,
        ease: "power3.out",
      });
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!qX || !qY) return;
      const rect = mount.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
      qX(nx * 0.22);
      qY(ny * 0.16);
    };
    const onPointerLeave = () => {
      qX?.(0);
      qY?.(0);
    };

    if (finePointer && !reducedMotion) {
      mount.addEventListener("pointermove", onPointerMove);
      mount.addEventListener("pointerleave", onPointerLeave);
    }

    const animate = () => {
      if (!reducedMotion) {
        const t = performance.now() / 1000;
        // Rotasi sangat lambat & tenang — bukan animasi frekuensi tinggi
        group.rotation.y += 0.0025;
        group.position.y = Math.sin(t * 0.6) * 0.06;
        ring.rotation.z = 0.45 + Math.sin(t * 0.25) * 0.025;
      }
      renderer.render(scene, camera);
    };

    const renderLoop = () => {
      animate();
      raf = requestAnimationFrame(renderLoop);
    };
    let raf = requestAnimationFrame(renderLoop);

    // Pause saat tab tersembunyi
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(renderLoop);
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Pause saat offscreen
    let inView = true;
    const observer = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      cancelAnimationFrame(raf);
      if (inView && !document.hidden) raf = requestAnimationFrame(renderLoop);
    });
    observer.observe(mount);

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);
    onResize();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerleave", onPointerLeave);
      if (qX || qY) gsap.killTweensOf(tiltGroup.rotation);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [paused]);

  return (
    <div className="relative aspect-square w-full max-w-[420px]" aria-hidden="true">
      {/* Fallback statis — hanya tampil saat WebGL belum/tidak tersedia,
          TIDAK ditumpuk di belakang canvas (mencegah visual dobel saat boot). */}
      {webglOk !== true && (
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-line bg-surface" />
          <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-xl bg-blue-soft" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-lg bg-navy" />
        </div>
      )}
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
