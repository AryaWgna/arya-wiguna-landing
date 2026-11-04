"use client";

import { useEffect, useRef, useState } from "react";
import { isReducedMotion } from "@/lib/gsap";

export function CustomCursor() {
  const pointerRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = -100;
    let mouseY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

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

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return null;
  }

  return (
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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
        >
          <path
            d="M0 0L7.5 19.5L10.5 12.2L17.5 9.2L0 0Z"
            className="fill-background stroke-blue"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M2.5 3.5L7.5 15.5L9.6 11L14.5 8.8L2.5 3.5Z"
            className="fill-navy/20 dark:fill-blue/25"
          />
        </svg>
      </div>
    </div>
  );
}
