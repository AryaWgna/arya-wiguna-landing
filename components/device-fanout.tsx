"use client";

import { useEffect, useRef } from "react";
import { isReducedMotion } from "@/lib/gsap";
import { useWebAudioGlitch } from "@/lib/use-web-audio-glitch";
import type { FanOutDevices, FanOutDevice } from "@/lib/data/projects";

export type { FanOutDevices, FanOutDevice };

/* ── Phone Shell (For Mobile Apps like SIMARU) ────────────────── */
function PhoneShell({
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
  return (
    <div
      ref={shellRef}
      className={`overflow-hidden bg-foreground/95 shadow-2xl rounded-[1.25rem] border-4 border-foreground/80 ring-1 ring-white/10 ${widthClass} ${className ?? ""} transition-shadow duration-300 will-change-transform`}
    >
      <div className="relative h-full w-full overflow-hidden bg-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/${device.src.replace(/^\//, "")}`}
          alt={device.alt ?? ""}
          loading="lazy"
          className="h-full w-full object-cover object-top select-none"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/12 to-white/0 opacity-70" />
      </div>
    </div>
  );
}

/* ── Browser Window Shell (For Desktop & Web Apps like Skyboard & Streamely) ── */
function BrowserWindowShell({
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
  return (
    <div
      ref={shellRef}
      className={`overflow-hidden rounded-xl border border-border-line/90 bg-background shadow-2xl ring-1 ring-white/10 ${widthClass} ${className ?? ""} transition-shadow duration-300 will-change-transform`}
    >
      {/* Titlebar with Traffic Light Dots */}
      <div className="flex h-5 items-center gap-1.5 border-b border-border-line/70 bg-surface/90 px-3">
        <span className="h-2 w-2 rounded-full bg-red-400/80" />
        <span className="h-2 w-2 rounded-full bg-amber-400/80" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
        <span className="ml-2 font-mono text-[9px] text-muted truncate opacity-70">
          {device.alt ?? "https://web-application"}
        </span>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/${device.src.replace(/^\//, "")}`}
          alt={device.alt ?? ""}
          loading="lazy"
          className="h-full w-full object-cover object-center select-none"
        />
        {/* Subtle glass reflection sheen */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/8 to-white/0 opacity-60" />
      </div>
    </div>
  );
}

/**
 * Responsive 3D Device Showcase Mockup.
 * - Mobile layout (SIMARU): 3 phones fan-out.
 * - Desktop layout (Skyboard & Streamely): Overlapping 16:9 cascading browser windows.
 */
export function DeviceFanOutMockup({ devices }: { devices: FanOutDevices }) {
  const isDesktop = devices.layout === "desktop" || (!devices.left && !devices.right && !!devices.secondary);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
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
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;

      if (isDesktop) {
        // Desktop Dual-Window Cascade
        const secEl = secondaryRef.current;
        const mainEl = centerRef.current;

        if (secEl) {
          const transX = -22 + curX * -16;
          const transY = -12 + curY * 8;
          const rotY = -4 + curX * 10;
          const rotX = -curY * 8;
          secEl.style.transform = `translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, -18px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
        }

        if (mainEl) {
          const transX = 18 + curX * -10;
          const transY = 12 + curY * 8;
          const rotY = 3 + curX * 12;
          const rotX = -curY * 8;
          const scale = isHovering ? 1.02 : 1.0;
          mainEl.style.transform = `translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, 28px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale(${scale})`;
        }
      } else {
        // Mobile 3-Phone Fan-Out
        const leftEl = leftRef.current;
        const centerEl = centerRef.current;
        const rightEl = rightRef.current;

        if (leftEl) {
          const rotY = -8 + curX * 14;
          const rotX = -curY * 10;
          const transX = 12 + curX * -14;
          const transY = 8 + curY * 8;
          leftEl.style.transform = `translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, -15px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
        }

        if (centerEl) {
          const rotY = curX * 12;
          const rotX = -curY * 8;
          const scale = isHovering ? 1.04 : 1.0;
          centerEl.style.transform = `translate3d(0px, 0px, 30px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale(${scale})`;
        }

        if (rightEl) {
          const rotY = 8 + curX * 14;
          const rotX = -curY * 10;
          const transX = -12 + curX * -14;
          const transY = 8 + curY * 8;
          rightEl.style.transform = `translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, -15px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
        }
      }

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
    const secElCapture = secondaryRef.current;

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
      if (secElCapture) secElCapture.style.transform = "";
    };
  }, [isDesktop, playGlitch]);

  if (isDesktop && devices.secondary) {
    return (
      <div
        ref={containerRef}
        className="group relative flex items-center justify-center overflow-hidden bg-surface/80 px-4 py-8 [perspective:1200px] [transform-style:preserve-3d] cursor-pointer select-none min-h-[220px] sm:min-h-[250px]"
      >
        {/* Back Secondary Window (Admin / Player) */}
        <BrowserWindowShell
          shellRef={secondaryRef}
          device={devices.secondary}
          widthClass="w-[78%] sm:w-[74%] md:w-[76%] opacity-85 group-hover:opacity-100"
          className="[transform:translate3d(-22px,-12px,-18px)_rotateY(-4deg)]"
        />

        {/* Front Primary Hero Window (Flight Board / Catalog) */}
        <BrowserWindowShell
          shellRef={centerRef}
          device={devices.center}
          widthClass="w-[84%] sm:w-[82%] md:w-[84%] relative z-10"
          className="[transform:translate3d(18px,12px,28px)_rotateY(3deg)]"
        />

        {/* Ambient Depth Glow */}
        <div className="pointer-events-none absolute -bottom-4 h-14 w-3/4 rounded-full bg-blue/15 blur-xl transition-opacity duration-500 group-hover:opacity-100 opacity-40" />
      </div>
    );
  }

  // Fallback to Mobile 3-Phone Fan-Out (SIMARU)
  return (
    <div
      ref={containerRef}
      className="group relative flex items-center justify-center gap-2 overflow-hidden bg-surface/80 px-4 py-6 [perspective:1100px] [transform-style:preserve-3d] sm:gap-3 cursor-pointer select-none"
    >
      {/* Left Device */}
      {devices.left && (
        <PhoneShell
          shellRef={leftRef}
          device={devices.left}
          widthClass="hidden w-24 aspect-[9/19] sm:block md:w-28 opacity-90"
          className="[transform:translate3d(12px,8px,-15px)_rotateY(-8deg)]"
        />
      )}

      {/* Center Hero Device */}
      <PhoneShell
        shellRef={centerRef}
        device={devices.center}
        widthClass="relative z-10 w-36 aspect-[9/19] md:w-44"
        className="[transform:translate3d(0,0,30px)]"
      />

      {/* Right Device */}
      {devices.right && (
        <PhoneShell
          shellRef={rightRef}
          device={devices.right}
          widthClass="hidden w-24 aspect-[9/19] sm:block md:w-28 opacity-90"
          className="[transform:translate3d(-12px,8px,-15px)_rotateY(8deg)]"
        />
      )}

      {/* Ambient Depth Glow */}
      <div className="pointer-events-none absolute -bottom-4 h-12 w-3/4 rounded-full bg-blue/10 blur-xl transition-opacity duration-500 group-hover:opacity-100 opacity-40" />
    </div>
  );
}
