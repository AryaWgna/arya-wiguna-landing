"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/providers";
import { profile } from "@/lib/data/profile";
import { useWebAudioGlitch } from "@/lib/use-web-audio-glitch";

export function CvDropdown() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { playGlitch } = useWebAudioGlitch();

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

  const handleOpen = () => {
    playGlitch("click");
    setOpen((v) => !v);
  };

  const isId = lang === "id";

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        className="btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={handleOpen}
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
          className="absolute left-0 top-full z-50 mt-2 w-80 sm:w-96 overflow-hidden rounded-xl border border-border-line bg-background/95 p-3 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          {/* HEADER / NOTE */}
          <div className="mb-2 flex items-center justify-between border-b border-border-line/60 px-1 pb-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
              {isId ? "Pilih Format & Bahasa" : "Select Format & Language"}
            </span>
            <span className="font-mono text-[10px] text-muted">PDF</span>
          </div>

          <div className="flex flex-col gap-2">
            {/* 1. CV ATS */}
            <div className="rounded-lg border border-border-line/70 bg-surface/40 p-2.5 transition-all hover:border-blue/50">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="rounded-md bg-blue/10 p-1.5 text-blue shrink-0">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-xs font-semibold text-foreground">
                        {t("cv-ats")}
                      </strong>
                      <span className="rounded bg-blue/15 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-blue">
                        ATS
                      </span>
                    </div>
                    <p className="text-[11px] text-muted truncate">
                      {isId ? "Format standar ramah ATS" : "Standard ATS-friendly"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    role="menuitem"
                    href={profile.cv.atsId}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playGlitch("click")}
                    title="CV ATS Bahasa Indonesia"
                    className="flex items-center gap-1 rounded-md border border-border-line bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:border-blue/70 hover:bg-surface hover:text-blue hover:shadow-sm"
                  >
                    <span>🇮🇩</span>
                    <span className="font-mono text-[11px] font-semibold">ID</span>
                  </a>
                  <a
                    role="menuitem"
                    href={profile.cv.ats}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playGlitch("click")}
                    title="CV ATS English"
                    className="flex items-center gap-1 rounded-md border border-border-line bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:border-blue/70 hover:bg-surface hover:text-blue hover:shadow-sm"
                  >
                    <span>🇬🇧</span>
                    <span className="font-mono text-[11px] font-semibold">EN</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 2. CV KREATIF */}
            <div className="rounded-lg border border-border-line/70 bg-surface/40 p-2.5 transition-all hover:border-rose-500/50">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="rounded-md bg-rose-500/10 p-1.5 text-rose-500 shrink-0">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-xs font-semibold text-foreground">
                        {t("cv-creative")}
                      </strong>
                      <span className="rounded bg-rose-500/15 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-rose-500">
                        Visual
                      </span>
                    </div>
                    <p className="text-[11px] text-muted truncate">
                      {isId ? "Desain visual 2-kolom dengan foto" : "Modern 2-column with photo"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    role="menuitem"
                    href={profile.cv.creativeId}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playGlitch("click")}
                    title="CV Kreatif Bahasa Indonesia"
                    className="flex items-center gap-1 rounded-md border border-border-line bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:border-rose-500/70 hover:bg-surface hover:text-rose-500 hover:shadow-sm"
                  >
                    <span>🇮🇩</span>
                    <span className="font-mono text-[11px] font-semibold">ID</span>
                  </a>
                  <a
                    role="menuitem"
                    href={profile.cv.creative}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playGlitch("click")}
                    title="Creative CV English"
                    className="flex items-center gap-1 rounded-md border border-border-line bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:border-rose-500/70 hover:bg-surface hover:text-rose-500 hover:shadow-sm"
                  >
                    <span>🇬🇧</span>
                    <span className="font-mono text-[11px] font-semibold">EN</span>
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
