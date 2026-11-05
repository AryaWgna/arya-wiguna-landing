"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { isReducedMotion } from "@/lib/gsap";
import type { FanOutDevices, FanOutDevice } from "@/lib/data/projects";

export type { FanOutDevices, FanOutDevice };

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
      className={`overflow-hidden rounded-[1.2rem] border-[3px] border-foreground/85 bg-foreground shadow-xl transition-shadow duration-300 will-change-transform ${widthClass} ${className ?? ""}`}
    >
      <div className="relative h-full w-full overflow-hidden bg-surface">
        <Image
          src={`/${device.src.replace(/^\//, "")}`}
          alt={device.alt ?? ""}
          width={360}
          height={760}
          className="h-full w-full select-none object-cover object-top"
        />
      </div>
    </div>
  );
}

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
      className={`overflow-hidden rounded-xl border border-border-line bg-background shadow-xl transition-shadow duration-300 will-change-transform ${widthClass} ${className ?? ""}`}
    >
      <div className="flex h-5 items-center gap-1.5 border-b border-border-line bg-surface px-3">
        <span className="h-2 w-2 rounded-full bg-border-line" />
        <span className="h-2 w-2 rounded-full bg-border-line" />
        <span className="h-2 w-2 rounded-full bg-border-line" />
        <span className="ml-1.5 truncate font-mono text-[9px] text-muted">
          {device.alt ?? "web-app"}
        </span>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
        <Image
          src={`/${device.src.replace(/^\//, "")}`}
          alt={device.alt ?? ""}
          width={960}
          height={540}
          className="h-full w-full select-none object-cover object-center"
        />
      </div>
    </div>
  );
}

export function DeviceFanOutMockup({
  devices,
  featured = false,
}: {
  devices: FanOutDevices;
  featured?: boolean;
}) {
  const isDesktop =
    devices.layout === "desktop" || (!devices.left && !devices.right && Boolean(devices.secondary));

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let hovering = false;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const onPointerEnter = () => {
      hovering = true;
      if (!raf) loop();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      targetY = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
    };

    const onPointerLeave = () => {
      hovering = false;
      targetX = 0;
      targetY = 0;
    };

    const loop = () => {
      curX += (targetX - curX) * 0.09;
      curY += (targetY - curY) * 0.09;

      if (isDesktop) {
        const secEl = secondaryRef.current;
        const mainEl = centerRef.current;

        if (secEl) {
          const tx = -20 + curX * -12;
          const ty = -12 + curY * 6;
          const ry = -3 + curX * 7;
          const rx = -curY * 6;
          secEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, -14px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`;
        }

        if (mainEl) {
          const tx = 16 + curX * -8;
          const ty = 12 + curY * 6;
          const ry = 2.5 + curX * 8;
          const rx = -curY * 6;
          const scale = hovering ? 1.015 : 1;
          mainEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 22px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) scale(${scale})`;
        }
      } else {
        const leftEl = leftRef.current;
        const centerEl = centerRef.current;
        const rightEl = rightRef.current;

        if (leftEl) {
          const ry = -7 + curX * 10;
          const rx = -curY * 7;
          const tx = 10 + curX * -10;
          const ty = 8 + curY * 6;
          leftEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, -12px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`;
        }

        if (centerEl) {
          const ry = curX * 9;
          const rx = -curY * 6;
          const scale = hovering ? 1.025 : 1;
          centerEl.style.transform = `translate3d(0px, 0px, 24px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) scale(${scale})`;
        }

        if (rightEl) {
          const ry = 7 + curX * 10;
          const rx = -curY * 7;
          const tx = -10 + curX * -10;
          const ty = 8 + curY * 6;
          rightEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, -12px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`;
        }
      }

      if (hovering || Math.abs(curX) > 0.001 || Math.abs(curY) > 0.001) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const leftEl = leftRef.current;
    const centerEl = centerRef.current;
    const rightEl = rightRef.current;
    const secEl = secondaryRef.current;

    el.addEventListener("pointerenter", onPointerEnter);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onPointerEnter);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      if (leftEl) leftEl.style.transform = "";
      if (centerEl) centerEl.style.transform = "";
      if (rightEl) rightEl.style.transform = "";
      if (secEl) secEl.style.transform = "";
    };
  }, [isDesktop]);

  if (isDesktop && devices.secondary) {
    return (
      <div
        ref={containerRef}
        className="group relative flex min-h-[220px] select-none items-center justify-center overflow-hidden bg-surface/75 px-4 py-8 sm:min-h-[250px] [perspective:1200px] [transform-style:preserve-3d]"
      >
        <BrowserWindowShell
          shellRef={secondaryRef}
          device={devices.secondary}
          widthClass="w-[76%] sm:w-[74%] opacity-85 group-hover:opacity-100"
          className="[transform:translate3d(-20px,-12px,-14px)_rotateY(-3deg)]"
        />
        <BrowserWindowShell
          shellRef={centerRef}
          device={devices.center}
          widthClass="relative z-10 w-[82%] sm:w-[82%]"
          className="[transform:translate3d(16px,12px,22px)_rotateY(2.5deg)]"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`group relative flex select-none items-center justify-center gap-2 overflow-hidden bg-surface/75 px-4 sm:gap-3 [perspective:1100px] [transform-style:preserve-3d] ${
        featured ? "min-h-[300px] py-8 md:min-h-full md:py-10" : "py-6"
      }`}
    >
      {devices.left ? (
        <PhoneShell
          shellRef={leftRef}
          device={devices.left}
          widthClass="hidden aspect-[9/19] w-24 opacity-90 sm:block md:w-28"
          className="[transform:translate3d(10px,8px,-12px)_rotateY(-7deg)]"
        />
      ) : null}

      <PhoneShell
        shellRef={centerRef}
        device={devices.center}
        widthClass="relative z-10 aspect-[9/19] w-36 md:w-44"
        className="[transform:translate3d(0,0,24px)]"
      />

      {devices.right ? (
        <PhoneShell
          shellRef={rightRef}
          device={devices.right}
          widthClass="hidden aspect-[9/19] w-24 opacity-90 sm:block md:w-28"
          className="[transform:translate3d(-10px,8px,-12px)_rotateY(7deg)]"
        />
      ) : null}
    </div>
  );
}
