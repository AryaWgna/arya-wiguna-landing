"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { isReducedMotion } from "@/lib/gsap";

/**
 * Boot — inisial "AW" 3D besar di tengah (Three.js TextGeometry).
 * - Ekstrusi dengan bevel, dua lapis (navy depan, biru tipis di belakang)
 *   untuk kedalaman yang enak dilihat.
 * - Animasi 3D halus: ayunan miring pelan + float naik-turun.
 * - Tanpa kata lain, tanpa teks, hanya huruf.
 */
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

    const group = new THREE.Group();
    scene.add(group);

    let textGroup: THREE.Group | null = null;
    let disposed = false;
    let raf = 0;
    const lastT = 0;

    const fit = () => {
      if (!textGroup || !renderer) return;
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      const box = new THREE.Box3().setFromObject(textGroup);
      const size = new THREE.Vector3();
      box.getSize(size);
      const target = w * 0.78;
      textGroup.scale.setScalar(size.x > 0 ? Math.min(target / size.x, 3) : 1);
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };

    const renderFrame = (t: number) => {
      if (!textGroup || !renderer) return;
      textGroup.rotation.y = Math.sin(t * 0.35) * 0.55;
      textGroup.rotation.z = Math.sin(t * 0.22) * 0.08;
      textGroup.position.y = Math.sin(t * 0.6) * 0.12;
      renderer.render(scene, camera);
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

    const loader = new FontLoader();
    loader.load("/assets/fonts/helvetiker_bold.typeface.json", (font) => {
      if (disposed || !renderer) return;

      const geo = new TextGeometry("AW", {
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
      const box = geo.boundingBox!;
      geo.translate(
        -(box.max.x + box.min.x) / 2,
        -(box.max.y + box.min.y) / 2,
        -(box.max.z + box.min.z) / 2
      );

      const front = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: 0x172a45, metalness: 0.15, roughness: 0.35 })
      );
      const back = new THREE.Mesh(
        geo.clone(),
        new THREE.MeshStandardMaterial({
          color: 0x4778a9,
          metalness: 0.2,
          roughness: 0.4,
          transparent: true,
          opacity: 0.5,
        })
      );
      back.position.z = -0.24;

      textGroup = new THREE.Group();
      textGroup.add(front, back);
      group.add(textGroup);
      fit();

      mount.appendChild(renderer.domElement);
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";

      if (reduced) {
        renderFrame(0);
      } else {
        startLoop();
      }
    });

    const ro = new ResizeObserver(() => {
      fit();
      if (reduced && textGroup) renderFrame(lastT);
    });
    ro.observe(mount);

    const onVis = () => {
      if (reduced) return;
      if (document.hidden) stopLoop();
      else {
        if (!raf && textGroup) startLoop();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      disposed = true;
      stopLoop();
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      group.traverse((obj) => {
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
  }, []);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}
