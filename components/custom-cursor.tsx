"use client";

import { useEffect, useRef, useState } from "react";
import { isReducedMotion } from "@/lib/gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);

  useEffect(() => {
    // Disable on touch devices or if reduced motion is requested
    if (isReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let raf = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Fast, lag-free hardware transform for the center pinpoint dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering over clickable or interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          "a, button, input, textarea, select, [role='button'], [data-cursor-hover], .btn, [data-project-card]"
        );
        setIsHovered(!!interactive);

        // Optional custom text badge (e.g. data-cursor-text="VIEW")
        const textTarget = target.closest("[data-cursor-text]") as HTMLElement | null;
        if (textTarget) {
          setCursorText(textTarget.dataset.cursorText ?? null);
        } else {
          setCursorText(null);
        }
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Damped lerp loop for the outer trailing halo ring (60-120 FPS)
    const loop = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  // Don't render on touch or SSR
  if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return null;
  }

  return (
    <>
      {/* ── Outer Trailing Halo Ring ─────────────────────── */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[99999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[opacity,width,height,border-color,background-color] duration-200 ease-out will-change-transform ${
          !isVisible ? "opacity-0" : "opacity-100"
        } ${
          isHovered
            ? "h-11 w-11 border border-blue bg-blue/15 shadow-[0_0_16px_rgba(59,130,246,0.3)] backdrop-blur-[1px]"
            : "h-7 w-7 border border-blue/40 bg-transparent"
        } ${isClicked ? "scale-75" : "scale-100"}`}
      >
        {cursorText && (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold text-white tracking-widest uppercase">
            {cursorText}
          </span>
        )}
      </div>

      {/* ── Inner Zero-Lag Laser Dot ──────────────────────── */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[100000] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue transition-[opacity,transform,background-color] duration-150 will-change-transform ${
          !isVisible ? "opacity-0" : "opacity-100"
        } ${
          isHovered ? "h-1.5 w-1.5 bg-blue-light" : "h-2 w-2"
        } ${isClicked ? "scale-50 bg-navy" : "scale-100"}`}
      />
    </>
  );
}
