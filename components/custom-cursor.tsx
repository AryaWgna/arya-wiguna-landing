"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const pointerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const hoveredRef = useRef(false);

  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Custom cursor is intentionally active regardless of prefers-reduced-motion
    // (the user explicitly asked to replace the native cursor). Fine-pointer
    // devices only.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const onMouseMove = (e: MouseEvent) => {
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }

      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      const nextHovered = Boolean(
        target?.closest(
          "a, button, summary, input, textarea, select, [role='button'], [data-cursor-hover], .btn"
        )
      );
      if (nextHovered !== hoveredRef.current) {
        hoveredRef.current = nextHovered;
        setIsHovered(nextHovered);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };
    const onMouseEnter = () => {
      visibleRef.current = true;
      setIsVisible(true);
    };

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
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={pointerRef}
      data-custom-cursor
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[99999] transition-opacity duration-150 will-change-transform ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative origin-top-left transition-transform duration-150 ease-out ${
          isHovered ? "-rotate-6 scale-110" : "rotate-0 scale-100"
        } ${isClicked ? "scale-90" : ""}`}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.28)]"
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
