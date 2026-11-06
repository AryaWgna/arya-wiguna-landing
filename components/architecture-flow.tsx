"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/providers";
import type { ArchitectureFlow as ArchitectureFlowType, ArchitectureStep } from "@/lib/data/projects";

interface ArchitectureFlowProps {
  flow: ArchitectureFlowType;
  className?: string;
  autoPlayDefault?: boolean;
}

function getNodeIcon(nodeName: string) {
  const name = nodeName.toLowerCase();
  if (name.includes("scanner") || name.includes("client") || name.includes("svelte") || name.includes("ui")) {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16M9 4v5" />
      </svg>
    );
  }
  if (name.includes("gateway") || name.includes("proxy") || name.includes("token")) {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 4.5-3 8.5-7 9.8C8 20.5 5 16.5 5 12V7l7-4z" />
      </svg>
    );
  }
  if (name.includes("database") || name.includes("mysql") || name.includes("assets")) {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <rect x="3" y="5" width="18" height="6" rx="1.5" />
      <rect x="3" y="13" width="18" height="6" rx="1.5" />
      <path strokeLinecap="round" d="M7 8h.01M7 16h.01" />
    </svg>
  );
}

export function ArchitectureFlow({
  flow,
  className = "",
  autoPlayDefault = false,
}: ArchitectureFlowProps) {
  const { lang } = useLang();
  const isId = lang === "id";
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlayDefault);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= flow.steps.length ? 1 : prev + 1));
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying, flow.steps.length]);

  const selectedStep: ArchitectureStep =
    flow.steps.find((s) => s.step === activeStep) ?? flow.steps[0];

  const handleSelect = (stepNum: number) => {
    setIsPlaying(false);
    setActiveStep(stepNum);
  };

  const handleCopyPayload = () => {
    if (!selectedStep.payloadExample) return;
    navigator.clipboard.writeText(selectedStep.payloadExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`rounded-xl border border-border-line bg-surface/35 p-4 sm:p-5 md:p-6 ${className}`}>
      <div className="flex flex-col gap-3 border-b border-border-line pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-base font-semibold tracking-tight text-foreground">
            {flow.title[lang]}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {flow.subtitle[lang]}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start">
          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors ${
              isPlaying
                ? "border-navy bg-navy text-background"
                : "border-border-line bg-background text-muted hover:border-navy hover:text-foreground"
            }`}
          >
            {isPlaying
              ? isId
                ? "Jeda"
                : "Pause"
              : isId
                ? "Putar Otomatis"
                : "Auto-step"}
          </button>
          <span className="rounded-md border border-border-line bg-background px-2.5 py-1 font-mono text-[11px] text-muted">
            {flow.steps.length} {isId ? "tahap" : "stages"}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {flow.steps.map((item, idx) => {
            const isCurrent = item.step === activeStep;
            const isLast = idx === flow.steps.length - 1;

            return (
              <div key={item.step} className="relative flex min-w-0 items-stretch">
                <button
                  type="button"
                  onClick={() => handleSelect(item.step)}
                  className={`flex min-w-0 w-full flex-col justify-between rounded-lg border p-3 sm:p-3.5 text-left transition-colors ${
                    isCurrent
                      ? "border-navy bg-navy text-background shadow-sm"
                      : "border-border-line bg-background text-foreground hover:border-navy/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono text-[11px] font-semibold ${
                        isCurrent ? "text-background/80" : "text-blue"
                      }`}
                    >
                      0{item.step}
                    </span>
                    <span className={isCurrent ? "text-background/85" : "text-muted"}>
                      {getNodeIcon(item.node)}
                    </span>
                  </div>

                  <div className="mt-2.5 sm:mt-3">
                    <div className="truncate font-mono text-xs font-semibold">
                      {item.node}
                    </div>
                    <div
                      className={`mt-0.5 truncate text-[11px] ${
                        isCurrent ? "text-background/75" : "text-muted"
                      }`}
                    >
                      {item.role[lang]}
                    </div>
                  </div>
                </button>

                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 font-mono text-xs text-muted sm:block"
                  >
                    →
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border-line bg-background p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-line pb-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-mono text-xs font-semibold text-blue">
              0{selectedStep.step}
            </span>
            <h5 className="font-mono text-sm font-bold text-foreground">
              {selectedStep.node}
            </h5>
            <span className="text-xs text-muted">· {selectedStep.role[lang]}</span>
          </div>

          <span className="rounded border border-border-line bg-surface/70 px-2 py-0.5 font-mono text-[11px] text-muted">
            {selectedStep.protocol}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-foreground/90">
          {selectedStep.description[lang]}
        </p>

        {selectedStep.payloadExample ? (
          <div className="mt-4 overflow-hidden rounded-lg border border-border-line bg-surface/60">
            <div className="flex items-center justify-between border-b border-border-line bg-surface px-3 py-1.5 font-mono text-[11px] text-muted">
              <span className="truncate">
                {selectedStep.codeLabel ?? (isId ? "Potongan konfigurasi / route" : "Route / config reference")}
              </span>
              <button
                type="button"
                onClick={handleCopyPayload}
                className="shrink-0 font-mono text-[11px] text-blue transition-colors hover:text-navy"
              >
                {copied ? (isId ? "Tersalin ✓" : "Copied ✓") : isId ? "Salin" : "Copy"}
              </button>
            </div>

            <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-foreground">
              <code>{selectedStep.payloadExample}</code>
            </pre>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between border-t border-border-line/70 pt-3 font-mono text-xs text-muted">
          <button
            type="button"
            disabled={activeStep <= 1}
            onClick={() => handleSelect(activeStep - 1)}
            className="rounded px-2 py-1 transition-colors hover:text-foreground disabled:opacity-35"
          >
            ← {isId ? "Sebelumnya" : "Previous"}
          </button>
          <span>
            {activeStep} / {flow.steps.length}
          </span>
          <button
            type="button"
            disabled={activeStep >= flow.steps.length}
            onClick={() => handleSelect(activeStep + 1)}
            className="rounded px-2 py-1 font-semibold text-blue transition-colors hover:text-navy disabled:opacity-35"
          >
            {isId ? "Berikutnya" : "Next"} →
          </button>
        </div>
      </div>
    </div>
  );
}
