"use client";

import { useLang } from "@/components/providers";
import type { RationaleItem } from "@/lib/data/projects";

/**
 * Pattern 2 — Project Dossier: Architectural Trade-Offs & Rationale.
 */
export function ProjectRationaleBox({ rationale }: { rationale: RationaleItem[] }) {
  const { t, lang } = useLang();

  return (
    <div className="rounded-xl border border-border-line bg-surface/30 p-5 font-mono text-xs">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy">
        <svg
          className="h-4 w-4 text-blue"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        {t("proj-rationale")}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {rationale.map((item) => (
          <div
            key={item.technology}
            className="flex flex-col gap-1.5 rounded-lg border border-border-line bg-background p-3.5"
          >
            <span className="text-sm font-bold text-foreground">{item.technology}</span>
            <p className="font-sans text-xs leading-relaxed text-muted">
              <strong className="text-foreground">{t("proj-why")}</strong> {item.reason[lang]}
            </p>
            <p className="font-sans text-[11px] italic leading-relaxed text-muted/80">
              <strong className="not-italic">{t("proj-tradeoff")}</strong> {item.tradeoff[lang]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
