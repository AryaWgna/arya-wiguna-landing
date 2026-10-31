"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Aksen 3D subtle untuk hero (opsional).
 * - Dimuat hanya di client (dynamic import ssr:false).
 * - Fallback: komposisi CSS statis di bawah canvas.
 * - Menghormati prefers-reduced-motion; berhenti saat tab/elemen tak terlihat.
 * - DPR dibatasi 1.5.
 */
export default function Hero3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Deteksi WebGL
    try {
      const test = document.createElement("canvas");
      const gl = test.getContext("webgl") || test.getContext("experimental-webgl");
      if (!gl) {
        setWebgl(false);
        return;
      }
    } catch {
      setWebgl(false);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.4, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Cahaya
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(3, 4, 5);
    scene.add(dir);
    const rim = new THREE.PointLight(0x4778a9, 0.8, 20);
    rim.position.set(-3, -2, 3);
    scene.add(rim);

    // Objek: skulptur geometris navy
    const group = new THREE.Group();

    const icosa = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.7, 1),
      new THREE.MeshStandardMaterial({
        color: 0x172a45,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      })
    );
    group.add(icosa);

    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.85, 0),
      new THREE.MeshStandardMaterial({
        color: 0x4778a9,
        metalness: 0.85,
        roughness: 0.25,
      })
    );
    group.add(core);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.35, 0.03, 16, 96),
      new THREE.MeshStandardMaterial({ color: 0x4778a9, metalness: 0.6, roughness: 0.35 })
    );
    ring.rotation.x = Math.PI / 2.4;
    ring.rotation.z = 0.4;
    group.add(ring);

    scene.add(group);

    const animate = () => {
      if (!reducedMotion) {
        group.rotation.y += 0.004;
        ring.rotation.z += 0.0015;
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
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative aspect-square w-full max-w-[420px]" aria-hidden="true">
      {/* Fallback statis (terlihat jika WebGL gagal / sebelum load) */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-line bg-surface" />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-xl bg-blue-soft" />
        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-lg bg-navy" />
      </div>
      {webgl ? <div ref={mountRef} className="absolute inset-0" /> : null}
    </div>
  );
}
