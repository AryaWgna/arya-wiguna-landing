"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useLang, useTheme } from "@/components/providers";

type AnimatedThemeTogglerProps = {
  className?: string;
  duration?: number;
};

export function AnimatedThemeToggler({
  className = "",
  duration = 500,
}: AnimatedThemeTogglerProps) {
  const { theme, setTheme } = useTheme();
  const { lang } = useLang();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isId = lang === "id";
  const isDark = mounted && theme === "dark";

  const handleToggle = useCallback(async () => {
    const btn = buttonRef.current;
    const root = document.documentElement;
    const currentlyDark =
      root.classList.contains("dark") ||
      root.dataset.theme === "dark" ||
      theme === "dark";
    const nextTheme: "light" | "dark" = currentlyDark ? "light" : "dark";

    const applyTheme = () => {
      flushSync(() => {
        setTheme(nextTheme);
      });
      root.classList.toggle("dark", nextTheme === "dark");
      root.dataset.theme = nextTheme;
      try {
        localStorage.setItem("theme", nextTheme);
      } catch {}
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      !btn ||
      reducedMotion ||
      typeof document.startViewTransition !== "function"
    ) {
      applyTheme();
      return;
    }

    const { top, left, width, height } = btn.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    root.classList.add("theme-transitioning");

    try {
      const transition = document.startViewTransition(() => {
        applyTheme();
      });

      await transition.ready;

      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );

      await transition.finished;
    } catch {
      applyTheme();
    } finally {
      root.classList.remove("theme-transitioning");
    }
  }, [duration, setTheme, theme]);

  const label = !mounted
    ? "Toggle theme"
    : isDark
      ? isId
        ? "Aktifkan mode terang"
        : "Switch to light mode"
      : isId
        ? "Aktifkan mode gelap"
        : "Switch to dark mode";

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      aria-label={label}
      className={`relative inline-flex items-center justify-center rounded border border-border-line p-2 text-muted transition-colors hover:border-navy hover:text-foreground ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90"
      >
        <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>

      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="absolute scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    </button>
  );
}

