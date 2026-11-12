"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLang } from "@/components/providers";
import { profile } from "@/lib/data/profile";

type MenuPos = {
  top?: number;
  bottom?: number;
  maxHeight: number;
  left: number;
  mobile: boolean;
};

export function CvDropdown() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<MenuPos>({
    top: 0,
    maxHeight: 360,
    left: 16,
    mobile: false,
  });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isId = lang === "id";

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    const btn = btnRef.current;
    if (!btn || typeof window === "undefined") return;

    const rect = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 640;
    const spaceBelow = vh - rect.bottom - 16;
    const spaceAbove = rect.top - 76;
    const flipUp = spaceBelow < 220 && spaceAbove > spaceBelow;

    const left = isMobile
      ? 16
      : Math.max(16, Math.min(rect.left, vw - 344 - 16));

    if (flipUp) {
      setPos({
        bottom: vh - rect.top + 8,
        maxHeight: Math.max(180, spaceAbove),
        left,
        mobile: isMobile,
      });
    } else {
      const top = Math.max(72, rect.bottom + 8);
      setPos({
        top,
        maxHeight: Math.max(180, vh - top - 16),
        left,
        mobile: isMobile,
      });
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onViewportChange = () => updatePosition();

    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange);
    };
  }, [open, updatePosition]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          if (!open) updatePosition();
          setOpen((v) => !v);
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {t("hero-cv")}
        <svg
          width="13"
          height="13"
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

      {mounted && open
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-orientation="vertical"
              style={
                pos.mobile
                  ? {
                      top: pos.top,
                      bottom: pos.bottom,
                      maxHeight: pos.maxHeight,
                      left: 16,
                      right: 16,
                    }
                  : {
                      top: pos.top,
                      bottom: pos.bottom,
                      maxHeight: pos.maxHeight,
                      left: pos.left,
                      width: 344,
                    }
              }
              className="fixed z-[95] overflow-y-auto rounded-3xl border border-border-line bg-surface/95 p-3.5 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-2.5 flex items-center justify-between border-b border-border-line px-1 pb-2">
                <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-muted">
                  {isId ? "Pilih Format & Bahasa" : "Select Format & Language"}
                </span>
                <span className="font-mono text-[10px] font-bold text-navy">PDF</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="rounded-2xl border border-border-line bg-background/80 p-3 transition-colors hover:border-navy/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs font-bold text-foreground">
                          {t("cv-ats")}
                        </strong>
                        <span className="rounded-full bg-navy/15 px-2 py-0.5 font-mono text-[9px] font-bold text-navy">
                          ATS
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-muted">
                        {isId
                          ? "Format satu kolom standar rekrutmen"
                          : "Single-column standard resume"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <a
                        role="menuitem"
                        href={profile.cv.atsId}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        title="CV ATS (Bahasa Indonesia)"
                        className="rounded-full border border-border-line bg-surface px-3 py-1 font-mono text-[11px] font-bold text-foreground transition-colors hover:border-navy hover:bg-navy hover:text-white"
                      >
                        ID
                      </a>
                      <a
                        role="menuitem"
                        href={profile.cv.ats}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        title="CV ATS (English)"
                        className="rounded-full border border-border-line bg-surface px-3 py-1 font-mono text-[11px] font-bold text-foreground transition-colors hover:border-navy hover:bg-navy hover:text-white"
                      >
                        EN
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border-line bg-background/80 p-3 transition-colors hover:border-navy/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs font-bold text-foreground">
                          {t("cv-creative")}
                        </strong>
                        <span className="rounded-full border border-border-line bg-surface px-2 py-0.5 font-mono text-[9px] font-bold text-muted">
                          2-Col
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-muted">
                        {isId
                          ? "Tata letak 2 kolom dengan foto"
                          : "Two-column layout with photo"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <a
                        role="menuitem"
                        href={profile.cv.creativeId}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        title="CV Kreatif (Bahasa Indonesia)"
                        className="rounded-full border border-border-line bg-surface px-3 py-1 font-mono text-[11px] font-bold text-foreground transition-colors hover:border-navy hover:bg-navy hover:text-white"
                      >
                        ID
                      </a>
                      <a
                        role="menuitem"
                        href={profile.cv.creative}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        title="Creative CV (English)"
                        className="rounded-full border border-border-line bg-surface px-3 py-1 font-mono text-[11px] font-bold text-foreground transition-colors hover:border-navy hover:bg-navy hover:text-white"
                      >
                        EN
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
