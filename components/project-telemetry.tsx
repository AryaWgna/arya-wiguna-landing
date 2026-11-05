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
      className={`grid grid-cols-3 gap-3 border-y border-border-line py-3.5 ${className}`}
    >
      {metrics.map((item, idx) => (
        <div
          key={item.id}
          className={idx > 0 ? "border-l border-border-line pl-3" : ""}
        >
          <dt className="font-mono text-[11px] text-muted">{item.label[lang]}</dt>
          <dd className="mt-0.5 font-mono text-sm font-semibold tracking-tight text-foreground sm:text-base">
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
