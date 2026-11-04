"use client";

import { useLayoutEffect, useRef } from "react";
import { useLang } from "@/components/providers";
import type { TelemetryMetric } from "@/lib/data/projects";
import { useWebAudioGlitch } from "@/lib/use-web-audio-glitch";
import { gsap, isReducedMotion } from "@/lib/gsap";

interface ProjectTelemetryProps {
  metrics: TelemetryMetric[];
  className?: string;
  compact?: boolean;
}

export function ProjectTelemetry({
  metrics,
  className = "",
  compact = false,
}: ProjectTelemetryProps) {
  const { lang } = useLang();
  const rootRef = useRef<HTMLDivElement>(null);
  const { playGlitch } = useWebAudioGlitch();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (isReducedMotion()) {
      root.querySelectorAll<HTMLElement>("[data-telemetry-target]").forEach((el) => {
        const target = Number(el.dataset.telemetryTarget || "0");
        el.textContent = target.toLocaleString();
      });
      return;
    }

    const ctx = gsap.context(() => {
      const counters = root.querySelectorAll<HTMLElement>("[data-telemetry-target]");
      counters.forEach((num) => {
        const target = Number(num.dataset.telemetryTarget || "0");
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: num,
            start: "top 92%",
            once: true,
          },
          onUpdate: () => {
            num.textContent = Math.round(obj.val).toLocaleString();
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [metrics]);

  if (!metrics || metrics.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className={`rounded-xl border border-border-line bg-surface/40 p-3 font-mono ${className}`}
    >
      <div className="mb-2 flex items-center justify-between border-b border-border-line/60 pb-1.5 text-[10px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="tracking-wider uppercase">
            {lang === "id" ? "TELEMETRI SISTEM" : "SYSTEM TELEMETRY"}
          </span>
        </span>
        <span className="opacity-60 text-[9px]">LIVE TELEMETRY HUD</span>
      </div>

      <div
        className={`grid gap-2.5 ${
          compact ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3"
        }`}
      >
        {metrics.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => playGlitch("hover")}
            className="group relative flex flex-col justify-between rounded-lg border border-border-line/70 bg-background/80 p-2.5 transition-all hover:border-blue/50 hover:bg-background"
            title={item.detail[lang]}
          >
            <div className="flex items-baseline gap-0.5">
              {item.prefix ? (
                <span className="text-xs font-semibold text-muted">{item.prefix}</span>
              ) : null}
              <span
                data-telemetry-target={item.value}
                className="text-lg font-bold tracking-tight text-foreground"
              >
                0
              </span>
              {item.suffix ? (
                <span className="text-xs font-semibold text-blue">{item.suffix}</span>
              ) : null}
            </div>

            <div className="mt-1 flex flex-col">
              <span className="text-[10px] font-medium tracking-tight text-foreground/90 group-hover:text-blue">
                {item.label[lang]}
              </span>
              <span className="line-clamp-1 text-[9px] text-muted opacity-80">
                {item.detail[lang]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

