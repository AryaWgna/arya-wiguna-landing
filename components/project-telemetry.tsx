"use client";

import { useLang } from "@/components/providers";
import type { TelemetryMetric } from "@/lib/data/projects";

export function ProjectTelemetry({
  metrics,
  className = "",
}: {
  metrics: TelemetryMetric[];
  className?: string;
}) {
  const { lang } = useLang();

  if (!metrics || metrics.length === 0) return null;

  return (
    <dl
      className={`grid grid-cols-1 gap-2.5 sm:grid-cols-3 ${className}`}
    >
      {metrics.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-border-line bg-surface/65 p-3.5 transition-colors hover:border-navy/40"
        >
          <dt className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
            {item.label[lang]}
          </dt>
          <dd className="mt-1 font-mono text-base font-extrabold tracking-tight text-foreground sm:text-lg">
            {item.value}
          </dd>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted/85">
            {item.detail[lang]}
          </p>
        </div>
      ))}
    </dl>
  );
}
