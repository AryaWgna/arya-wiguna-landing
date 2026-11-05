"use client";

import { useLang } from "@/components/providers";
import type { RationaleItem } from "@/lib/data/projects";

export function ProjectRationaleBox({ rationale }: { rationale: RationaleItem[] }) {
  const { t, lang } = useLang();

  return (
    <div className="rounded-xl border border-border-line bg-surface/35 p-5">
      <div className="mb-4 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-navy">
        <svg
          className="h-4 w-4 text-blue"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span>{t("proj-rationale")}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {rationale.map((item) => (
          <div
            key={item.technology}
            className="flex flex-col gap-1.5 rounded-lg border border-border-line bg-background p-4"
          >
            <span className="font-mono text-xs font-bold text-foreground">{item.technology}</span>
            <p className="text-xs leading-relaxed text-muted">
              <strong className="font-medium text-foreground">{t("proj-why")}</strong>{" "}
              {item.reason[lang]}
            </p>
            <p className="text-xs leading-relaxed text-muted/85">
              <strong className="font-medium text-foreground/85">{t("proj-tradeoff")}</strong>{" "}
              {item.tradeoff[lang]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
