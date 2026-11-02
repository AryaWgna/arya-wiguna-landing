"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { isReducedMotion } from "@/lib/gsap";

/**
 * Boot — "ARYA WIGUNA" 3D besar, huruf muncul satu per satu.
 * - Ekstrusi dengan bevel, dua lapis (navy depan, biru tipis belakang).
 * - Setiap huruf muncul berurutan: naik dari bawah sambil berputar masuk
 *   (spinning-in) lalu tenang; setelah lengkap, keseluruhan sedikit bergoyang.
 * - Tanpa teks lain.
 */

const TEXT = "ARYA WIGUNA";
const LETTER_DELAY = 0.16;
const LETTER_DURATION = 0.7;
const GAP = 0.22;
const SPACE_ADV = 0.62;

export function BootSketch() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = isReducedMotion();

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x4778a9, 1.1);
    rim.position.set(-4, -2, 3);
    scene.add(rim);

    const lettersRoot = new THREE.Group();
    scene.add(lettersRoot);

    let disposed = false;
    let raf = 0;
    let cleanupRef: (() => void) | null = null;

    type Letter = {
      group: THREE.Group;
      front: THREE.MeshStandardMaterial;
      back: THREE.MeshStandardMaterial;
    };
    const letters: Letter[] = [];

    const loader = new FontLoader();
    loader.load("/assets/fonts/helvetiker_bold.typeface.json", (font) => {
      if (disposed || !renderer) return;

      const makeMat = (color: number, opacity: number) =>
        new THREE.MeshStandardMaterial({
          color,
          metalness: 0.15,
          roughness: 0.35,
          transparent: true,
          opacity,
        });

      let cursor = 0;
      for (const ch of TEXT) {
        if (ch === " ") {
          cursor += SPACE_ADV;
          continue;
        }
        const geo = new TextGeometry(ch, {
          font,
          size: 1,
          depth: 0.28,
          curveSegments: 8,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelSegments: 3,
        });
        geo.computeBoundingBox();
        const b = geo.boundingBox!;
        const w = b.max.x - b.min.x;
        geo.translate(
          -(b.max.x + b.min.x) / 2,
          -(b.max.y + b.min.y) / 2,
          -(b.max.z + b.min.z) / 2
        );

        const front = makeMat(0x172a45, 0);
        const back = makeMat(0x4778a9, 0);
        const g = new THREE.Group();
        const frontMesh = new THREE.Mesh(geo, front);
        const backMesh = new THREE.Mesh(geo.clone(), back);
        backMesh.position.z = -0.24;
        g.add(frontMesh, backMesh);
        g.position.x = cursor + w / 2;
        cursor += w + GAP;
        letters.push({ group: g, front, back });
        lettersRoot.add(g);
      }

      if (letters.length > 0) {
        const mid = (cursor - GAP) / 2;
        for (const l of letters) l.group.position.x -= mid;
      }

      const fit = () => {
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        const box = new THREE.Box3().setFromObject(lettersRoot);
        const size = new THREE.Vector3();
        box.getSize(size);
        const target = w * 0.92;
        lettersRoot.scale.setScalar(size.x > 0 ? Math.min(target / size.x, 3) : 1);
        renderer!.setSize(w, h, false);
        renderer!.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
      };
      fit();

      mount.appendChild(renderer.domElement);
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";

      const renderFrame = (t: number) => {
        letters.forEach((l, i) => {
          const start = i * LETTER_DELAY;
          const k = Math.min(Math.max((t - start) / LETTER_DURATION, 0), 1);
          const e = k * k * (3 - 2 * k); // smoothstep
          l.group.position.y = -1.8 * (1 - e);
          l.group.rotation.y = (1 - e) * 1.4;
          l.group.scale.setScalar(0.55 + 0.45 * e);
          l.front.opacity = e;
          l.back.opacity = 0.5 * e;
        });
        const idle = Math.max(0, t - (letters.length - 1) * LETTER_DELAY - LETTER_DURATION);
        lettersRoot.rotation.y = Math.sin(idle * 0.3) * 0.08;
        renderer!.render(scene, camera);
      };

      const clock = new THREE.Clock();
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
        renderFrame(10);
      } else {
        startLoop();
      }

      const ro = new ResizeObserver(() => {
        fit();
        if (reduced) renderFrame(10);
      });
      ro.observe(mount);

      const onVis = () => {
        if (reduced) return;
        if (document.hidden) stopLoop();
        else if (!raf) startLoop();
      };
      document.addEventListener("visibilitychange", onVis);

      cleanupRef = () => {
        disposed = true;
        stopLoop();
        document.removeEventListener("visibilitychange", onVis);
        ro.disconnect();
        lettersRoot.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
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
    });

    return () => {
      disposed = true;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      cleanupRef?.();
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}

