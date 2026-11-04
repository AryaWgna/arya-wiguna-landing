"use client";

import { useEffect, useRef } from "react";
import { isReducedMotion } from "@/lib/gsap";
import { useWebAudioGlitch } from "@/lib/use-web-audio-glitch";

export type DeviceFrame = "phone" | "laptop";

export type FanOutDevice = {
  src: string;
  frame: DeviceFrame;
  alt?: string;
};

export type FanOutDevices = {
  left: FanOutDevice;
  center: FanOutDevice;
  right: FanOutDevice;
};

function DeviceShell({
  device,
  widthClass,
  className,
  shellRef,
}: {
  device: FanOutDevice;
  widthClass: string;
  className?: string;
  shellRef?: React.Ref<HTMLDivElement>;
}) {
  const isPhone = device.frame === "phone";
  return (
    <div
      ref={shellRef}
      className={`overflow-hidden bg-foreground/95 shadow-2xl ${
        isPhone
          ? "rounded-[1.25rem] border-4 border-foreground/80 ring-1 ring-white/10"
          : "rounded-xl border-4 border-foreground/90 ring-1 ring-white/10"
      } ${widthClass} ${className ?? ""} transition-shadow duration-300 will-change-transform`}
    >
      <div className="relative h-full w-full overflow-hidden bg-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/${device.src.replace(/^\//, "")}`}
          alt={device.alt ?? ""}
          loading="lazy"
          className={`h-full w-full object-cover select-none ${
            isPhone ? "object-top" : "object-center"
          }`}
        />
        {/* Glass reflection gradient sheen */}
        <div
          data-sheen
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/12 to-white/0 opacity-70 transition-opacity duration-300"
        />
      </div>
    </div>
  );
}

/**
 * Pattern 3 — 3D Dynamic Cursor Tilt Fan-Out ("Mekar") Mockup.
 * Menggunakan spatial perspective, translateZ layer separation,
 * dan lerp damping mengikuti kursor mouse (60-120 FPS).
 */
export function DeviceFanOutMockup({ devices }: { devices: FanOutDevices }) {
  const { left, center, right } = devices;
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const { playGlitch } = useWebAudioGlitch();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let isHovering = false;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const onPointerEnter = () => {
      isHovering = true;
      playGlitch("hover");
      if (!raf) loop();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const onPointerLeave = () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
    };

    const loop = () => {
      // Lerp smoothing (damping factor 0.08)
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;

      const leftEl = leftRef.current;
      const centerEl = centerRef.current;
      const rightEl = rightRef.current;

      if (leftEl) {
        // Left device: fan-out left with negative Z plane
        const rotY = -8 + curX * 14;
        const rotX = -curY * 10;
        const transX = 12 + curX * -14;
        const transY = 8 + curY * 8;
        leftEl.style.transform = `translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, -15px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
      }

      if (centerEl) {
        // Center device: elevated hero on positive Z plane
        const rotY = curX * 12;
        const rotX = -curY * 8;
        const scale = isHovering ? 1.04 : 1.0;
        centerEl.style.transform = `translate3d(0px, 0px, 30px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale(${scale})`;
      }

      if (rightEl) {
        // Right device: fan-out right with negative Z plane
        const rotY = 8 + curX * 14;
        const rotX = -curY * 10;
        const transX = -12 + curX * -14;
        const transY = 8 + curY * 8;
        rightEl.style.transform = `translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, -15px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
      }

      // Stop loop when settled at rest (zero CPU when idle)
      const isResting =
        !isHovering && Math.abs(curX) < 0.001 && Math.abs(curY) < 0.001;

      if (!isResting) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const leftElCapture = leftRef.current;
    const centerElCapture = centerRef.current;
    const rightElCapture = rightRef.current;

    el.addEventListener("pointerenter", onPointerEnter);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onPointerEnter);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);

      if (leftElCapture) leftElCapture.style.transform = "";
      if (centerElCapture) centerElCapture.style.transform = "";
      if (rightElCapture) rightElCapture.style.transform = "";
    };
  }, [playGlitch]);

  return (
    <div
      ref={containerRef}
      className="group relative flex items-center justify-center gap-2 overflow-hidden bg-surface/80 px-4 py-6 [perspective:1100px] [transform-style:preserve-3d] sm:gap-3 cursor-pointer select-none"
    >
      {/* Left Device */}
      <DeviceShell
        shellRef={leftRef}
        device={left}
        widthClass={
          left.frame === "phone"
            ? "hidden w-24 aspect-[9/19] sm:block md:w-28 opacity-90"
            : "hidden w-32 aspect-[16/10] sm:block md:w-40 opacity-90"
        }
        className="[transform:translate3d(12px,8px,-15px)_rotateY(-8deg)]"
      />

      {/* Center Hero Device */}
      <DeviceShell
        shellRef={centerRef}
        device={center}
        widthClass={
          center.frame === "phone"
            ? "relative z-10 w-36 aspect-[9/19] md:w-44"
            : "relative z-10 w-48 aspect-[16/10] md:w-64"
        }
        className="[transform:translate3d(0,0,30px)]"
      />

      {/* Right Device */}
      <DeviceShell
        shellRef={rightRef}
        device={right}
        widthClass={
          right.frame === "phone"
            ? "hidden w-24 aspect-[9/19] sm:block md:w-28 opacity-90"
            : "hidden w-32 aspect-[16/10] sm:block md:w-40 opacity-90"
        }
        className="[transform:translate3d(-12px,8px,-15px)_rotateY(8deg)]"
      />

      {/* Ambient Depth Glow */}
      <div className="pointer-events-none absolute -bottom-4 h-12 w-3/4 rounded-full bg-blue/10 blur-xl transition-opacity duration-500 group-hover:opacity-100 opacity-40" />
    </div>
  );
}
