"use client";

import { useEffect, useRef, useState } from "react";
import { isReducedMotion } from "@/lib/gsap";

export function CustomCursor() {
  const pointerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Disable on touch devices or if reduced motion is preferred
    if (isReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    // Add class to html to hide native Windows cursor
    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let raf = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Zero-latency instant hardware transform for the custom pointer
      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering over clickable or interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          "a, button, input, textarea, select, [role='button'], [data-cursor-hover], .btn, [data-project-card]"
        );
        setIsHovered(!!interactive);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Smooth lerp loop for the trailing precision reticle (60-120 FPS)
    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

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
      document.documentElement.classList.remove("has-custom-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  // Don't render on touch / SSR
  if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return null;
  }

  return (
    <>
      {/* ── Trailing Kinetic Reticle / Halo ───────────────── */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[99998] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[opacity,width,height,border-color,background-color] duration-200 ease-out will-change-transform ${
          !isVisible ? "opacity-0" : "opacity-100"
        } ${
          isHovered
            ? "h-10 w-10 border border-blue bg-blue/15 shadow-[0_0_15px_rgba(59,130,246,0.35)] backdrop-blur-[1px]"
            : "h-6 w-6 border border-blue/35 bg-transparent"
        } ${isClicked ? "scale-75" : "scale-100"}`}
      />

      {/* ── Custom Pointer Shape (Replaces Windows Arrow) ──── */}
      <div
        ref={pointerRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[99999] transition-opacity duration-150 will-change-transform ${
          !isVisible ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className={`relative transition-transform duration-150 ease-out origin-top-left ${
            isHovered ? "-rotate-6 scale-110" : "rotate-0 scale-100"
          } ${isClicked ? "scale-85" : ""}`}
        >
          {/* Bespoke Precision Stealth Arrowhead */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
          >
            {/* Arrowhead body with dynamic theme fill and blue edge */}
            <path
              d="M0 0L8.5 20.5L12 12.8L19.5 9.2L0 0Z"
              className="fill-background stroke-blue"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            {/* Subtle inner core accent */}
            <path
              d="M3 4L8.5 16.5L10.8 11.5L16 9L3 4Z"
              className="fill-navy/20 dark:fill-blue/25"
            />
            {/* Glowing cyan laser tip */}
            <circle
              cx="2.5"
              cy="2.5"
              r="2"
              className="fill-sky-400 animate-pulse"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
