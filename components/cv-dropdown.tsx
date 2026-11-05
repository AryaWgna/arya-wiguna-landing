"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/providers";
import { profile } from "@/lib/data/profile";

export function CvDropdown() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isId = lang === "id";

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
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        className="btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
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

      {open ? (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute left-0 top-full z-50 mt-2 w-76 sm:w-88 overflow-hidden rounded-xl border border-border-line bg-background p-3 shadow-xl"
        >
          <div className="mb-2.5 flex items-center justify-between border-b border-border-line pb-2 px-1">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
              {isId ? "Pilih Format & Bahasa" : "Select Format & Language"}
            </span>
            <span className="font-mono text-[10px] text-muted">PDF</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="rounded-lg border border-border-line bg-surface/40 p-3 transition-colors hover:border-navy/40">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-xs font-semibold text-foreground">
                      {t("cv-ats")}
                    </strong>
                    <span className="rounded border border-blue/30 bg-blue-soft px-1.5 py-0.5 font-mono text-[9px] font-semibold text-navy">
                      ATS
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-muted">
                    {isId ? "Format satu kolom standar rekrutmen" : "Single-column standard resume"}
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
                    className="rounded border border-border-line bg-background px-2.5 py-1 font-mono text-[11px] font-semibold text-foreground transition-colors hover:border-navy hover:text-navy"
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
                    className="rounded border border-border-line bg-background px-2.5 py-1 font-mono text-[11px] font-semibold text-foreground transition-colors hover:border-navy hover:text-navy"
                  >
                    EN
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border-line bg-surface/40 p-3 transition-colors hover:border-navy/40">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-xs font-semibold text-foreground">
                      {t("cv-creative")}
                    </strong>
                    <span className="rounded border border-border-line bg-background px-1.5 py-0.5 font-mono text-[9px] font-semibold text-muted">
                      2-Col
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-muted">
                    {isId ? "Tata letak 2 kolom dengan foto" : "Two-column layout with photo"}
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
                    className="rounded border border-border-line bg-background px-2.5 py-1 font-mono text-[11px] font-semibold text-foreground transition-colors hover:border-navy hover:text-navy"
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
                    className="rounded border border-border-line bg-background px-2.5 py-1 font-mono text-[11px] font-semibold text-foreground transition-colors hover:border-navy hover:text-navy"
                  >
                    EN
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
