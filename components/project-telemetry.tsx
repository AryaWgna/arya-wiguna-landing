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
      className={`grid grid-cols-1 gap-2.5 border-y border-border-line py-3.5 sm:grid-cols-3 sm:gap-3 ${className}`}
    >
      {metrics.map((item, idx) => (
        <div
          key={item.id}
          className={
            idx > 0
              ? "border-t border-border-line/70 pt-2.5 sm:border-t-0 sm:border-l sm:border-border-line sm:pt-0 sm:pl-3"
              : ""
          }
        >
          <div className="flex items-baseline justify-between gap-2 sm:block">
            <dt className="font-mono text-[11px] text-muted">{item.label[lang]}</dt>
            <dd className="font-mono text-sm font-semibold tracking-tight text-foreground sm:mt-0.5 sm:text-base">
              {item.value}
            </dd>
          </div>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted/85">
            {item.detail[lang]}
          </p>
        </div>
      ))}
    </dl>
  );
}
