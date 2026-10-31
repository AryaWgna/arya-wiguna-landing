"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/providers";
import { profile } from "@/lib/data/profile";

export function CvDropdown() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {t("hero-cv")}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-lg border border-border-line bg-background shadow-xl"
        >
          <a
            role="menuitem"
            href={profile.cv.ats}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-surface"
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
              className="mt-1 shrink-0 text-blue"
              aria-hidden="true"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
            </svg>
            <span className="flex flex-col">
              <strong className="text-sm font-semibold text-foreground">{t("cv-ats")}</strong>
              <small className="text-xs text-muted">{t("cv-ats-sub")}</small>
            </span>
          </a>
          <a
            role="menuitem"
            href={profile.cv.creative}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 border-t border-border-line px-4 py-3.5 transition-colors hover:bg-surface"
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
              className="mt-1 shrink-0 text-blue"
              aria-hidden="true"
            >
              <path d="m11 5 11 11-3 3-6-6-5 5-5-5 1-3 4-2 4-3Z" />
            </svg>
            <span className="flex flex-col">
              <strong className="text-sm font-semibold text-foreground">{t("cv-creative")}</strong>
              <small className="text-xs text-muted">{t("cv-creative-sub")}</small>
            </span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
